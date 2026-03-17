"""
Application configuration loaded from environment variables.

Uses a .env file if present, with sensible defaults for local development.
"""

import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./legacyguard.db")
SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
