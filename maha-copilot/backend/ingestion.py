"""Ingestion pipeline for GR / Circular text pairs.

Admin uploads paired `<name>.mr.txt` (canonical Marathi) and `<name>.en.txt`
(English). This module pairs them by basename, pulls light metadata, chunks
the aligned text, embeds the canonical Marathi with the multilingual model
(cross-lingual, so English queries still retrieve), and upserts to Qdrant.

Design note: we embed the canonical Marathi chunk once and rely on the
cross-lingual embedding model for English queries, rather than storing a
second English vector per chunk. Halves embedding cost with negligible recall
loss on multilingual-e5. English text is still stored in the payload and used
by the English BM25 index.
"""
from __future__ import annotations

import re
import uuid
from dataclasses import dataclass, field

from .config import get_settings
from .together_client import get_client
from .vectorstore import get_store

# GR numbers referenced in the "वाचा / Read" header, e.g. संकीर्ण-२०२१/... or
# plain codes. Kept deliberately broad; refined per real corpus.
_READ_REF = re.compile(r"[A-Za-z\u0900-\u097F]+[-–][0-9\u0966-\u096F]{2,4}[/\-][^\s,;।]+")
_DATE_IN_NAME = re.compile(r"(\d{4})(\d{2})(\d{2})")


@dataclass
class GRDoc:
    gr_id: str
    department: str
    doc_type: str          # "gr" | "circular"
    date: str              # YYYY-MM-DD or ""
    subject_mr: str
    subject_en: str
    text_mr: str
    text_en: str
    read_refs: list[str] = field(default_factory=list)
    source_url: str = ""


def parse_date_from_name(name: str) -> str:
    m = _DATE_IN_NAME.search(name)
    if not m:
        return ""
    y, mo, d = m.groups()
    return f"{y}-{mo}-{d}"


def first_meaningful_line(text: str) -> str:
    for line in text.splitlines():
        s = line.strip()
        if len(s) > 8:
            return s[:300]
    return ""


def extract_read_refs(text_mr: str) -> list[str]:
    """Grab GR numbers from the header block (before the main body)."""
    head = text_mr[:1500]
    refs = _READ_REF.findall(head)
    # de-dup preserving order
    seen, out = set(), []
    for r in refs:
        if r not in seen:
            seen.add(r)
            out.append(r)
    return out[:15]


def build_doc(
    basename: str,
    text_mr: str,
    text_en: str,
    department: str,
    doc_type: str,
) -> GRDoc:
    s = get_settings()
    date = parse_date_from_name(basename)
    gr_id = basename  # filename is a stable, human-recognisable id
    return GRDoc(
        gr_id=gr_id,
        department=department,
        doc_type=doc_type,
        date=date,
        subject_mr=first_meaningful_line(text_mr),
        subject_en=first_meaningful_line(text_en),
        text_mr=text_mr,
        text_en=text_en,
        read_refs=extract_read_refs(text_mr),
        source_url=f"{s.gr_base_url}/search?q={gr_id}",
    )


def _chunk(text: str, size: int, overlap: int) -> list[tuple[int, int, str]]:
    """Return [(start, end, chunk_text)] with character offsets."""
    text = text.strip()
    if not text:
        return []
    chunks, start = [], 0
    n = len(text)
    while start < n:
        end = min(start + size, n)
        # try to break on a sentence/paragraph boundary near the end
        window = text[start:end]
        brk = max(window.rfind("।"), window.rfind("\n\n"), window.rfind(". "))
        if brk > size * 0.5 and end < n:
            end = start + brk + 1
        chunks.append((start, end, text[start:end].strip()))
        if end >= n:
            break
        start = max(end - overlap, start + 1)
    return chunks


def make_chunks(doc: GRDoc) -> list[dict]:
    """Aligned Marathi/English chunks. We chunk mr and en independently but
    zip them positionally; for retrieval only the mr chunk is embedded and the
    aligned en chunk (best-effort by index) rides along in the payload."""
    s = get_settings()
    mr_chunks = _chunk(doc.text_mr, s.chunk_chars, s.chunk_overlap)
    en_chunks = _chunk(doc.text_en, s.chunk_chars, s.chunk_overlap)
    out = []
    for i, (_, _, mr) in enumerate(mr_chunks):
        en = en_chunks[i][2] if i < len(en_chunks) else ""
        out.append(
            {
                "chunk_index": i,
                "text_mr": mr,
                "text_en": en,
            }
        )
    return out


async def ingest_docs(docs: list[GRDoc], progress=None) -> dict:
    """Chunk + embed + upsert a batch. `progress(done, total, msg)` optional."""
    store = get_store()
    client = get_client()

    all_points = []
    total = len(docs)
    for di, doc in enumerate(docs):
        chunks = make_chunks(doc)
        if not chunks:
            continue
        vectors = await client.embed([c["text_mr"] for c in chunks])
        for c, vec in zip(chunks, vectors):
            payload = {
                "gr_id": doc.gr_id,
                "department": doc.department,
                "doc_type": doc.doc_type,
                "date": doc.date,
                "subject_mr": doc.subject_mr,
                "subject_en": doc.subject_en,
                "chunk_index": c["chunk_index"],
                "text_mr": c["text_mr"],
                "text_en": c["text_en"],
                "read_refs": doc.read_refs,
                "source_url": doc.source_url,
            }
            all_points.append(
                {"id": uuid.uuid4().int >> 64, "vector": vec, "payload": payload}
            )
        if progress:
            progress(di + 1, total, f"Embedded {doc.gr_id}")

    # upsert in batches to keep memory flat
    B = 128
    for i in range(0, len(all_points), B):
        store.upsert(all_points[i : i + B])

    return {"documents": total, "chunks": len(all_points)}
