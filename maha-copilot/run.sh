#!/usr/bin/env bash
# Maha Copilot — start script
set -e
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from template. Add your TOGETHER_API_KEY (or leave blank for mock mode)."
fi

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

echo "Starting Maha Copilot on http://127.0.0.1:8000"
echo "  Dashboard: http://127.0.0.1:8000/"
echo "  Admin:     http://127.0.0.1:8000/admin"
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
