"""Qdrant wrapper.

Single collection `grs` with department stored as a payload field and a
payload index, so department filtering (F1) is a cheap indexed filter rather
than a separate collection per department. Runs embedded on-disk when no
QDRANT_URL is set — no server required for the POC.
"""
from __future__ import annotations

from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http import models as qm

from .config import get_settings

COLLECTION = "grs"


class VectorStore:
    def __init__(self) -> None:
        s = get_settings()
        if s.qdrant_url:
            self.client = QdrantClient(
                url=s.qdrant_url, api_key=s.qdrant_api_key or None
            )
        else:
            # embedded, persistent on disk
            self.client = QdrantClient(path=s.qdrant_path)
        self.dim = s.embed_dim
        self._ensure_collection()

    def _ensure_collection(self) -> None:
        existing = {c.name for c in self.client.get_collections().collections}
        if COLLECTION not in existing:
            self.client.create_collection(
                collection_name=COLLECTION,
                vectors_config=qm.VectorParams(
                    size=self.dim, distance=qm.Distance.COSINE
                ),
            )
            # indexes that back the F1 filter and supersession agent queries
            for field, schema in [
                ("department", qm.PayloadSchemaType.KEYWORD),
                ("gr_id", qm.PayloadSchemaType.KEYWORD),
                ("date", qm.PayloadSchemaType.KEYWORD),
                ("doc_type", qm.PayloadSchemaType.KEYWORD),
            ]:
                self.client.create_payload_index(
                    collection_name=COLLECTION,
                    field_name=field,
                    field_schema=schema,
                )

    # ---- writes --------------------------------------------------------
    def upsert(self, points: list[dict[str, Any]]) -> None:
        """points: [{id:int, vector:list[float], payload:dict}]"""
        if not points:
            return
        self.client.upsert(
            collection_name=COLLECTION,
            points=[
                qm.PointStruct(id=p["id"], vector=p["vector"], payload=p["payload"])
                for p in points
            ],
        )

    # ---- reads ---------------------------------------------------------
    def _dept_filter(self, departments: list[str] | None) -> qm.Filter | None:
        if not departments:
            return None
        return qm.Filter(
            must=[
                qm.FieldCondition(
                    key="department", match=qm.MatchAny(any=departments)
                )
            ]
        )

    def dense_search(
        self, vector: list[float], departments: list[str] | None, top_k: int
    ) -> list[dict[str, Any]]:
        res = self.client.query_points(
            collection_name=COLLECTION,
            query=vector,
            query_filter=self._dept_filter(departments),
            limit=top_k,
            with_payload=True,
        ).points
        return [{"id": p.id, "score": p.score, "payload": p.payload} for p in res]

    def scroll_department(
        self, department: str, limit: int = 10000
    ) -> list[dict[str, Any]]:
        """All chunks for one department — used to build BM25 indexes and by
        the supersession agent."""
        points, _ = self.client.scroll(
            collection_name=COLLECTION,
            scroll_filter=self._dept_filter([department]),
            limit=limit,
            with_payload=True,
            with_vectors=False,
        )
        return [{"id": p.id, "payload": p.payload} for p in points]

    def scroll_all(self, limit: int = 100000) -> list[dict[str, Any]]:
        points, _ = self.client.scroll(
            collection_name=COLLECTION,
            limit=limit,
            with_payload=True,
            with_vectors=False,
        )
        return [{"id": p.id, "payload": p.payload} for p in points]

    def counts_by_department(self) -> dict[str, int]:
        out: dict[str, int] = {}
        for row in self.scroll_all():
            dept = row["payload"].get("department", "unknown")
            gr = row["payload"].get("gr_id", "")
            out.setdefault(dept, set())
            out[dept].add(gr)  # type: ignore
        return {k: len(v) for k, v in out.items()}  # type: ignore

    def total_chunks(self) -> int:
        return self.client.count(collection_name=COLLECTION).count

    def find_later_grs(
        self, department: str, after_date: str, keyword: str
    ) -> list[dict[str, Any]]:
        """Supersession agent (A1): later chunks in the same department whose
        subject mentions the topic keyword."""
        flt = qm.Filter(
            must=[
                qm.FieldCondition(key="department", match=qm.MatchValue(value=department)),
                qm.FieldCondition(key="date", range=qm.DatetimeRange(gt=None)),
            ]
        )
        points, _ = self.client.scroll(
            collection_name=COLLECTION,
            scroll_filter=qm.Filter(
                must=[qm.FieldCondition(key="department", match=qm.MatchValue(value=department))]
            ),
            limit=10000,
            with_payload=True,
        )
        out = []
        for p in points:
            pl = p.payload or {}
            if pl.get("date", "") > after_date and keyword and (
                keyword.lower() in (pl.get("subject_en", "") or "").lower()
                or keyword in (pl.get("subject_mr", "") or "")
            ):
                out.append({"id": p.id, "payload": pl})
        return out


_store: VectorStore | None = None


def get_store() -> VectorStore:
    global _store
    if _store is None:
        _store = VectorStore()
    return _store
