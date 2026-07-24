"""Shared helpers for the vision features (OCR + Image Understanding)."""
from __future__ import annotations

import base64
import io

IMAGE_EXTS = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp")

_MIME = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".gif": "image/gif", ".bmp": "image/bmp",
}


def is_image(filename: str) -> bool:
    return filename.lower().endswith(IMAGE_EXTS)


def is_pdf(filename: str) -> bool:
    return filename.lower().endswith(".pdf")


def image_data_url(data: bytes, filename: str, max_dim: int = 1600) -> str:
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(data))
        img = img.convert("RGB")
        w, h = img.size
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            img = img.resize((int(w * scale), int(h * scale)))
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88)
        b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        return f"data:image/jpeg;base64,{b64}"
    except Exception:
        ext = "." + filename.lower().rsplit(".", 1)[-1]
        mime = _MIME.get(ext, "image/png")
        b64 = base64.b64encode(data).decode("ascii")
        return f"data:{mime};base64,{b64}"


def pdf_pages_to_data_urls(data: bytes, max_pages: int = 10, zoom: float = 2.0) -> list[str]:
    """Render each PDF page to a PNG data URL using PyMuPDF (no system deps).

    zoom=2.0 renders at ~144 DPI — enough for reliable OCR without huge payloads.
    """
    try:
        import fitz  # PyMuPDF
    except ImportError as e:
        raise RuntimeError(
            "PyMuPDF is required for scanned-PDF OCR. Run: pip install pymupdf"
        ) from e

    urls = []
    doc = fitz.open(stream=data, filetype="pdf")
    matrix = fitz.Matrix(zoom, zoom)
    for page in doc[:max_pages]:
        pix = page.get_pixmap(matrix=matrix)
        png = pix.tobytes("png")
        b64 = base64.b64encode(png).decode("ascii")
        urls.append(f"data:image/png;base64,{b64}")
    doc.close()
    return urls
