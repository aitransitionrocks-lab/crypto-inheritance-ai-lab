"""
Central configuration for the Crypto Inheritance AI Lab.
Loads API keys from environment and defines shared constants.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# Load .env from project root
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_PROJECT_ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    """Immutable application settings."""

    # --- API Keys ---
    gemini_api_key: str = field(
        default_factory=lambda: os.environ.get("GEMINI_API_KEY", "")
    )
    serper_api_key: str = field(
        default_factory=lambda: os.environ.get("SERPER_API_KEY", "")
    )
    firecrawl_api_key: str = field(
        default_factory=lambda: os.environ.get("FIRECRAWL_API_KEY", "")
    )

    # --- Model ---
    model_name: str = "gemini-2.5-flash"
    max_tokens: int = 8192
    temperature: float = 0.3

    # --- Paths ---
    project_root: Path = _PROJECT_ROOT
    reports_dir: Path = _PROJECT_ROOT / "reports"
    chroma_dir: Path = _PROJECT_ROOT / "memory" / ".chroma_db"

    # --- Vector Store ---
    collection_name: str = "crypto_inheritance_research"
    embedding_model: str = "all-MiniLM-L6-v2"

    # --- Research ---
    max_search_results: int = 10
    max_scrape_pages: int = 5

    def validate(self) -> list[str]:
        """Return a list of missing required keys."""
        missing: list[str] = []
        if not self.gemini_api_key:
            missing.append("GEMINI_API_KEY")
        if not self.serper_api_key:
            missing.append("SERPER_API_KEY")
        return missing


settings = Settings()
