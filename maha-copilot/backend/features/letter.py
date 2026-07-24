"""Letter Drafting — generative, with optional RAG precedent retrieval.

When use_precedent is on, we retrieve a few GRs matching the subject and feed
them as style/precedent context so the draft mirrors real administrative
phrasing and can reference relevant GRs.
"""
from __future__ import annotations

from ..models import LetterRequest
from ..retrieval import retrieve
from ..together_client import get_client

SYSTEM = """You draft formal correspondence for a Maharashtra government office.
Produce clean, ready-to-send text in the requested language, using the correct
administrative register and structure (reference line, subject, body, closing).
Do not invent GR numbers or facts. If precedent GRs are provided, you may
reference them accurately. Keep it concise and professional."""


async def draft_letter(req: LetterRequest) -> dict:
    client = get_client()
    precedent_block, refs = "", []
    if req.use_precedent and req.subject:
        depts = [req.department] if req.department else None
        r = await retrieve(req.subject, depts)
        for c in r["chunks"][:3]:
            pl = c["payload"]
            refs.append(
                {"gr_id": pl.get("gr_id"), "date": pl.get("date"),
                 "subject": pl.get("subject_en")}
            )
            precedent_block += (
                f"\n- GR {pl.get('gr_id')} ({pl.get('date')}): {pl.get('subject_en')}"
            )

    lang_line = "Write the letter in Marathi." if req.language == "mr" else "Write the letter in English."
    user = f"""{lang_line}

Letter type: {req.letter_type}
Recipient: {req.recipient or '[recipient]'}
Subject: {req.subject or '[subject]'}
Department: {req.department or '[department]'}

Key points to convey:
{req.key_points or '[none provided]'}
"""
    if precedent_block:
        user += f"\nRelevant precedent GRs (reference accurately if useful):{precedent_block}\n"

    text = await client.chat(SYSTEM, user, temperature=0.3, max_tokens=1400)
    return {"draft": text, "references": refs}
