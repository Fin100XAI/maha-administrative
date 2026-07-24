"""OCR Intelligence — extract text from images or scanned PDFs.

Uses the Together vision model (Llama 4 Maverick), which is strong at OCR
including Devanagari. Images are sent directly; scanned PDFs are rendered to
page images first (PyMuPDF), then OCR'd page by page.
"""
from __future__ import annotations

from ..together_client import get_client
from .vision_utils import (
    image_data_url,
    is_image,
    is_pdf,
    pdf_pages_to_data_urls,
)

_OCR_PROMPT = """Transcribe ALL text visible in this image exactly as it appears.
This is a Maharashtra government document that may be in Marathi (Devanagari) or
English. Rules:
- Preserve the original language — do NOT translate.
- Preserve layout: headings, numbered points, tables (use simple rows), and
  reference lines.
- Include GR numbers, dates, and signatures/stamps if legible.
- Output only the transcribed text."""


async def run_ocr(filename: str, data: bytes, max_pages: int = 10) -> dict:
    client = get_client()

    if is_image(filename):
        url = image_data_url(data, filename)
        text = await client.chat_vision(_OCR_PROMPT, [url])
        return {"filename": filename, "pages": 1, "text": text}

    if is_pdf(filename):
        try:
            urls = pdf_pages_to_data_urls(data, max_pages=max_pages)
        except RuntimeError as e:
            return {"error": str(e)}
        if not urls:
            return {"error": "No pages found in the PDF."}
        page_texts = []
        for i, url in enumerate(urls, 1):
            t = await client.chat_vision(_OCR_PROMPT, [url])
            page_texts.append(f"--- Page {i} ---\n{t}")
        note = ""
        return {
            "filename": filename,
            "pages": len(urls),
            "text": "\n\n".join(page_texts) + note,
        }

    return {"error": "Unsupported file. Upload an image (PNG/JPG) or a PDF."}
