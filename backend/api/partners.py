"""
Partner API endpoints for LegacyGuard.

These endpoints are designed for wallet providers, custody platforms,
and other B2B partners integrating LegacyGuard inheritance features.

Authentication: Partners use API keys (X-API-Key header).
All endpoints mirror the user-facing API but with partner-scoped access.
"""

from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import Base, get_db

router = APIRouter(prefix="/v1/partners", tags=["Partners"])


# ------------------------------------------------------------------ models
class ApiKeyModel(Base):
    """Partner API key storage."""
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    partner_name = Column(String, nullable=False)
    key_hash = Column(String, nullable=False, unique=True)
    key_prefix = Column(String, nullable=False)  # First 8 chars for identification
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_used_at = Column(DateTime, nullable=True)


# ------------------------------------------------------------------ schemas
class PartnerKeyCreate(BaseModel):
    partner_name: str

class PartnerKeyResponse(BaseModel):
    id: str
    partner_name: str
    api_key: str  # Only returned once at creation
    key_prefix: str
    created_at: datetime

class PartnerPlanCreate(BaseModel):
    owner_email: str
    plan_name: str
    threshold: int = 2
    total_shares: int = 3
    trigger_interval_days: int = 90

class PartnerPlanResponse(BaseModel):
    plan_id: str
    plan_name: str
    status: str
    created_at: datetime

class PartnerHeirCreate(BaseModel):
    name: str
    email: str
    relationship: str

class PartnerCheckInResponse(BaseModel):
    success: bool
    plan_id: str
    next_due: str


# ------------------------------------------------------------------ auth
async def verify_api_key(
    x_api_key: str = Header(..., description="Partner API key"),
    db: AsyncSession = Depends(get_db),
) -> ApiKeyModel:
    """Verify partner API key and return the partner record."""
    key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    from sqlalchemy import select
    result = await db.execute(
        select(ApiKeyModel).where(
            ApiKeyModel.key_hash == key_hash,
            ApiKeyModel.is_active == True,
        )
    )
    partner = result.scalar_one_or_none()
    if not partner:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    partner.last_used_at = datetime.now(timezone.utc)
    await db.commit()
    return partner


# ------------------------------------------------------------------ endpoints
@router.post("/keys", response_model=PartnerKeyResponse)
async def create_api_key(
    data: PartnerKeyCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a new partner API key.

    The full API key is returned ONCE. Store it securely.
    Only the key prefix (first 8 chars) is stored for identification.
    """
    raw_key = f"lg_partner_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:16]

    api_key = ApiKeyModel(
        partner_name=data.partner_name,
        key_hash=key_hash,
        key_prefix=key_prefix,
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)

    return PartnerKeyResponse(
        id=api_key.id,
        partner_name=api_key.partner_name,
        api_key=raw_key,
        key_prefix=key_prefix,
        created_at=api_key.created_at,
    )


@router.post("/plans", response_model=PartnerPlanResponse)
async def create_partner_plan(
    data: PartnerPlanCreate,
    partner: ApiKeyModel = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db),
):
    """
    Create an inheritance plan on behalf of a partner's user.

    This is the primary B2B endpoint. Partners call this when their
    user initiates inheritance setup through the partner's UI.
    """
    from backend.models import InheritancePlanModel, User
    from sqlalchemy import select

    # Find or create user
    result = await db.execute(select(User).where(User.email == data.owner_email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(email=data.owner_email, hashed_password="partner_managed")
        db.add(user)
        await db.flush()

    plan = InheritancePlanModel(
        user_id=user.id,
        plan_name=data.plan_name,
        threshold=data.threshold,
        total_shares=data.total_shares,
        trigger_interval_days=data.trigger_interval_days,
    )
    db.add(plan)
    await db.commit()
    await db.refresh(plan)

    return PartnerPlanResponse(
        plan_id=plan.id,
        plan_name=plan.plan_name,
        status=plan.status,
        created_at=plan.created_at,
    )


@router.post("/plans/{plan_id}/heirs")
async def add_partner_heir(
    plan_id: str,
    data: PartnerHeirCreate,
    partner: ApiKeyModel = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db),
):
    """Add an heir to a plan via partner API."""
    from backend.models import HeirModel, InheritancePlanModel
    from sqlalchemy import select

    result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    heir = HeirModel(
        user_id=plan.user_id,
        name=data.name,
        email=data.email,
        heir_relationship=data.relationship,
    )
    db.add(heir)
    await db.commit()
    await db.refresh(heir)

    return {"id": heir.id, "name": heir.name, "status": heir.verification_status}


@router.get("/plans/{plan_id}")
async def get_partner_plan(
    plan_id: str,
    partner: ApiKeyModel = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db),
):
    """Get plan details via partner API."""
    from backend.models import InheritancePlanModel
    from sqlalchemy import select

    result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    return {
        "plan_id": plan.id,
        "plan_name": plan.plan_name,
        "status": plan.status,
        "threshold": plan.threshold,
        "trigger_interval_days": plan.trigger_interval_days,
        "created_at": plan.created_at.isoformat(),
    }


@router.post("/plans/{plan_id}/checkin", response_model=PartnerCheckInResponse)
async def partner_checkin(
    plan_id: str,
    partner: ApiKeyModel = Depends(verify_api_key),
    db: AsyncSession = Depends(get_db),
):
    """Record a check-in via partner API."""
    from backend.models import TriggerStatusModel
    from sqlalchemy import select

    result = await db.execute(
        select(TriggerStatusModel).where(TriggerStatusModel.plan_id == plan_id)
    )
    trigger = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if trigger:
        trigger.last_check_in = now
        trigger.missed_count = 0
        trigger.status = "active"
    else:
        trigger = TriggerStatusModel(plan_id=plan_id, last_check_in=now)
        db.add(trigger)

    await db.commit()

    return PartnerCheckInResponse(
        success=True,
        plan_id=plan_id,
        next_due=(now.isoformat()),
    )
