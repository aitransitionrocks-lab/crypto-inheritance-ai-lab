"""
Integration tests for the LegacyGuard API using httpx AsyncClient.

Each test gets a fresh in-memory SQLite database.
"""

from __future__ import annotations

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from backend.database import Base, get_db
from backend.main import app


# ── Fixtures ─────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def client():
    """Provide an async test client with an isolated in-memory database."""
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    TestSession = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def _override_get_db():
        async with TestSession() as session:
            try:
                yield session
            finally:
                await session.close()

    app.dependency_overrides[get_db] = _override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
    await test_engine.dispose()


async def _create_user(client: AsyncClient) -> dict:
    """Helper: register a user and return the response JSON."""
    resp = await client.post(
        "/api/users/register",
        json={"email": "alice@example.com", "password": "s3cret"},
    )
    assert resp.status_code == 201
    return resp.json()


async def _create_plan(client: AsyncClient, user_id: str) -> dict:
    """Helper: create a plan and return the response JSON."""
    resp = await client.post(
        "/api/plans/",
        params={"user_id": user_id},
        json={"plan_name": "My Plan"},
    )
    assert resp.status_code == 201
    return resp.json()


# ── Tests ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    """GET /health should return 200 with status ok."""
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    """POST /api/users/register should create and return a new user."""
    data = await _create_user(client)
    assert "id" in data
    assert data["email"] == "alice@example.com"


@pytest.mark.asyncio
async def test_create_plan(client: AsyncClient):
    """Creating a plan should return the plan with default settings."""
    user = await _create_user(client)
    plan = await _create_plan(client, user["id"])
    assert plan["plan_name"] == "My Plan"
    assert plan["threshold"] == 2
    assert plan["total_shares"] == 3


@pytest.mark.asyncio
async def test_add_heir(client: AsyncClient):
    """Adding an heir to a plan should succeed."""
    user = await _create_user(client)
    plan = await _create_plan(client, user["id"])

    resp = await client.post(
        f"/api/plans/{plan['id']}/heirs",
        params={"user_id": user["id"]},
        json={"name": "Bob", "email": "bob@example.com", "relationship": "sibling"},
    )
    assert resp.status_code == 201
    heir = resp.json()
    assert heir["name"] == "Bob"
    assert heir["verification_status"] == "pending"


@pytest.mark.asyncio
async def test_checkin(client: AsyncClient):
    """Check-in should reset the timer and return next due date."""
    user = await _create_user(client)
    plan = await _create_plan(client, user["id"])

    resp = await client.post(
        f"/api/plans/{plan['id']}/checkin",
        json={"method": "app"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "next_due" in body


@pytest.mark.asyncio
async def test_trigger_status(client: AsyncClient):
    """Getting trigger status for a plan should return active status."""
    user = await _create_user(client)
    plan = await _create_plan(client, user["id"])

    resp = await client.get(f"/api/plans/{plan['id']}/trigger")
    assert resp.status_code == 200
    body = resp.json()
    assert body["plan_id"] == plan["id"]
    assert body["status"] == "active"
