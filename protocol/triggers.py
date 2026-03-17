"""
LegacyGuard Dead Man's Switch & Trigger Logic
==============================================

Handles inactivity detection, periodic check-ins, and inheritance trigger events.

Flow:
    1. Owner configures: check-in interval (e.g., 90 days), max missed check-ins (e.g., 2)
    2. System sends reminders before each check-in deadline
    3. Owner checks in (proves liveness) → timer resets
    4. If owner misses check-ins → trigger sequence starts:
       a. Notify emergency contacts for confirmation
       b. Wait safety period (48h-7d) for owner to cancel
       c. If not cancelled → initiate heir claim process
    5. Owner can always cancel a triggered event by proving liveness

Multi-factor verification prevents false triggers:
    - Primary: Inactivity detection (no check-in)
    - Secondary: Trusted contact confirmation (optional)
    - Safety: Cool-down period before irreversible actions
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import List, Optional

logger = logging.getLogger(__name__)


class TriggerStatus(Enum):
    """Possible states of the dead man's switch."""
    ACTIVE = "active"           # Normal operation, owner checking in
    WARNING = "warning"         # Check-in overdue, reminders sent
    TRIGGERED = "triggered"     # Max missed check-ins exceeded, process started
    SAFETY_PERIOD = "safety"    # Waiting for owner to cancel before proceeding
    EXECUTED = "executed"       # Inheritance process completed
    CANCELLED = "cancelled"     # Owner proved liveness, trigger cancelled
    PAUSED = "paused"           # Manually paused by owner


@dataclass
class CheckIn:
    """Record of a single check-in event."""
    timestamp: datetime
    method: str  # "app", "email", "sms", "hardware_key"
    device_info: str = ""
    ip_address: str = ""


@dataclass
class TriggerEvent:
    """Record of a trigger activation."""
    triggered_at: datetime
    reason: str
    safety_period_ends: datetime
    cancelled: bool = False
    cancelled_at: Optional[datetime] = None
    executed: bool = False
    executed_at: Optional[datetime] = None


@dataclass
class DeadManSwitch:
    """
    Core dead man's switch implementation.

    Manages the lifecycle of inactivity-based inheritance triggers.

    Args:
        plan_id: Unique identifier for the inheritance plan.
        check_in_interval_days: Days between required check-ins (default: 90).
        max_missed_check_ins: How many missed check-ins before triggering (default: 2).
        safety_period_days: Days to wait after trigger before executing (default: 7).
        notify_contacts: Email addresses to notify on trigger events.
        check_in_methods: Allowed check-in methods (default: all).
    """

    plan_id: str
    check_in_interval_days: int = 90
    max_missed_check_ins: int = 2
    safety_period_days: int = 7
    notify_contacts: List[str] = field(default_factory=list)
    check_in_methods: List[str] = field(
        default_factory=lambda: ["app", "email", "sms", "hardware_key"]
    )

    # Internal state
    status: TriggerStatus = TriggerStatus.ACTIVE
    check_in_history: List[CheckIn] = field(default_factory=list)
    missed_check_ins: int = 0
    trigger_events: List[TriggerEvent] = field(default_factory=list)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    last_activity: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    # ------------------------------------------------------------------ check-in
    def check_in(self, method: str = "app", device_info: str = "", ip_address: str = "") -> bool:
        """
        Record a check-in (proof of liveness).

        Resets the missed counter and cancels any pending triggers.

        Returns:
            True if check-in was accepted.
        """
        if method not in self.check_in_methods:
            logger.warning("[%s] Invalid check-in method: %s", self.plan_id, method)
            return False

        now = datetime.now(timezone.utc)
        self.check_in_history.append(CheckIn(
            timestamp=now,
            method=method,
            device_info=device_info,
            ip_address=ip_address,
        ))
        self.last_activity = now
        self.missed_check_ins = 0

        # Cancel any pending trigger
        if self.status in (TriggerStatus.TRIGGERED, TriggerStatus.SAFETY_PERIOD, TriggerStatus.WARNING):
            self._cancel_trigger(now)

        self.status = TriggerStatus.ACTIVE
        logger.info("[%s] Check-in recorded via %s. Status: ACTIVE", self.plan_id, method)
        return True

    def record_activity(self) -> None:
        """Record passive activity (e.g., app login) — does NOT count as check-in."""
        self.last_activity = datetime.now(timezone.utc)
        logger.debug("[%s] Activity recorded", self.plan_id)

    # ------------------------------------------------------------------ evaluate
    def evaluate_trigger(self) -> TriggerStatus:
        """
        Evaluate whether the trigger should fire based on current state.

        Call this periodically (e.g., daily cron job).

        Returns:
            The current TriggerStatus after evaluation.
        """
        if self.status in (TriggerStatus.EXECUTED, TriggerStatus.CANCELLED, TriggerStatus.PAUSED):
            return self.status

        now = datetime.now(timezone.utc)

        # Check if we're in safety period
        if self.status == TriggerStatus.SAFETY_PERIOD:
            return self._evaluate_safety_period(now)

        # Check if check-in is overdue
        next_due = self._next_check_in_due()
        if next_due and now > next_due:
            self.missed_check_ins += 1
            logger.warning(
                "[%s] Missed check-in #%d (due: %s)",
                self.plan_id, self.missed_check_ins, next_due.isoformat(),
            )

            if self.missed_check_ins >= self.max_missed_check_ins:
                return self._activate_trigger(now)
            else:
                self.status = TriggerStatus.WARNING
                logger.info("[%s] Status: WARNING — %d/%d missed",
                           self.plan_id, self.missed_check_ins, self.max_missed_check_ins)

        return self.status

    # ------------------------------------------------------------------ control
    def pause(self) -> None:
        """Temporarily pause the switch (e.g., during travel)."""
        self.status = TriggerStatus.PAUSED
        logger.info("[%s] Switch PAUSED", self.plan_id)

    def resume(self) -> None:
        """Resume after pause. Resets the check-in timer."""
        self.status = TriggerStatus.ACTIVE
        self.last_activity = datetime.now(timezone.utc)
        self.missed_check_ins = 0
        logger.info("[%s] Switch RESUMED", self.plan_id)

    # ------------------------------------------------------------------ queries
    @property
    def next_check_in_due(self) -> Optional[datetime]:
        """When the next check-in is due."""
        return self._next_check_in_due()

    @property
    def days_until_due(self) -> Optional[int]:
        """Days until next check-in is due (negative = overdue)."""
        due = self._next_check_in_due()
        if due is None:
            return None
        delta = due - datetime.now(timezone.utc)
        return delta.days

    @property
    def is_overdue(self) -> bool:
        days = self.days_until_due
        return days is not None and days < 0

    # ------------------------------------------------------------------ internals
    def _next_check_in_due(self) -> Optional[datetime]:
        last = self.check_in_history[-1].timestamp if self.check_in_history else self.created_at
        return last + timedelta(days=self.check_in_interval_days)

    def _activate_trigger(self, now: datetime) -> TriggerStatus:
        """Activate the trigger — start safety period."""
        safety_ends = now + timedelta(days=self.safety_period_days)
        event = TriggerEvent(
            triggered_at=now,
            reason=f"Missed {self.missed_check_ins} consecutive check-ins",
            safety_period_ends=safety_ends,
        )
        self.trigger_events.append(event)
        self.status = TriggerStatus.SAFETY_PERIOD

        logger.warning(
            "[%s] TRIGGER ACTIVATED. Safety period until %s. Notifying %d contacts.",
            self.plan_id, safety_ends.isoformat(), len(self.notify_contacts),
        )

        # TODO: Send notifications to contacts and heirs
        # TODO: Integrate with notification service
        for contact in self.notify_contacts:
            logger.info("[%s] → Notify: %s", self.plan_id, contact)

        return self.status

    def _evaluate_safety_period(self, now: datetime) -> TriggerStatus:
        """Check if safety period has expired."""
        if not self.trigger_events:
            return self.status

        latest = self.trigger_events[-1]
        if latest.cancelled:
            self.status = TriggerStatus.ACTIVE
            return self.status

        if now >= latest.safety_period_ends:
            latest.executed = True
            latest.executed_at = now
            self.status = TriggerStatus.EXECUTED

            logger.warning(
                "[%s] TRIGGER EXECUTED. Safety period expired. Initiating recovery.",
                self.plan_id,
            )
            # TODO: Initiate heir recovery flow via protocol/heirs.py
            return self.status

        remaining = (latest.safety_period_ends - now).days
        logger.info("[%s] Safety period: %d days remaining", self.plan_id, remaining)
        return self.status

    def _cancel_trigger(self, now: datetime) -> None:
        """Cancel the most recent trigger event."""
        if self.trigger_events:
            latest = self.trigger_events[-1]
            if not latest.executed:
                latest.cancelled = True
                latest.cancelled_at = now
                logger.info("[%s] Trigger CANCELLED — owner proved liveness", self.plan_id)
