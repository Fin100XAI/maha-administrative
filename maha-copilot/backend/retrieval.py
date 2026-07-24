"""Hybrid retrieval engine (F3).

Two stages, department-scoped:
  Stage 1 (recall):   BM25 (per-language) + dense, fused with RRF.
  Stage 2 (precision): Together rerank cross-encoder selects the final top-k.

BM25 indexes are built in-process from the chunk payloads stored in Qdrant and
cached. They rebuild when new data is ingested (see invalidate_bm25).
"""
from __future__ import annotations

import re
import threading

from rank_bm25 import BM25Okapi

from .config import get_settings
from .language import detect_language
from .together_client import get_client
from .vectorstore import get_store

_WORD = re.compile(r"[\w\u0900-\u097F]+", re.UNICODE)


def _tok(text: str) -> list[str]:
    """Devanagari-aware tokenizer (Unicode word chars)."""
    return [t.lower() for t in _WORD.findall(text or "")]


class _BM25Cache:
    """One BM25 index per language, over all chunks. Rows carry the payload so
    we can fuse with dense results by a shared chunk key."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._idx: dict[str, dict] = {}  # lang -> {bm25, rows}

    def invalidate(self) -> None:
        with self._lock:
            self._idx.clear()

    def _build(self, lang: str) -> dict:
        rows = get_store().scroll_all()
        field = "text_mr" if lang == "mr" else "text_en"
        corpus, kept = [], []
        for r in rows:
            text = r["payload"].get(field) or r["payload"].get("text_mr", "")
            toks = _tok(text)
            if toks:
                corpus.append(toks)
                kept.append(r)
        bm25 = BM25Okapi(corpus) if corpus else None
        return {"bm25": bm25, "rows": kept}

    def get(self, lang: str) -> dict:
        with self._lock:
            if lang not in self._idx:
                self._idx[lang] = self._build(lang)
            return self._idx[lang]


_bm25 = _BM25Cache()


def invalidate_bm25() -> None:
    _bm25.invalidate()


def _chunk_key(payload: dict) -> str:
    return f"{payload.get('gr_id')}::{payload.get('chunk_index')}"


def _bm25_search(query: str, lang: str, departments, top_k: int) -> list[dict]:
    idx = _bm25.get(lang)
    if not idx["bm25"]:
        return []
    scores = idx["bm25"].get_scores(_tok(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    dept_set = set(departments) if departments else None
    out = []
    for i in ranked:
        row = idx["rows"][i]
        if dept_set and row["payload"].get("department") not in dept_set:
            continue
        out.append({"payload": row["payload"], "bm25": float(scores[i])})
        if len(out) >= top_k:
            break
    return out


def _rrf(lists: list[list[dict]], k: int = 60) -> list[dict]:
    """Reciprocal Rank Fusion over several ranked result lists."""
    fused: dict[str, dict] = {}
    for results in lists:
        for rank, item in enumerate(results):
            key = _chunk_key(item["payload"])
            entry = fused.setdefault(
                key, {"payload": item["payload"], "rrf": 0.0}
            )
            entry["rrf"] += 1.0 / (k + rank + 1)
    return sorted(fused.values(), key=lambda x: x["rrf"], reverse=True)


async def retrieve(query: str, departments: list[str] | None) -> dict:
    """Full F3 pipeline. Returns {lang, candidates, chunks} where `chunks` is
    the reranked final context list."""
    s = get_settings()
    lang = detect_language(query)
    client = get_client()

    # Stage 1a — dense (cross-lingual)
    qvec = (await client.embed([query]))[0]
    dense = get_store().dense_search(qvec, departments, s.dense_top_k)
    dense_norm = [{"payload": d["payload"], "dense": d["score"]} for d in dense]

    # Stage 1b — BM25 in the query language
    sparse = _bm25_search(query, lang, departments, s.bm25_top_k)

    # Stage 1c — fuse
    fused = _rrf([dense_norm, sparse])[: s.rrf_top_k]
    if not fused:
        return {"lang": lang, "candidates": 0, "chunks": []}

    # Stage 2 — rerank (precision). Use language-appropriate text as the doc.
    field = "text_mr" if lang == "mr" else "text_en"
    docs = [f["payload"].get(field) or f["payload"].get("text_mr", "") for f in fused]
    reranked = await client.rerank(query, docs, s.rerank_top_k)

    chunks = []
    for r in reranked:
        item = fused[r["index"]]
        chunks.append({**item, "rerank": r["relevance_score"]})

    return {"lang": lang, "candidates": len(fused), "chunks": chunks}
