"""
SQLAlchemy async database setup for LegacyGuard backend.

Provides the engine, session factory, declarative Base, and a FastAPI dependency
for obtaining a database session.
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from backend.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_db():
    """FastAPI dependency that yields an async database session."""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
