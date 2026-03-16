"""
Web scraping tool.
Uses Firecrawl API if available, falls back to plain httpx + basic HTML stripping.
"""

from __future__ import annotations

import logging
import re

import httpx

from config.settings import settings

logger = logging.getLogger(__name__)

FIRECRAWL_URL = "https://api.firecrawl.dev/v1/scrape"


async def scrape_url(url: str) -> str:
    """
    Scrape a URL and return clean text/markdown content.
    Prefers Firecrawl for JS-rendered pages; falls back to raw HTTP.
    """
    if settings.firecrawl_api_key:
        return await _scrape_firecrawl(url)
    return await _scrape_raw(url)


async def _scrape_firecrawl(url: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.firecrawl_api_key}",
        "Content-Type": "application/json",
    }
    payload = {"url": url, "formats": ["markdown"]}

    async with httpx.AsyncClient(timeout=60) as client:
        try:
            resp = await client.post(FIRECRAWL_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("data", {}).get("markdown", "")
            logger.info("Firecrawl scraped %s (%d chars)", url, len(content))
            return content
        except httpx.HTTPError as exc:
            logger.warning("Firecrawl failed for %s: %s – falling back", url, exc)
            return await _scrape_raw(url)


async def _scrape_raw(url: str) -> str:
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        try:
            resp = await client.get(url)
            resp.raise_for_status()
            text = _strip_html(resp.text)
            logger.info("Raw-scraped %s (%d chars)", url, len(text))
            return text[:15_000]  # cap to avoid token explosion
        except httpx.HTTPError as exc:
            logger.error("Raw scrape failed for %s: %s", url, exc)
            return ""


def _strip_html(html: str) -> str:
    """Naive HTML→text conversion."""
    text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text
