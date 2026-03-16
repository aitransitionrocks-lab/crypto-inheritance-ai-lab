"""
Base agent class providing shared LLM reasoning + memory + tool access.
Every specialized agent inherits from this.
Uses Google Gemini API via REST (httpx) for LLM reasoning.
"""

from __future__ import annotations

import asyncio
import logging
import random
import time
from abc import ABC, abstractmethod
from typing import Any

import httpx

from config.settings import settings
from memory.vector_store import VectorStore
from tools.web_search import web_search
from tools.scraper import scrape_url

logger = logging.getLogger(__name__)

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
)

# Shared rate limiter — uses time.monotonic() (no event-loop dependency)
_rate_lock = asyncio.Lock()
_request_times: list[float] = []
_MAX_RPM = 8  # conservative: free tier is 15, leave headroom for parallel agents


async def _rate_limit() -> None:
    """Sliding-window rate limiter: max _MAX_RPM requests per 60s."""
    async with _rate_lock:
        now = time.monotonic()
        # Prune requests older than 60s
        while _request_times and now - _request_times[0] > 60:
            _request_times.pop(0)
        if len(_request_times) >= _MAX_RPM:
            wait = 60 - (now - _request_times[0]) + 1.0
            logger.info("Rate limit: waiting %.1fs before next Gemini call", wait)
            await asyncio.sleep(wait)
        _request_times.append(time.monotonic())


class BaseAgent(ABC):
    """Abstract base for all research agents."""

    name: str = "base"
    role: str = "General research agent"
    system_prompt: str = "You are a helpful research assistant."

    def __init__(self, memory: VectorStore) -> None:
        self.memory = memory

    # ----------------------------------------------------------- LLM helpers
    async def think(self, prompt: str, context: str = "") -> str:
        """Send a prompt to Gemini with rate limiting and exponential backoff."""
        full_prompt = prompt
        if context:
            full_prompt = f"Context:\n{context}\n\n---\n\n{prompt}"

        url = GEMINI_URL.format(model=settings.model_name)
        payload = {
            "system_instruction": {
                "parts": [{"text": self.system_prompt}]
            },
            "contents": [
                {"role": "user", "parts": [{"text": full_prompt}]}
            ],
            "generationConfig": {
                "maxOutputTokens": settings.max_tokens,
                "temperature": settings.temperature,
            },
        }

        max_retries = 10
        for attempt in range(max_retries):
            await _rate_limit()
            try:
                async with httpx.AsyncClient(timeout=180) as client:
                    resp = await client.post(
                        url,
                        params={"key": settings.gemini_api_key},
                        json=payload,
                    )
            except httpx.HTTPError as exc:
                logger.warning("[%s] HTTP error: %s, retry %d/%d", self.name, exc, attempt + 1, max_retries)
                await asyncio.sleep(2 ** attempt)
                continue

            if resp.status_code == 429:
                backoff = min(2 ** attempt + random.uniform(0, 2), 120)
                logger.warning(
                    "[%s] Rate limited (429), retry %d/%d in %.1fs",
                    self.name, attempt + 1, max_retries, backoff,
                )
                await asyncio.sleep(backoff)
                continue

            if resp.status_code >= 500:
                backoff = 2 ** attempt + random.uniform(0, 1)
                logger.warning("[%s] Server error %d, retry %d/%d", self.name, resp.status_code, attempt + 1, max_retries)
                await asyncio.sleep(backoff)
                continue

            resp.raise_for_status()
            data = resp.json()

            candidates = data.get("candidates", [])
            if not candidates:
                logger.warning("[%s] No candidates in response, retry %d/%d", self.name, attempt + 1, max_retries)
                await asyncio.sleep(2)
                continue

            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if not text:
                logger.warning("[%s] Empty response text, retry %d/%d", self.name, attempt + 1, max_retries)
                await asyncio.sleep(2)
                continue

            logger.debug("[%s] LLM response (%d chars)", self.name, len(text))
            return text

        raise RuntimeError(f"[{self.name}] Gemini API failed after {max_retries} retries")

    # ----------------------------------------------------------- tool helpers
    async def search(self, query: str) -> list[dict[str, Any]]:
        """Perform a web search and store results in memory."""
        results = await web_search(query)
        for r in results:
            self.memory.add(
                text=f"{r['title']}\n{r['snippet']}\n{r['link']}",
                metadata={"agent": self.name, "type": "search", "source": r["link"]},
            )
        return results

    async def scrape(self, url: str) -> str:
        """Scrape a URL, store content in memory, return text."""
        content = await scrape_url(url)
        if content:
            self.memory.add(
                text=content[:5000],
                metadata={"agent": self.name, "type": "scrape", "source": url},
            )
        return content

    def recall(self, query: str, n: int = 5) -> str:
        """Retrieve relevant context from shared memory."""
        docs = self.memory.query(query, n_results=n)
        return "\n\n---\n\n".join(d["document"] for d in docs)

    # ----------------------------------------------------------- store output
    def store_output(self, section: str, content: str) -> None:
        """Persist the agent's final output to memory."""
        self.memory.add(
            text=content,
            metadata={"agent": self.name, "type": "output", "section": section},
        )
        logger.info("[%s] Stored output for section '%s'", self.name, section)

    # ----------------------------------------------------------- main entry
    @abstractmethod
    async def run(self, startup_idea: str) -> dict[str, str]:
        """
        Execute the agent's full workflow.
        Returns dict of {section_name: markdown_content}.
        """
        ...

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r}>"
