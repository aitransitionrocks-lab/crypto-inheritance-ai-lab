"""
Heir management API routes.

Heirs are linked to both a user and a specific inheritance plan.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import HeirModel, InheritancePlanModel
from backend.schemas import HeirCreate, HeirResponse

router = APIRouter(prefix="/api/plans", tags=["heirs"])


async def _get_plan_or_404(db: AsyncSession, plan_id: str) -> InheritancePlanModel:
    """Fetch a plan by ID or raise 404."""
    result = await db.execute(
        select(InheritancePlanModel).where(InheritancePlanModel.id == plan_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return plan


@router.post(
    "/{plan_id}/heirs",
    response_model=HeirResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_heir(
    plan_id: str,
    payload: HeirCreate,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Add an heir to an inheritance plan."""
    plan = await _get_plan_or_404(db, plan_id)

    heir = HeirModel(
        user_id=plan.user_id,
        plan_id=plan.id,
        name=payload.name,
        email=payload.email,
        relationship=payload.relationship,
    )
    db.add(heir)
    await db.commit()
    await db.refresh(heir)
    return heir


@router.get("/{plan_id}/heirs", response_model=list[HeirResponse])
async def list_heirs(plan_id: str, db: AsyncSession = Depends(get_db)):
    """List all heirs for a plan."""
    await _get_plan_or_404(db, plan_id)
    result = await db.execute(
        select(HeirModel).where(HeirModel.plan_id == plan_id)
    )
    return result.scalars().all()


@router.delete("/{plan_id}/heirs/{heir_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_heir(plan_id: str, heir_id: str, db: AsyncSession = Depends(get_db)):
    """Remove an heir from a plan."""
    result = await db.execute(
        select(HeirModel).where(HeirModel.id == heir_id, HeirModel.plan_id == plan_id)
    )
    heir = result.scalar_one_or_none()
    if not heir:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Heir not found")

    await db.delete(heir)
    await db.commit()


@router.put("/{plan_id}/heirs/{heir_id}/verify", response_model=HeirResponse)
async def verify_heir(plan_id: str, heir_id: str, db: AsyncSession = Depends(get_db)):
    """Mark an heir as identity-verified."""
    result = await db.execute(
        select(HeirModel).where(HeirModel.id == heir_id, HeirModel.plan_id == plan_id)
    )
    heir = result.scalar_one_or_none()
    if not heir:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Heir not found")

    heir.verification_status = "verified"
    await db.commit()
    await db.refresh(heir)
    return heir
