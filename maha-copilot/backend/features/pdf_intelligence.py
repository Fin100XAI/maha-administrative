"""PDF Intelligence — deep Q&A over an uploaded PDF or Word document.

Unlike File Summarization (which condenses), this answers specific questions
grounded in the document. For long documents it scores sections by keyword
overlap with the question and feeds only the most relevant ones to the model,
so answers stay focused and within context limits.
"""
from __future__ import annotations

from ..together_client import get_client
from .summarize import extract_text, _split

_SYS = """You answer questions about a Maharashtra government document for an
officer. Rules:
- Answer ONLY from the document text provided.
- Quote or reference the relevant clause/section where possible.
- If the answer is not in the document, say so plainly.
- Answer in the same language as the question."""


def _rank_sections(question: str, sections: list[str], keep: int) -> list[str]:
    q = set(question.lower().split())
    scored = []
    for sec in sections:
        d = set(sec.lower().split())
        scored.append((len(q & d), sec))
    scored.sort(key=lambda x: x[0], reverse=True)
    top = [s for _, s in scored[:keep]]
    return top or sections[:keep]


async def query_document(filename: str, data: bytes, question: str) -> dict:
    if not question.strip():
        return {"error": "Please enter a question about the document."}
    text = extract_text(filename, data)
    if not text.strip():
        return {
            "error": "Could not extract text. If this is a scanned PDF, use "
            "OCR Intelligence first."
        }
    client = get_client()
    sections = _split(text, 3500)
    context = "\n\n---\n\n".join(_rank_sections(question, sections, keep=3))
    user = f"Question: {question}\n\nDocument:\n{context}"
    answer = await client.chat(_SYS, user, temperature=0.1, max_tokens=1200)
    return {
        "filename": filename,
        "chars": len(text),
        "sections_total": len(sections),
        "question": question,
        "answer": answer,
    }
