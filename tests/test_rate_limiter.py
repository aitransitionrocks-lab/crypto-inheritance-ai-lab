"""Tests for the shared rate limiter in agents.base."""

import asyncio

from agents.base import _rate_limit, _rate_lock, _request_times


def test_rate_limit_basic() -> None:
    """A single call to _rate_limit() should complete without blocking."""
    # Clear any prior state
    _request_times.clear()
    asyncio.run(_rate_limit())
    # If we get here without hanging, the test passes


def test_rate_limit_tracks_requests() -> None:
    """After calling _rate_limit(), _request_times should have an entry."""
    _request_times.clear()
    asyncio.run(_rate_limit())
    assert len(_request_times) == 1
    assert isinstance(_request_times[0], float)
