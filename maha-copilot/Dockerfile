# Maha Copilot — backend container.
# This is PACKAGING ONLY: it runs the existing app unchanged (same uvicorn entrypoint,
# same routes, same behaviour). The only production difference vs. run.sh is binding to
# 0.0.0.0 (so the server is reachable from outside the container) and no --reload.
FROM python:3.12-slim

WORKDIR /app

# Install Python dependencies first so this layer is cached across code changes.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Application code (unchanged).
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY data/ ./data/

# Embedded Qdrant store lives here — mount a volume over it to persist ingested data.
RUN mkdir -p storage/qdrant

EXPOSE 8000

# Honour $PORT if the platform injects one (Cloud Run / Render / Railway …), else 8000.
ENV PORT=8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
