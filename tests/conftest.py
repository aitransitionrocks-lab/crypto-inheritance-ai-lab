"""Shared fixtures for the test suite."""

import sys
from pathlib import Path

# Ensure project root is on sys.path so that imports like
# ``from config.settings import settings`` work regardless of how
# pytest is invoked.
project_root = str(Path(__file__).resolve().parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import pytest
from memory.vector_store import VectorStore


@pytest.fixture()
def store() -> VectorStore:
    """Return a fresh VectorStore instance (fallback mode) for each test."""
    vs = VectorStore()
    # Ensure we start clean regardless of prior state
    vs._fallback_docs.clear()
    if vs._use_chroma and vs._collection is not None:
        try:
            ids = vs._collection.get()["ids"]
            if ids:
                vs._collection.delete(ids=ids)
        except Exception:
            pass
    return vs
