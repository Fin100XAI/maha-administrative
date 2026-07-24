"""Agentic layer.

A1 — Multi-hop Supersession Checker: for each cited GR, look for a later GR in
     the same department whose subject covers the same topic, and flag status.
A2 — Query Decomposer: split compound questions into atomic sub-questions.
"""
from __future__ import annotations

import json

from .together_client import get_client
from .vectorstore import get_store


# ---------------------------------------------------------------- A1
def _topic_keyword(subject_en: str) -> str:
    """Cheap topic signal: the longest non-trivial token from the subject."""
    words = [w.strip(",.;:()").lower() for w in (subject_en or "").split()]
    words = [w for w in words if len(w) > 5]
    return max(words, key=len) if words else ""


def check_supersession(chunks: list[dict]) -> list[dict]:
    """Annotate each cited chunk with a status badge.

    Returns [{gr_id, status, later_gr}] where status is
    'current' | 'check' | 'superseded'.
    """
    store = get_store()
    seen: dict[str, dict] = {}
    for c in chunks:
        pl = c["payload"]
        gr_id = pl.get("gr_id")
        if gr_id in seen:
            continue
        dept = pl.get("department", "")
        date = pl.get("date", "")
        keyword = _topic_keyword(pl.get("subject_en", ""))
        status, later = "current", None
        if dept and date and keyword:
            later_grs = store.find_later_grs(dept, date, keyword)
            later_grs = [g for g in later_grs if g["payload"].get("gr_id") != gr_id]
            if later_grs:
                later_grs.sort(key=lambda g: g["payload"].get("date", ""), reverse=True)
                lp = later_grs[0]["payload"]
                # explicit amendment if the later GR reads this one
                explicit = gr_id in (lp.get("read_refs") or [])
                status = "superseded" if explicit else "check"
                later = {
                    "gr_id": lp.get("gr_id"),
                    "date": lp.get("date"),
                    "subject_mr": lp.get("subject_mr"),
                    "subject_en": lp.get("subject_en"),
                }
        seen[gr_id] = {"gr_id": gr_id, "status": status, "later_gr": later}
    return list(seen.values())


# ---------------------------------------------------------------- A2
_DECOMPOSE_SYS = (
    "You are a query router for a government document assistant. Decide whether "
    "the user's question is compound (asks two or more independent things that "
    "need separate lookups). Respond with ONLY a JSON object of the form "
    '{"compound": true|false, "subquestions": ["...", "..."]}. '
    "If not compound, subquestions must be an empty list. No prose."
)


async def decompose_query(query: str) -> list[str]:
    """Return a list of atomic sub-questions, or [] if the query is single."""
    client = get_client()
    raw = await client.chat(
        system=_DECOMPOSE_SYS, user=query, temperature=0.0,
        max_tokens=400, json_mode=True,
    )
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if data.get("compound") and isinstance(data.get("subquestions"), list):
        subs = [s for s in data["subquestions"] if isinstance(s, str) and s.strip()]
        return subs if len(subs) > 1 else []
    return []
