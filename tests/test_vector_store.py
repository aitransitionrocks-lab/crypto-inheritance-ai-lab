"""Tests for memory.vector_store.VectorStore."""

from memory.vector_store import VectorStore


def test_add_and_query(store: VectorStore) -> None:
    """Add a document, query it, verify it is returned."""
    store.add("Bitcoin inheritance planning is essential for crypto holders")
    results = store.query("Bitcoin inheritance")
    assert len(results) >= 1
    assert "Bitcoin" in results[0]["document"]


def test_add_with_metadata(store: VectorStore) -> None:
    """Add a doc with agent/type metadata, then query with a where filter."""
    store.add(
        "Multisig wallets improve security",
        metadata={"agent": "security", "type": "research"},
    )
    store.add(
        "Estate planning for digital assets",
        metadata={"agent": "legal", "type": "research"},
    )

    results = store.query(
        "wallets",
        where={"agent": "security"},
    )
    assert len(results) >= 1
    assert results[0]["metadata"]["agent"] == "security"


def test_query_empty_store(store: VectorStore) -> None:
    """Querying an empty store should return an empty list."""
    results = store.query("anything at all")
    assert results == []


def test_clear(store: VectorStore) -> None:
    """Add documents, clear the store, verify count is 0."""
    store.add("doc one")
    store.add("doc two")
    assert store.count >= 2
    store.clear()
    assert store.count == 0


def test_fallback_mode() -> None:
    """Force ChromaDB failure by breaking the client, verify fallback works."""
    vs = VectorStore()
    # Force fallback mode
    vs._use_chroma = False
    vs._fallback_docs.clear()

    doc_id = vs.add("Fallback document about crypto inheritance")
    assert doc_id  # should return an id string

    results = vs.query("crypto inheritance")
    assert len(results) >= 1
    assert "Fallback document" in results[0]["document"]


def test_keyword_fallback_search() -> None:
    """In fallback mode, verify keyword-based search returns relevant docs."""
    vs = VectorStore()
    vs._use_chroma = False
    vs._fallback_docs.clear()

    vs.add("Smart contracts automate trustless execution")
    vs.add("Hardware wallets store private keys offline")
    vs.add("Inheritance planning requires legal documents")

    results = vs.query("hardware wallets keys", n_results=2)
    # The doc about hardware wallets should rank first due to keyword overlap
    assert len(results) >= 1
    assert "Hardware wallets" in results[0]["document"]
