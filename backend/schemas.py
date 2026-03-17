"""
Pydantic schemas for API request/response validation.

Shard *values* are never included in server responses; only metadata
(index, label) is exposed.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


# ── Users ────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    """Request body for user registration."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Public representation of a user."""
    id: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Heirs ────────────────────────────────────────────────────────────────

class HeirCreate(BaseModel):
    """Request body for adding an heir."""
    name: str
    email: EmailStr
    relationship: str


class HeirResponse(BaseModel):
    """Public representation of an heir."""
    id: str
    name: str
    email: str
    relationship: str
    verification_status: str
    shard_index: Optional[int] = None

    model_config = {"from_attributes": True}


# ── Plans ────────────────────────────────────────────────────────────────

class PlanCreate(BaseModel):
    """Request body for creating an inheritance plan."""
    plan_name: str
    threshold: int = 2
    total_shares: int = 3
    trigger_interval_days: int = 90
    max_missed_checkins: int = 2
    safety_period_days: int = 7


class PlanResponse(BaseModel):
    """Public representation of an inheritance plan."""
    id: str
    user_id: str
    plan_name: str
    threshold: int
    total_shares: int
    trigger_interval_days: int
    max_missed_checkins: int
    safety_period_days: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    heirs: List[HeirResponse] = []

    model_config = {"from_attributes": True}


# ── Triggers ─────────────────────────────────────────────────────────────

class TriggerResponse(BaseModel):
    """Public representation of a plan's trigger status."""
    plan_id: str
    last_check_in: Optional[datetime] = None
    missed_count: int
    status: str

    model_config = {"from_attributes": True}


class CheckInRequest(BaseModel):
    """Request body for performing a check-in."""
    method: str = "app"


class CheckInResponse(BaseModel):
    """Response after a successful check-in."""
    success: bool
    next_due: datetime


# ── Key Splits ───────────────────────────────────────────────────────────

class ShardMeta(BaseModel):
    """Metadata for a single shard (value is NEVER returned to the server)."""
    index: int
    label: str


class KeySplitResponse(BaseModel):
    """
    Response for key-split operations.

    NOTE: Actual shard values are NOT returned to the server.  They are
    generated client-side and distributed directly to the intended recipients.
    """
    shards: List[ShardMeta]
