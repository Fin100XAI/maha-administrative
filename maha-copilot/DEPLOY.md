# Deploying Maha Copilot to a server

The `maha-copilot/` app is a **Python (FastAPI) server**. It cannot run as static
files — a server has to *run* it. Nothing below changes how the app works; it only
runs the existing app in production. Two parts: (1) run this backend, (2) point the
React frontend at it.

---

## 1. Run the backend

### Option A — Docker (recommended, works on any Docker host)

```bash
cd maha-copilot
# .env must exist with your keys (or leave TOGETHER_API_KEY blank for mock mode)
docker compose up -d --build
```

Serves on `http://<server>:8000`. Data in `./storage` persists across restarts.

Deploying to a container platform (Cloud Run / Render / Railway / Fly.io / ECS)?
Point it at this folder's `Dockerfile`; it honours the platform's `$PORT`. Set the
secrets from `.env` as the platform's environment variables.

### Option B — plain Linux server (no Docker)

```bash
cd maha-copilot
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000   # 0.0.0.0 = reachable externally
```

Keep it running with systemd, `pm2`, `nohup`, or a `tmux`/`screen` session. For more
throughput put gunicorn in front:
`gunicorn backend.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000`.

### Production notes (no code changes needed)
- **HTTPS**: if the frontend is served over HTTPS, this backend must be too, or the
  browser blocks it as mixed content. Terminate TLS at nginx / your load balancer /
  the platform.
- **Framing**: don't let a proxy add `X-Frame-Options` / CSP `frame-ancestors` that
  blocks the frontend's origin (the app itself sets none).
- **Secrets**: pass `.env` values as real environment variables in production; don't
  commit `.env`.

---

## 2. Point the frontend at the backend

After deploying the React `dist/`, set the backend URL — **no rebuild needed** — by
editing `dist/maha-config.js` on the server:

```js
window.__MAHA_COPILOT_URL__ = "https://copilot.yourdomain.gov.in";
```

(Or bake it in at build time: `VITE_MAHA_COPILOT_URL=https://… npm run build`.)

Then the sidebar's **Maha Copilot** loads the live app. Easiest topology: run the
backend on its own subdomain (e.g. `copilot.yourdomain.gov.in`).
