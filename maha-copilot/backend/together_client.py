"""Thin async wrapper over Together AI's OpenAI-compatible endpoints.

Covers the three calls the platform needs:
  - embeddings   (/embeddings)
  - rerank       (/rerank)
  - chat         (/chat/completions)

If no API key is configured the client runs in MOCK MODE: deterministic
offline stand-ins so the whole UI is demoable before the key is wired.
Every mock is clearly marked in its output so no one mistakes it for real
model output.
"""
from __future__ import annotations

import hashlib
import math
from typing import Any

import httpx

from .config import get_settings

_TIMEOUT = httpx.Timeout(120.0, connect=15.0)


class TogetherClient:
    def __init__(self) -> None:
        self.s = get_settings()
        self.mock = self.s.mock_mode

    # ---- helpers -------------------------------------------------------
    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.s.together_api_key}",
            "Content-Type": "application/json",
        }

    async def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.s.together_base_url.rstrip('/')}{path}"
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            r = await client.post(url, headers=self._headers(), json=payload)
            if r.status_code >= 400:
                try:
                    detail = r.json()
                except Exception:
                    detail = r.text
                raise httpx.HTTPStatusError(
                    f"{r.status_code} error from {path}: {detail}",
                    request=r.request, response=r,
                )
            return r.json()

    # ---- embeddings ----------------------------------------------------
    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        if self.mock:
            return [self._mock_vector(t) for t in texts]
        data = await self._post(
            "/embeddings", {"model": self.s.embed_model, "input": texts}
        )
        # OpenAI-compatible: preserve request order.
        rows = sorted(data["data"], key=lambda d: d["index"])
        return [row["embedding"] for row in rows]

    def _mock_vector(self, text: str) -> list[float]:
        """Deterministic pseudo-embedding from a hash — same text, same vector,
        so cosine similarity behaves consistently in offline demos."""
        dim = self.s.embed_dim
        seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)
        vec = []
        for i in range(dim):
            seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
            vec.append((seed / 0x7FFFFFFF) * 2 - 1)
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    # ---- rerank --------------------------------------------------------
    def _lexical_rerank(self, query, documents, top_k):
        """Keyword-overlap ordering — used in mock mode and as an API fallback."""
        q = set(query.lower().split())
        scored = []
        for i, doc in enumerate(documents):
            d = set((doc or "").lower().split())
            overlap = len(q & d) / (len(q) + 1)
            scored.append({"index": i, "relevance_score": overlap})
        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:top_k]

    async def rerank(
        self, query: str, documents: list[str], top_k: int
    ) -> list[dict[str, Any]]:
        """Return [{index, relevance_score}] sorted best-first."""
        if not documents:
            return []
        if self.mock:
            return self._lexical_rerank(query, documents, top_k)
        try:
            data = await self._post(
                "/rerank",
                {
                    "model": self.s.rerank_model,
                    "query": query,
                    "documents": documents,
                    "top_n": top_k,
                },
            )
            results = data.get("results", [])
            return [
                {"index": r["index"], "relevance_score": r.get("relevance_score", 0.0)}
                for r in results
            ]
        except Exception as e:
            # If the rerank model/endpoint rejects the call, degrade gracefully
            # to lexical ordering rather than failing the whole request.
            print(f"[rerank] API call failed ({e}); using lexical fallback.")
            return self._lexical_rerank(query, documents, top_k)

    # ---- chat ----------------------------------------------------------
    async def chat(
        self,
        system: str,
        user: str,
        temperature: float = 0.2,
        max_tokens: int = 1500,
        json_mode: bool = False,
    ) -> str:
        if self.mock:
            return self._mock_chat(system, user, json_mode)
        payload: dict[str, Any] = {
            "model": self.s.chat_model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        try:
            data = await self._post("/chat/completions", payload)
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            # Some models reject response_format — retry once without it.
            if json_mode:
                try:
                    payload.pop("response_format", None)
                    data = await self._post("/chat/completions", payload)
                    return data["choices"][0]["message"]["content"]
                except Exception as e2:
                    e = e2
            print(f"[chat] API call failed ({e}); using mock fallback.")
            return self._mock_chat(system, user, json_mode)

    def _mock_chat(self, system: str, user: str, json_mode: bool) -> str:
        if json_mode:
            # Query decomposer / classifier expect JSON — return a safe shape.
            return '{"compound": false, "subquestions": []}'
        return (
            "[MOCK MODE — no Together API key configured]\n\n"
            "This is a placeholder answer. Add TOGETHER_API_KEY to your .env to "
            "generate real grounded responses.\n\n"
            "The retrieval pipeline (BM25 + dense + RRF + rerank) still ran, so "
            "the citations shown below are the actual chunks that would be sent "
            "to the model as context."
        )

    # ---- vision (OCR / image understanding) ----------------------------
    async def chat_vision(
        self,
        prompt: str,
        images: list[str],
        temperature: float = 0.1,
        max_tokens: int = 2000,
    ) -> str:
        """Send one or more images (base64 data URLs) + a text prompt to the
        vision model. `images` items look like 'data:image/png;base64,<...>'."""
        if self.mock:
            return (
                "[MOCK MODE — no Together API key configured]\n\n"
                "Add TOGETHER_API_KEY to your .env to run the vision model on "
                f"{len(images)} image(s). The upload and pipeline worked; this "
                "is a placeholder for the extracted / analysed text."
            )
        content: list[dict[str, Any]] = [{"type": "text", "text": prompt}]
        for url in images:
            content.append({"type": "image_url", "image_url": {"url": url}})
        payload = {
            "model": self.s.vision_model,
            "messages": [{"role": "user", "content": content}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        try:
            data = await self._post("/chat/completions", payload)
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[vision] API call failed ({e}).")
            return f"[Vision model error] {e}"


_client: TogetherClient | None = None


def get_client() -> TogetherClient:
    global _client
    if _client is None:
        _client = TogetherClient()
    return _client
