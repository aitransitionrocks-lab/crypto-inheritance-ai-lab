"""
User management API routes.

Provides registration, login (placeholder), and profile retrieval.
"""

from __future__ import annotations

import hashlib

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


def _hash_password(password: str) -> str:
    """Hash a password using SHA-256 (placeholder; use bcrypt in production)."""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user account."""
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=_hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse)
async def login_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """Placeholder login: verifies that the email exists and returns the user."""
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Query(...), db: AsyncSession = Depends(get_db)):
    """Placeholder: return user by id from query param."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
