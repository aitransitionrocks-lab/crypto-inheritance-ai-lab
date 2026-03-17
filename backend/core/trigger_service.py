"""
Trigger service layer wrapping protocol/triggers.

Evaluates all active plans and logs what would trigger.
Real notifications are not yet implemented.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import InheritancePlanModel, TriggerStatusModel

logger = logging.getLogger(__name__)


async def evaluate_all_plans(db: AsyncSession) -> list[dict]:
    """
    Evaluate all active inheritance plans for trigger conditions.

    Checks every plan whose trigger status is ``active`` and logs what
    would happen (no real notifications are sent yet).

    Args:
        db: An async database session.

    Returns:
        A list of dicts describing plans that would be triggered.
    """
    result = await db.execute(
        select(TriggerStatusModel).where(TriggerStatusModel.status == "active")
    )
    triggers = result.scalars().all()

    triggered: list[dict] = []
    now = datetime.now(timezone.utc)

    for ts in triggers:
        plan_result = await db.execute(
            select(InheritancePlanModel).where(InheritancePlanModel.id == ts.plan_id)
        )
        plan = plan_result.scalar_one_or_none()
        if plan is None:
            continue

        interval = timedelta(days=plan.trigger_interval_days)
        next_due = ts.last_check_in + interval if ts.last_check_in else now

        if now > next_due:
            ts.missed_count += 1
            logger.warning(
                "[%s] Missed check-in #%d for plan '%s'",
                ts.plan_id,
                ts.missed_count,
                plan.plan_name,
            )

            if ts.missed_count >= plan.max_missed_checkins:
                ts.status = "triggered"
                ts.triggered_at = now
                logger.warning(
                    "[%s] TRIGGER ACTIVATED for plan '%s'",
                    ts.plan_id,
                    plan.plan_name,
                )
                triggered.append({
                    "plan_id": ts.plan_id,
                    "plan_name": plan.plan_name,
                    "missed_count": ts.missed_count,
                    "status": "triggered",
                })

    await db.commit()
    return triggered
