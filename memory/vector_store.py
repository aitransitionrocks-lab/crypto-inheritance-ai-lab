"""
Shared vector memory backed by ChromaDB with graceful degradation.
All agents read/write research findings here.
Falls back to in-memory dict if ChromaDB is unavailable or corrupted.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

from config.settings import settings

logger = logging.getLogger(__name__)


class VectorStore:
    """Wrapper around ChromaDB with fallback to simple in-memory store."""

    def __init__(self) -> None:
        self._fallback_docs: list[dict[str, Any]] = []
        self._use_chroma = False
        self._collection = None

        try:
            import chromadb
            settings.chroma_dir.mkdir(parents=True, exist_ok=True)
            self._client = chromadb.PersistentClient(path=str(settings.chroma_dir))
            self._collection = self._client.get_or_create_collection(
                name=settings.collection_name,
            )
            self._use_chroma = True
            logger.info(
                "VectorStore ready (ChromaDB) – collection '%s' (%d docs)",
                settings.collection_name,
                self._collection.count(),
            )
        except Exception as exc:
            logger.warning("ChromaDB unavailable (%s) – using in-memory fallback", exc)
            self._use_chroma = False

    # ------------------------------------------------------------------ write
    def add(
        self,
        text: str,
        metadata: dict[str, Any] | None = None,
        doc_id: str | None = None,
    ) -> str:
        """Store a text chunk with optional metadata. Returns the doc id."""
        doc_id = doc_id or uuid.uuid4().hex
        meta = metadata or {}

        if self._use_chroma:
            try:
                self._collection.add(
                    documents=[text], metadatas=[meta], ids=[doc_id],
                )
            except Exception as exc:
                logger.warning("ChromaDB add failed (%s) – using fallback", exc)
                self._use_chroma = False

        self._fallback_docs.append(
            {"id": doc_id, "document": text, "metadata": meta}
        )
        logger.debug("Added doc %s (%d chars)", doc_id, len(text))
        return doc_id

    def add_many(
        self,
        texts: list[str],
        metadatas: list[dict[str, Any]] | None = None,
        ids: list[str] | None = None,
    ) -> list[str]:
        """Batch-insert multiple documents."""
        ids = ids or [uuid.uuid4().hex for _ in texts]
        metas = metadatas or [{} for _ in texts]

        if self._use_chroma:
            try:
                self._collection.add(documents=texts, metadatas=metas, ids=ids)
            except Exception as exc:
                logger.warning("ChromaDB batch add failed (%s)", exc)
                self._use_chroma = False

        for doc_id, text, meta in zip(ids, texts, metas):
            self._fallback_docs.append(
                {"id": doc_id, "document": text, "metadata": meta}
            )
        logger.debug("Added %d docs", len(texts))
        return ids

    # ------------------------------------------------------------------ read
    def query(
        self,
        text: str,
        n_results: int = 5,
        where: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Semantic search (ChromaDB) or keyword match (fallback)."""
        if self._use_chroma:
            try:
                return self._query_chroma(text, n_results, where)
            except Exception as exc:
                logger.warning("ChromaDB query failed (%s) – using fallback", exc)
                self._use_chroma = False

        return self._query_fallback(text, n_results, where)

    def _query_chroma(
        self, text: str, n_results: int, where: dict[str, Any] | None
    ) -> list[dict[str, Any]]:
        count = self._collection.count()
        if count == 0:
            return []
        n = min(n_results, count)

        kwargs: dict[str, Any] = {"query_texts": [text], "n_results": n}
        if where:
            kwargs["where"] = where

        results = self._collection.query(**kwargs)
        docs: list[dict[str, Any]] = []
        for i in range(len(results["ids"][0])):
            docs.append({
                "id": results["ids"][0][i],
                "document": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i] if results.get("distances") else None,
            })
        return docs

    def _query_fallback(
        self, text: str, n_results: int, where: dict[str, Any] | None
    ) -> list[dict[str, Any]]:
        """Simple keyword-overlap search against in-memory docs."""
        candidates = self._fallback_docs
        if where:
            candidates = [
                d for d in candidates
                if all(d["metadata"].get(k) == v for k, v in where.items())
            ]

        keywords = set(text.lower().split())
        scored = []
        for doc in candidates:
            doc_words = set(doc["document"][:2000].lower().split())
            overlap = len(keywords & doc_words)
            scored.append((overlap, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [d for _, d in scored[:n_results]]

    def get_by_agent(self, agent_name: str, n_results: int = 20) -> list[dict[str, Any]]:
        return self.query("research findings", n_results=n_results, where={"agent": agent_name})

    # ------------------------------------------------------------------ info
    @property
    def count(self) -> int:
        if self._use_chroma:
            try:
                return self._collection.count()
            except Exception:
                pass
        return len(self._fallback_docs)

    def clear(self) -> None:
        """Delete all documents."""
        if self._use_chroma:
            try:
                ids = self._collection.get()["ids"]
                if ids:
                    self._collection.delete(ids=ids)
                logger.info("Cleared %d docs from ChromaDB", len(ids))
            except Exception as exc:
                logger.warning("ChromaDB clear failed (%s)", exc)
        self._fallback_docs.clear()
        logger.info("In-memory fallback cleared")
