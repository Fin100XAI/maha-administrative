"""Translation — Marathi <-> English, for pasted text or an uploaded document.

Uses the chat model with a translation-focused system prompt. Long inputs are
split and translated section-by-section, then stitched together, so large GRs
don't blow the context window.
"""
from __future__ import annotations

from ..together_client import get_client
from .summarize import extract_text, _split

_SYS = """You are a professional translator for Maharashtra government documents.
Translate the text into {target}. Rules:
- Preserve the formal administrative register and document structure.
- Keep GR numbers, dates, section numbers, names and figures exactly as-is.
- Do not summarize, add, or omit content — translate faithfully.
- Output only the translation, no notes or preamble."""

_TARGET = {"en": "English", "mr": "Marathi (Devanagari script)"}


async def translate_text(text: str, target_lang: str) -> dict:
    client = get_client()
    target = _TARGET.get(target_lang, "English")
    sections = _split(text, 4000)
    out_parts = []
    for sec in sections:
        if not sec.strip():
            continue
        t = await client.chat(
            _SYS.format(target=target), sec, temperature=0.1, max_tokens=2000
        )
        out_parts.append(t)
    return {
        "target_lang": target_lang,
        "sections": len(out_parts),
        "translation": "\n\n".join(out_parts),
    }


async def translate_file(filename: str, data: bytes, target_lang: str) -> dict:
    text = extract_text(filename, data)
    if not text.strip():
        return {"error": "Could not extract any text from the file."}
    result = await translate_text(text, target_lang)
    result["filename"] = filename
    result["chars"] = len(text)
    return result
