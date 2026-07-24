"""GR Analysis & Circular Analysis.

Same pipeline for both doc types (they differ only in label and schema hints):
  1. structured metadata extraction (LLM, JSON) — GR no., date, dept, subject,
     referenced GRs, effective date, key directives
  2. plain-language summary
  3. optional Q&A grounded in the document text

Works on a doc already in the corpus (by gr_id) or ad-hoc pasted text.
"""
from __future__ import annotations

import json

from ..ingestion import extract_read_refs, parse_date_from_name
from ..models import AnalyzeRequest
from ..together_client import get_client
from ..vectorstore import get_store

_EXTRACT_SYS = """You extract structured metadata from a Maharashtra government
{doc_label}. Return ONLY a JSON object with these keys:
  "gr_number", "date", "department", "subject", "effective_date",
  "referenced_grs" (array), "key_directives" (array of short strings),
  "beneficiaries", "amount_or_budget".
Use "" or [] when a field is absent. Do not invent values. No prose."""

_SUMMARY_SYS = """Summarize this Maharashtra government {doc_label} for an officer
in 4-6 sentences: what it directs, who it affects, and any effective dates or
amounts. Write in {lang_name}. Be factual; do not add outside information."""

_QA_SYS = """Answer the officer's question using ONLY the {doc_label} text
provided. Cite the relevant clause. If the answer is not in the text, say so."""


def _load_text(req: AnalyzeRequest) -> tuple[str, str, dict]:
    """Return (text_mr, text_en, meta) for the target document."""
    if req.text:
        return req.text, "", {}
    if req.gr_id:
        rows = get_store().scroll_all()
        mr_parts, en_parts, meta = [], [], {}
        for r in sorted(
            [x for x in rows if x["payload"].get("gr_id") == req.gr_id],
            key=lambda x: x["payload"].get("chunk_index", 0),
        ):
            pl = r["payload"]
            mr_parts.append(pl.get("text_mr", ""))
            en_parts.append(pl.get("text_en", ""))
            meta = pl
        return "\n".join(mr_parts), "\n".join(en_parts), meta
    return "", "", {}


async def analyze(req: AnalyzeRequest) -> dict:
    client = get_client()
    doc_label = "Circular" if req.doc_type == "circular" else "Government Resolution (GR)"
    text_mr, text_en, meta = _load_text(req)
    primary = text_mr or text_en
    if not primary.strip():
        return {"error": "No document text found for the given gr_id/text."}

    # 1 — structured extraction
    raw = await client.chat(
        _EXTRACT_SYS.format(doc_label=doc_label),
        primary[:8000],
        temperature=0.0,
        max_tokens=800,
        json_mode=True,
    )
    try:
        metadata = json.loads(raw)
    except json.JSONDecodeError:
        metadata = {}
    # backfill with what we already know deterministically
    if meta:
        metadata.setdefault("department", meta.get("department", ""))
        metadata.setdefault("date", meta.get("date", ""))
        metadata.setdefault("gr_number", meta.get("gr_id", ""))
    if not metadata.get("referenced_grs"):
        metadata["referenced_grs"] = extract_read_refs(text_mr)

    # 2 — summary (in the doc's likely language: prefer English display)
    summary = await client.chat(
        _SUMMARY_SYS.format(doc_label=doc_label, lang_name="English"),
        primary[:8000],
        temperature=0.2,
        max_tokens=500,
    )

    out = {"doc_type": req.doc_type, "metadata": metadata, "summary": summary}

    # 3 — optional Q&A
    if req.question:
        ans = await client.chat(
            _QA_SYS.format(doc_label=doc_label),
            f"Question: {req.question}\n\nDocument:\n{primary[:8000]}",
            temperature=0.1,
            max_tokens=700,
        )
        out["answer"] = ans

    return out
