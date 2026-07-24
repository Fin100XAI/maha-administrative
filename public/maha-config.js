/*
 * Runtime configuration for the embedded Maha Copilot app.
 *
 * This file is copied to the site root as-is (it is NOT bundled into the app), so you
 * can edit it directly on the server AFTER building — no rebuild required.
 *
 * Set it to the PUBLIC base URL of the deployed maha-copilot backend (the FastAPI app in
 * the maha-copilot/ folder). Use HTTPS in production, or a secure page will block it as
 * mixed content.
 *
 *   window.__MAHA_COPILOT_URL__ = "https://copilot.yourdomain.gov.in";
 *
 * Leave it blank to fall back to the build-time VITE_MAHA_COPILOT_URL, and then to
 * http://127.0.0.1:8000 for local development.
 */
window.__MAHA_COPILOT_URL__ = "";
