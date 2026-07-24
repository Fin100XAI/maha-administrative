# Maha Copilot — GR Intelligence Platform (POC)

A bilingual (Marathi/English) intelligence layer over the Maharashtra
Government Resolution corpus, with five officer-facing features and an admin
ingestion console. Built as a FastAPI backend + a zero-build vanilla-JS
frontend, wired for **Together AI**.

## What's in the box

| Feature | Endpoint | What it does |
|---|---|---|
| **Maha Copilot** | `POST /api/copilot` | Grounded RAG over the GR corpus — hybrid retrieval, bilingual cited answers, supersession-aware |
| **Letter Drafting** | `POST /api/letter` | Drafts formal correspondence, optionally grounded in precedent GRs |
| **GR Analysis** | `POST /api/analyze` | Structured metadata + summary + Q&A for a GR |
| **Circular Analysis** | `POST /api/analyze` (`doc_type=circular`) | Same, for departmental circulars |
| **File Summarization** | `POST /api/summarize` | PDF / Word → map-reduce officer's brief |
| **Translation** | `POST /api/translate`, `/api/translate-file` | Marathi ↔ English for text or a whole document |
| **OCR Intelligence** | `POST /api/ocr` | Extract text from scanned GR images or PDFs (vision model) |
| **PDF Intelligence** | `POST /api/pdf-intelligence` | Ask questions directly of a PDF / Word doc |
| **Image Understanding** | `POST /api/image` | Read tables, stamps, seals, signatures from a document image |
| **Admin ingestion** | `POST /api/admin/ingest` | Upload `.mr.txt`/`.en.txt` pairs → chunk → embed → index |

The last three (OCR, PDF Intelligence, Image Understanding) and Translation are
the newer additions. OCR and Image Understanding use Together's vision model
(`meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8`, set as `VISION_MODEL` in
`.env`), which handles Devanagari well. Scanned PDFs are rendered to page
images with PyMuPDF (pure-Python, no system dependencies) before OCR.

The retrieval stack implements the full spec: F1 department filter, F2 bilingual
query bar with Unicode language detection, F3 hybrid retrieval (BM25 + dense +
RRF + rerank), F4 grounded generation, F5 bilingual citation cards, plus the
A1 supersession checker and A2 query decomposer agents.

## Quick start

```bash
cd maha-copilot
cp .env.example .env          # then edit .env
pip install -r requirements.txt
uvicorn backend.main:app --port 8000 --reload
```

Open **http://127.0.0.1:8000/** for the dashboard and
**http://127.0.0.1:8000/admin** for ingestion. (`./run.sh` does the venv +
install + launch for you.)

### Mock mode vs. live mode

- **Leave `TOGETHER_API_KEY` blank** → the platform runs in **mock mode**: the
  full pipeline (ingestion, BM25 + dense + RRF + rerank, citations, agents)
  runs for real, but LLM/embedding/rerank calls return deterministic offline
  stand-ins so you can demo the entire UI immediately, with no network.
- **Add your key** → real Together AI generation, embeddings and reranking.

> **Verify model IDs.** The defaults in `.env.example`
> (`Qwen/Qwen2.5-72B-Instruct-Turbo`, `intfloat/multilingual-e5-large-instruct`,
> `Salesforce/Llama-Rank-V1`) are sensible but models get renamed/retired.
> Confirm the exact strings in your Together dashboard and update `.env`.
> If you switch the embedding model, set `EMBED_DIM` to match and re-ingest.

## Ingesting the corpus

The admin console pairs `<name>.mr.txt` + `<name>.en.txt` by basename, extracts
the date from the `YYYYMMDD` filename prefix, pulls the subject line and the
`वाचा / Read` references, chunks (~1100 chars, 150 overlap), embeds the
**canonical Marathi** text, and upserts to Qdrant with the department as a
payload filter.

1. Open `/admin`, paste your `ADMIN_TOKEN` (from `.env`).
2. Pick the **department** and **doc type**, select the `.txt` pairs, ingest.
3. Repeat per department. Counts appear live.

Sample pairs are in `data/sample_grs/` to try it end to end.

For the full 98,639-GR corpus (orgpedia/mahGRs), ingest per-department in
batches; each department is a separate upload with its department selected.

## Architecture notes & deliberate tradeoffs

- **Cross-lingual embeddings.** We embed the canonical Marathi chunk once and
  rely on the multilingual model for English queries, rather than storing a
  second English vector per chunk. Halves embedding cost; the English text is
  still stored and used by the English BM25 index.
- **Single Qdrant collection**, department as an indexed payload field — simpler
  than a collection per department and still gives fast F1 scoping.
- **Embedded Qdrant** (on-disk, no server) when `QDRANT_URL` is blank — ideal
  for a POC. For production scale, run a Qdrant **server** and set `QDRANT_URL`;
  payload indexes (and thus fast filtering) only take effect there. Embedded
  mode logs a harmless "payload indexes have no effect" warning — filtering
  still works, just unindexed.
- **BM25** is built in-process from stored chunks and cached, rebuilt on new
  ingestion. Fine to a few hundred-thousand chunks; beyond that, move sparse
  retrieval into Qdrant/OpenSearch.
- **Supersession (A1)** uses a subject-keyword + date heuristic and the
  `वाचा/Read` header. It's a real, working first pass; tighten the topic model
  against your corpus before relying on it operationally.

## Project layout

```
backend/
  main.py            FastAPI app + routes + static serving
  config.py          env settings (mock_mode toggle)
  together_client.py Together AI wrapper (+ offline mock)
  vectorstore.py     Qdrant wrapper
  ingestion.py       parse / chunk / embed / upsert
  retrieval.py       BM25 + dense + RRF + rerank (F3)
  agents.py          A1 supersession, A2 decomposer
  language.py        F2 language detection
  departments.py     33 departments, 6 clusters
  features/          copilot, letter, analysis, summarize
frontend/            index.html, admin.html, app.js, admin.js, styles.css
data/sample_grs/     example bilingual GR pairs
```

## Not yet built (extensible stubs / next steps)

- B1 feedback buttons and B3 related-GRs panel (B2 session history is in).
- Auth beyond the single admin token (add SSO before any real deployment).
- Async ingestion job queue for very large batches (current ingest is sync).
