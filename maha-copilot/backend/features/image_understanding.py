"""Image Understanding — analyse a document image beyond plain text.

Answers questions about layout, tables, stamps, seals, signatures and figures
in a GR/circular image, using the vision model. If no question is given, it
returns a structured description an officer can act on.
"""
from __future__ import annotations

from ..together_client import get_client
from .vision_utils import image_data_url, is_image

_DESCRIBE_PROMPT = """You are analysing an image of a Maharashtra government
document for an officer. Describe:
1. Document type and header (department, GR/circular number, date if visible).
2. Any tables — reproduce them as simple rows.
3. Stamps, seals, or signatures present and roughly where.
4. The main subject / directive in one or two lines.
Note the language(s) used. Be factual; do not invent details you cannot see."""

_QUESTION_PROMPT = """You are analysing an image of a Maharashtra government
document for an officer. Answer the officer's question using only what is
visible in the image. If it is not visible, say so.

Question: {q}"""


async def understand_image(filename: str, data: bytes, question: str | None) -> dict:
    if not is_image(filename):
        return {"error": "Upload an image file (PNG/JPG/WEBP). For PDFs, use OCR Intelligence."}
    client = get_client()
    url = image_data_url(data, filename)
    prompt = _QUESTION_PROMPT.format(q=question) if question and question.strip() else _DESCRIBE_PROMPT
    result = await client.chat_vision(prompt, [url])
    return {"filename": filename, "question": question or "", "analysis": result}
