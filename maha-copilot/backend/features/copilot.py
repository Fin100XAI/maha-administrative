"""Maha Copilot — grounded answer generation over the GR corpus.

Wires the retrieval engine (F3), grounded generation (F4), citation cards
(F5), the supersession checker (A1) and the query decomposer (A2) into one
answer.
"""
from __future__ import annotations

import asyncio

from ..agents import check_supersession, decompose_query
from ..config import get_settings
from ..departments import DEPT_BY_SLUG
from ..language import LANG_INSTRUCTION, detect_language
from ..models import Citation, CopilotAnswer
from ..retrieval import retrieve
from ..together_client import get_client

SYSTEM = """You are Maha Copilot, an assistant for Maharashtra government officers.
Answer ONLY from the Government Resolution (GR) context provided. Rules:
- Reply in the SAME LANGUAGE the officer used (formal administrative register).
- Every factual claim MUST cite its GR id and date, inline, like [GR: <id>, <date>].
- If the provided GRs do not answer the question, say so plainly in the officer's language.
- Never guess, infer, or use outside knowledge.
- If a GR appears superseded by a later one, flag it explicitly."""


def _context_block(chunks: list[dict]) -> str:
    parts = []
    for c in chunks:
        pl = c["payload"]
        parts.append(
            f"--- GR: {pl.get('gr_id')} | date: {pl.get('date')} | "
            f"dept: {pl.get('department')} ---\n"
            f"Subject (mr): {pl.get('subject_mr')}\n"
            f"Passage (mr): {pl.get('text_mr')}\n"
            f"Passage (en): {pl.get('text_en')}"
        )
    return "\n\n".join(parts)


async def _answer_single(query: str, departments: list[str] | None) -> dict:
    result = await retrieve(query, departments)
    return {"query": query, **result}


def _build_citations(chunks: list[dict], statuses: dict[str, dict]) -> list[Citation]:
    cites: dict[str, Citation] = {}
    for c in chunks:
        pl = c["payload"]
        gr_id = pl.get("gr_id")
        if gr_id in cites:
            continue
        st = statuses.get(gr_id, {})
        dept = DEPT_BY_SLUG.get(pl.get("department", ""), {}).get(
            "name", pl.get("department", "")
        )
        cites[gr_id] = Citation(
            gr_id=gr_id,
            date=pl.get("date", ""),
            department=dept,
            subject_mr=pl.get("subject_mr", ""),
            subject_en=pl.get("subject_en", ""),
            passage_mr=pl.get("text_mr", ""),
            passage_en=pl.get("text_en", ""),
            source_url=pl.get("source_url", ""),
            status=st.get("status", "current"),
            later_gr=st.get("later_gr"),
        )
    return list(cites.values())


async def run_copilot(query: str, departments, quick_mode: bool) -> CopilotAnswer:
    client = get_client()
    lang = detect_language(query)

    # A2 — decompose compound queries
    subqs = await decompose_query(query)
    parts = subqs if subqs else [query]

    # retrieve for each sub-question (parallel)
    results = await asyncio.gather(*[_answer_single(q, departments) for q in parts])

    all_chunks: list[dict] = []
    for r in results:
        all_chunks.extend(r["chunks"])
    # dedupe chunks by key, preserve best rerank order
    seen, merged = set(), []
    for c in sorted(all_chunks, key=lambda x: x.get("rerank", 0), reverse=True):
        k = f"{c['payload'].get('gr_id')}::{c['payload'].get('chunk_index')}"
        if k not in seen:
            seen.add(k)
            merged.append(c)

    if not merged:
        msg = (
            "दिलेल्या शासन निर्णयांमध्ये या प्रश्नाचे उत्तर आढळले नाही."
            if lang == "mr"
            else "The available GRs do not contain an answer to this question."
        )
        return CopilotAnswer(answer=msg, lang=lang, citations=[], candidates=0,
                             mock=get_settings().mock_mode)

    # A1 — supersession (unless quick mode)
    statuses: dict[str, dict] = {}
    if not quick_mode:
        for s in check_supersession(merged):
            statuses[s["gr_id"]] = s

    # F4 — grounded generation
    context = _context_block(merged)
    user_prompt = (
        f"{LANG_INSTRUCTION[lang]}\n\n"
        f"Officer's question: {query}\n\n"
        f"GR context:\n{context}"
    )
    answer = await client.chat(SYSTEM, user_prompt, temperature=0.2, max_tokens=1600)

    citations = _build_citations(merged, statuses)
    return CopilotAnswer(
        answer=answer,
        lang=lang,
        citations=citations,
        subquestions=subqs,
        candidates=sum(r["candidates"] for r in results),
        mock=get_settings().mock_mode,
    )
