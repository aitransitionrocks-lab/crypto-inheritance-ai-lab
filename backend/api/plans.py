"""
Inheritance plan management API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.database import get_db
from backend.models import InheritancePlanModel, TriggerStatusModel, User
from backend.schemas import PlanCreate, PlanResponse

router = APIRouter(prefix="/api/plans", tags=["plans"])


async def _get_user_or_404(db: AsyncSession, user_id: str) -> User:
    """Fetch a user by ID or raise 404."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_plan(
    payload: PlanCreate,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Create a new inheritance plan for a user."""
    await _get_user_or_404(db, user_id)

    plan = InheritancePlanModel(
        user_id=user_id,
        plan_name=payload.plan_name,
        threshold=payload.threshold,
        total_shares=payload.total_shares,
        trigger_interval_days=payload.trigger_interval_days,
        max_missed_checkins=payload.max_missed_checkins,
        safety_period_days=payload.safety_period_days,
    )
    db.add(plan)
    await db.flush()

    # Create associated trigger status
    trigger = TriggerStatusModel(plan_id=plan.id)
    db.add(trigger)

    await db.commit()
    await db.refresh(plan)

    # Reload with heirs relationship
    result = await db.execute(
        select(InheritancePlanModel)
        .options(selectinload(InheritancePlanModel.heirs))
        .where(InheritancePlanModel.id == plan.id)
    )
    return result.scalar_one()


@router.get("/", response_model=list[PlanResponse])
async def list_plans(user_id: str = Query(...), db: AsyncSession = Depends(get_db)):
    """List all inheritance plans for a user."""
    result = await db.execute(
        select(InheritancePlanModel)
        .options(selectinload(InheritancePlanModel.heirs))
        .where(InheritancePlanModel.user_id == user_id)
    )
    return result.scalars().all()


@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single plan with its heirs."""
    result = await db.execute(
        select(InheritancePlanModel)
        .options(selectinload(InheritancePlanModel.heirs))
        .where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return plan


@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(plan_id: str, payload: PlanCreate, db: AsyncSession = Depends(get_db)):
    """Update plan settings."""
    result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    plan.plan_name = payload.plan_name
    plan.threshold = payload.threshold
    plan.total_shares = payload.total_shares
    plan.trigger_interval_days = payload.trigger_interval_days
    plan.max_missed_checkins = payload.max_missed_checkins
    plan.safety_period_days = payload.safety_period_days

    await db.commit()

    result = await db.execute(
        select(InheritancePlanModel)
        .options(selectinload(InheritancePlanModel.heirs))
        .where(InheritancePlanModel.id == plan_id)
    )
    return result.scalar_one()


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plan(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a plan and its associated data."""
    result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    await db.delete(plan)
    await db.commit()
