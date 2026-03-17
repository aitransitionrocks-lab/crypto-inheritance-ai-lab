"""
Trigger / dead-man's-switch API routes.

Provides check-in, trigger status, evaluation, pause, and resume endpoints.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import InheritancePlanModel, TriggerStatusModel
from backend.schemas import CheckInRequest, CheckInResponse, TriggerResponse
from backend.core.trigger_service import evaluate_all_plans

router = APIRouter(prefix="/api/plans", tags=["triggers"])


async def _get_trigger_or_404(db: AsyncSession, plan_id: str) -> TriggerStatusModel:
    """Fetch the trigger status for a plan or raise 404."""
    result = await db.execute(
        select(TriggerStatusModel).where(TriggerStatusModel.plan_id == plan_id)
    )
    trigger = result.scalar_one_or_none()
    if not trigger:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trigger status not found")
    return trigger


@router.post("/{plan_id}/checkin", response_model=CheckInResponse)
async def check_in(
    plan_id: str,
    payload: CheckInRequest,
    db: AsyncSession = Depends(get_db),
):
    """Record a check-in (proof of liveness) and reset the timer."""
    trigger = await _get_trigger_or_404(db, plan_id)

    # Fetch plan for interval
    plan_result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = plan_result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    now = datetime.now(timezone.utc)
    trigger.last_check_in = now
    trigger.missed_count = 0
    trigger.status = "active"

    await db.commit()

    next_due = now + timedelta(days=plan.trigger_interval_days)
    return CheckInResponse(success=True, next_due=next_due)


@router.get("/{plan_id}/trigger", response_model=TriggerResponse)
async def get_trigger_status(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Get the current trigger status for a plan."""
    trigger = await _get_trigger_or_404(db, plan_id)
    return TriggerResponse(
        plan_id=trigger.plan_id,
        last_check_in=trigger.last_check_in,
        missed_count=trigger.missed_count,
        status=trigger.status,
    )


@router.post("/{plan_id}/trigger/evaluate")
async def evaluate_trigger(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Simulate trigger evaluation for all active plans."""
    results = await evaluate_all_plans(db)
    return {"evaluated": len(results), "triggered": results}


@router.post("/{plan_id}/trigger/pause", response_model=TriggerResponse)
async def pause_trigger(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Pause the dead-man's switch for a plan."""
    trigger = await _get_trigger_or_404(db, plan_id)
    trigger.status = "paused"
    await db.commit()
    return TriggerResponse(
        plan_id=trigger.plan_id,
        last_check_in=trigger.last_check_in,
        missed_count=trigger.missed_count,
        status=trigger.status,
    )


@router.post("/{plan_id}/trigger/resume", response_model=TriggerResponse)
async def resume_trigger(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Resume the dead-man's switch for a plan."""
    trigger = await _get_trigger_or_404(db, plan_id)
    trigger.status = "active"
    trigger.missed_count = 0
    trigger.last_check_in = datetime.now(timezone.utc)
    await db.commit()
    return TriggerResponse(
        plan_id=trigger.plan_id,
        last_check_in=trigger.last_check_in,
        missed_count=trigger.missed_count,
        status=trigger.status,
    )
