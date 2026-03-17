"""
SQLAlchemy ORM models for LegacyGuard.

All primary keys use UUIDs. Private keys and shard values are NEVER stored
in the database.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
)
from sqlalchemy.orm import relationship as sa_relationship

from backend.database import Base


def _utcnow() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


def _new_uuid() -> str:
    """Generate a new UUID4 string."""
    return str(uuid.uuid4())


class User(Base):
    """A registered user / asset owner."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_new_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    primary_wallet_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

    plans = sa_relationship("InheritancePlanModel", back_populates="user", cascade="all, delete-orphan")
    heirs = sa_relationship("HeirModel", back_populates="user", cascade="all, delete-orphan")


class HeirModel(Base):
    """A designated heir linked to a user."""

    __tablename__ = "heirs"

    id = Column(String, primary_key=True, default=_new_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    plan_id = Column(String, ForeignKey("inheritance_plans.id"), nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    relationship = Column(String, nullable=False)
    shard_index = Column(Integer, nullable=True)
    verification_status = Column(String, default="pending")
    created_at = Column(DateTime, default=_utcnow)

    user = sa_relationship("User", back_populates="heirs")
    plan = sa_relationship("InheritancePlanModel", back_populates="heirs")


class InheritancePlanModel(Base):
    """An inheritance plan owned by a user."""

    __tablename__ = "inheritance_plans"

    id = Column(String, primary_key=True, default=_new_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    plan_name = Column(String, nullable=False)
    threshold = Column(Integer, default=2)
    total_shares = Column(Integer, default=3)
    encrypted_instructions = Column(LargeBinary, nullable=True)
    trigger_interval_days = Column(Integer, default=90)
    max_missed_checkins = Column(Integer, default=2)
    safety_period_days = Column(Integer, default=7)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    user = sa_relationship("User", back_populates="plans")
    heirs = sa_relationship("HeirModel", back_populates="plan", cascade="all, delete-orphan")
    trigger_status = sa_relationship("TriggerStatusModel", back_populates="plan", uselist=False, cascade="all, delete-orphan")


class TriggerStatusModel(Base):
    """Tracks the dead-man's-switch state for an inheritance plan."""

    __tablename__ = "trigger_statuses"

    id = Column(String, primary_key=True, default=_new_uuid)
    plan_id = Column(String, ForeignKey("inheritance_plans.id"), nullable=False, unique=True)
    last_check_in = Column(DateTime, default=_utcnow)
    missed_count = Column(Integer, default=0)
    status = Column(String, default="active")
    triggered_at = Column(DateTime, nullable=True)

    plan = sa_relationship("InheritancePlanModel", back_populates="trigger_status")
