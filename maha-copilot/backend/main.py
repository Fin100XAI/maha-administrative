"""Maha Copilot — FastAPI application.

Routes:
  Public / user:
    GET  /api/health
    GET  /api/departments
    GET  /api/stats
    POST /api/copilot          (Maha Copilot)
    POST /api/letter           (Letter Drafting)
    POST /api/analyze          (GR / Circular Analysis)
    POST /api/summarize        (File Summarization — multipart upload)
  Admin (requires X-Admin-Token):
    POST /api/admin/ingest     (upload GR .mr.txt/.en.txt pairs)
    POST /api/admin/reset
Static:
    /            -> user dashboard (frontend/index.html)
    /admin       -> admin panel   (frontend/admin.html)
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .departments import CLUSTERS, DEPARTMENTS, resolve_slug
from .features.analysis import analyze
from .features.copilot import run_copilot
from .features.image_understanding import understand_image
from .features.letter import draft_letter
from .features.ocr import run_ocr
from .features.pdf_intelligence import query_document
from .features.summarize import summarize_file
from .features.translate import translate_file, translate_text
from .ingestion import build_doc, ingest_docs
from .models import AnalyzeRequest, CopilotQuery, LetterRequest, TranslateRequest
from .retrieval import invalidate_bm25
from .vectorstore import COLLECTION, get_store

app = FastAPI(title="Maha Copilot", version="0.1.0")
FRONTEND = Path(__file__).resolve().parent.parent / "frontend"


def require_admin(token: str | None) -> None:
    if token != get_settings().admin_token:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token.")


# ---------------------------------------------------------------- meta
@app.get("/api/health")
async def health():
    s = get_settings()
    return {"status": "ok", "mock_mode": s.mock_mode, "chat_model": s.chat_model}


@app.get("/api/departments")
async def departments():
    counts = get_store().counts_by_department()
    depts = [{**d, "gr_count": counts.get(d["slug"], 0)} for d in DEPARTMENTS]
    return {"clusters": CLUSTERS, "departments": depts}


@app.get("/api/stats")
async def stats():
    store = get_store()
    counts = store.counts_by_department()
    return {
        "total_grs": sum(counts.values()),
        "total_chunks": store.total_chunks(),
        "departments_with_data": sum(1 for v in counts.values() if v),
        "by_department": counts,
        "mock_mode": get_settings().mock_mode,
    }


# ---------------------------------------------------------------- features
@app.post("/api/copilot")
async def copilot(q: CopilotQuery):
    depts = None
    if q.departments:
        depts = [s for s in (resolve_slug(d) for d in q.departments) if s]
    result = await run_copilot(q.query, depts, q.quick_mode)
    return result.model_dump()


@app.post("/api/letter")
async def letter(req: LetterRequest):
    if req.department:
        req.department = resolve_slug(req.department) or req.department
    return await draft_letter(req)


@app.post("/api/analyze")
async def analyze_route(req: AnalyzeRequest):
    return await analyze(req)


@app.post("/api/summarize")
async def summarize_route(
    file: UploadFile = File(...), language: str = Form("en")
):
    data = await file.read()
    return await summarize_file(file.filename or "upload", data, language)


@app.post("/api/translate")
async def translate_route(req: TranslateRequest):
    return await translate_text(req.text, req.target_lang)


@app.post("/api/translate-file")
async def translate_file_route(
    file: UploadFile = File(...), target_lang: str = Form("en")
):
    data = await file.read()
    return await translate_file(file.filename or "upload", data, target_lang)


@app.post("/api/pdf-intelligence")
async def pdf_intelligence_route(
    file: UploadFile = File(...), question: str = Form(...)
):
    data = await file.read()
    return await query_document(file.filename or "upload", data, question)


@app.post("/api/ocr")
async def ocr_route(file: UploadFile = File(...)):
    data = await file.read()
    return await run_ocr(file.filename or "upload", data)


@app.post("/api/image")
async def image_route(
    file: UploadFile = File(...), question: str = Form("")
):
    data = await file.read()
    return await understand_image(file.filename or "upload", data, question)


# ---------------------------------------------------------------- admin
@app.post("/api/admin/ingest")
async def admin_ingest(
    department: str = Form(...),
    doc_type: str = Form("gr"),
    files: list[UploadFile] = File(...),
    x_admin_token: str | None = Header(default=None),
):
    require_admin(x_admin_token)
    dept_slug = resolve_slug(department)
    if not dept_slug:
        raise HTTPException(status_code=400, detail=f"Unknown department: {department}")

    # pair .mr.txt / .en.txt by basename
    pairs: dict[str, dict] = {}
    for f in files:
        name = f.filename or ""
        raw = (await f.read()).decode("utf-8", errors="ignore")
        if name.endswith(".mr.txt"):
            base = name[: -len(".mr.txt")]
            pairs.setdefault(base, {})["mr"] = raw
        elif name.endswith(".en.txt"):
            base = name[: -len(".en.txt")]
            pairs.setdefault(base, {})["en"] = raw
        else:
            base = name.rsplit(".", 1)[0]
            pairs.setdefault(base, {}).setdefault("mr", raw)

    docs = []
    skipped = []
    for base, texts in pairs.items():
        mr = texts.get("mr", "")
        en = texts.get("en", "")
        if not mr and not en:
            skipped.append(base)
            continue
        docs.append(build_doc(base, mr or en, en or mr, dept_slug, doc_type))

    if not docs:
        raise HTTPException(status_code=400, detail="No valid .txt content found.")

    report = await ingest_docs(docs)
    invalidate_bm25()  # new data -> rebuild sparse indexes on next query
    return {
        "department": dept_slug,
        "doc_type": doc_type,
        "ingested": report,
        "skipped": skipped,
    }


@app.post("/api/admin/reset")
async def admin_reset(x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    store = get_store()
    store.client.delete_collection(COLLECTION)
    store._ensure_collection()
    invalidate_bm25()
    return {"status": "reset"}


# ---------------------------------------------------------------- frontend
@app.get("/")
async def index():
    return FileResponse(FRONTEND / "index.html")


@app.get("/admin")
async def admin_page():
    return FileResponse(FRONTEND / "admin.html")


if FRONTEND.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND)), name="static")
