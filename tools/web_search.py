"""
Web search tool using the Serper API (Google Search).
Returns structured results with title, link, snippet.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

from config.settings import settings

logger = logging.getLogger(__name__)

SERPER_URL = "https://google.serper.dev/search"


async def web_search(
    query: str,
    num_results: int | None = None,
) -> list[dict[str, Any]]:
    """
    Search the web via Serper API.

    Returns list of {"title", "link", "snippet"} dicts.
    """
    num_results = num_results or settings.max_search_results

    if not settings.serper_api_key:
        logger.warning("SERPER_API_KEY not set – returning empty results")
        return []

    headers = {
        "X-API-KEY": settings.serper_api_key,
        "Content-Type": "application/json",
    }
    payload = {"q": query, "num": num_results}

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(SERPER_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
        except httpx.HTTPError as exc:
            logger.error("Serper search failed: %s", exc)
            return []

    results: list[dict[str, Any]] = []
    for item in data.get("organic", []):
        results.append(
            {
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", ""),
            }
        )

    logger.info("Search '%s' → %d results", query, len(results))
    return results
