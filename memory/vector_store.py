"""
Shared vector memory backed by ChromaDB.
All agents read/write research findings here.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

import chromadb

from config.settings import settings

logger = logging.getLogger(__name__)


class VectorStore:
    """Thin wrapper around a ChromaDB collection for shared agent memory."""

    def __init__(self) -> None:
        settings.chroma_dir.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(settings.chroma_dir))
        self._collection = self._client.get_or_create_collection(
            name=settings.collection_name,
        )
        logger.info(
            "VectorStore ready – collection '%s' (%d docs)",
            settings.collection_name,
            self._collection.count(),
        )

    # ------------------------------------------------------------------ write
    def add(
        self,
        text: str,
        metadata: dict[str, Any] | None = None,
        doc_id: str | None = None,
    ) -> str:
        """Store a text chunk with optional metadata. Returns the doc id."""
        doc_id = doc_id or uuid.uuid4().hex
        self._collection.add(
            documents=[text],
            metadatas=[metadata or {}],
            ids=[doc_id],
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
        self._collection.add(
            documents=texts,
            metadatas=metadatas or [{} for _ in texts],
            ids=ids,
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
        """Semantic search. Returns list of {id, document, metadata, distance}."""
        # Ensure we don't request more than available
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
            docs.append(
                {
                    "id": results["ids"][0][i],
                    "document": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if results.get("distances") else None,
                }
            )
        return docs

    def get_by_agent(self, agent_name: str, n_results: int = 20) -> list[dict[str, Any]]:
        """Retrieve all docs written by a specific agent."""
        return self.query("research findings", n_results=n_results, where={"agent": agent_name})

    # ------------------------------------------------------------------ info
    @property
    def count(self) -> int:
        return self._collection.count()

    def clear(self) -> None:
        """Delete all documents (useful for re-runs)."""
        ids = self._collection.get()["ids"]
        if ids:
            self._collection.delete(ids=ids)
        logger.info("Cleared %d docs from memory", len(ids))
