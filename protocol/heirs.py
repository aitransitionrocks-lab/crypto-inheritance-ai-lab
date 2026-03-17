"""
LegacyGuard Heir Management & Recovery Flows
=============================================

Manages heirs, shard assignments, and the inheritance recovery process.

Key design principles:
    - Non-custodial: LegacyGuard never holds enough shards to reconstruct
    - Verifiable: Every heir must pass identity verification before receiving shards
    - Revocable: Owner can add/remove heirs at any time (with cool-down period)
    - Auditable: All changes are logged for legal compliance

Recovery flow:
    1. DeadManSwitch triggers → safety period starts
    2. Heirs are notified
    3. Each heir verifies identity (ID check, security questions)
    4. After safety period, verified heirs receive their assigned shards
    5. Heirs combine shards to reconstruct master key
    6. Master key decrypts inheritance instructions
    7. Heirs follow instructions to access assets
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from protocol.crypto_core import KeyShard, reconstruct_key, decrypt_data

logger = logging.getLogger(__name__)


class VerificationStatus(Enum):
    """Heir identity verification states."""
    PENDING = "pending"         # Invited, not yet verified
    VERIFIED = "verified"       # Identity confirmed
    REJECTED = "rejected"       # Verification failed
    REVOKED = "revoked"         # Access removed by owner


class RecoveryStatus(Enum):
    """Status of a recovery process."""
    INITIATED = "initiated"     # Trigger fired, heirs notified
    VERIFYING = "verifying"     # Heirs undergoing identity verification
    ASSEMBLING = "assembling"   # Shards being combined
    COMPLETED = "completed"     # Recovery instructions delivered
    FAILED = "failed"           # Recovery could not be completed
    CANCELLED = "cancelled"     # Owner cancelled


@dataclass
class Heir:
    """
    Represents a designated heir in an inheritance plan.

    Attributes:
        name: Full legal name of the heir.
        email: Primary contact email.
        relationship: Relationship to the owner (e.g., "spouse", "child", "sibling").
        verification_status: Current identity verification state.
        assigned_shard: The key shard assigned to this heir (set during plan creation).
        verified_at: When identity was last verified.
        notes: Owner's private notes about this heir.
    """

    name: str
    email: str
    relationship: str
    verification_status: VerificationStatus = VerificationStatus.PENDING
    assigned_shard: Optional[KeyShard] = None
    verified_at: Optional[datetime] = None
    notes: str = ""
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def is_verified(self) -> bool:
        return self.verification_status == VerificationStatus.VERIFIED

    def verify(self) -> None:
        """Mark heir as identity-verified."""
        self.verification_status = VerificationStatus.VERIFIED
        self.verified_at = datetime.now(timezone.utc)
        logger.info("Heir '%s' verified at %s", self.name, self.verified_at.isoformat())

    def reject(self) -> None:
        """Reject heir's identity verification."""
        self.verification_status = VerificationStatus.REJECTED
        logger.warning("Heir '%s' verification REJECTED", self.name)

    def revoke(self) -> None:
        """Revoke heir's access (owner action)."""
        self.verification_status = VerificationStatus.REVOKED
        self.assigned_shard = None
        logger.info("Heir '%s' access REVOKED", self.name)


@dataclass
class InheritancePlan:
    """
    An inheritance plan linking an owner's vault to designated heirs.

    Attributes:
        plan_id: Unique identifier.
        owner_name: Name of the asset owner.
        heirs: List of designated heirs.
        threshold: Minimum shards needed for reconstruction (default: 2).
        total_shares: Total shards generated (default: 3).
        encrypted_instructions: The encrypted inheritance instructions.
        trigger_policy: Reference to the associated DeadManSwitch config.
    """

    plan_id: str
    owner_name: str
    heirs: List[Heir] = field(default_factory=list)
    threshold: int = 2
    total_shares: int = 3
    encrypted_instructions: Optional[bytes] = None
    trigger_policy: Optional[str] = None  # DeadManSwitch plan_id
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    # ------------------------------------------------------------------ heirs
    def add_heir(self, heir: Heir) -> None:
        """Add a new heir to the plan."""
        if any(h.email == heir.email for h in self.heirs):
            raise ValueError(f"Heir with email {heir.email} already exists")
        self.heirs.append(heir)
        self.updated_at = datetime.now(timezone.utc)
        logger.info("[%s] Heir added: %s (%s)", self.plan_id, heir.name, heir.relationship)

    def remove_heir(self, email: str) -> bool:
        """Remove an heir by email. Returns True if found and removed."""
        for i, heir in enumerate(self.heirs):
            if heir.email == email:
                heir.revoke()
                self.heirs.pop(i)
                self.updated_at = datetime.now(timezone.utc)
                logger.info("[%s] Heir removed: %s", self.plan_id, email)
                return True
        return False

    def assign_shards(self, shards: List[KeyShard]) -> None:
        """
        Assign key shards to heirs.

        The owner typically keeps shard 1, and shards 2+ are distributed
        to heirs and the LegacyGuard vault. Exact assignment depends on
        the plan configuration.
        """
        # Shard 1 → owner (not assigned to heir)
        # Remaining shards → heirs (round-robin if more heirs than shards)
        heir_shards = shards[1:]  # Skip shard 1 (owner keeps it)
        for i, heir in enumerate(self.heirs):
            if i < len(heir_shards):
                heir.assigned_shard = heir_shards[i]
                logger.info(
                    "[%s] Shard %d assigned to heir '%s'",
                    self.plan_id, heir_shards[i].index, heir.name,
                )

        self.updated_at = datetime.now(timezone.utc)

    def get_verified_heirs(self) -> List[Heir]:
        """Return only heirs who have completed identity verification."""
        return [h for h in self.heirs if h.is_verified]

    # ------------------------------------------------------------------ recovery
    def initiate_recovery(self) -> RecoveryResult:
        """
        Initiate the inheritance recovery process.

        Called when the DeadManSwitch trigger is executed (after safety period).
        Coordinates shard collection from verified heirs and attempts key reconstruction.

        Returns:
            RecoveryResult with status and details.
        """
        logger.warning("[%s] RECOVERY INITIATED for owner '%s'", self.plan_id, self.owner_name)

        verified_heirs = self.get_verified_heirs()
        if not verified_heirs:
            logger.error("[%s] No verified heirs — recovery cannot proceed", self.plan_id)
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message="No verified heirs available for recovery.",
            )

        # Collect shards from verified heirs
        available_shards = [
            h.assigned_shard for h in verified_heirs
            if h.assigned_shard is not None
        ]

        if len(available_shards) < self.threshold - 1:
            # Need threshold total, heir shards + owner shard = threshold
            logger.error(
                "[%s] Insufficient shards: %d available, %d needed (threshold=%d)",
                self.plan_id, len(available_shards), self.threshold - 1, self.threshold,
            )
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message=f"Insufficient verified shards ({len(available_shards)}) "
                        f"for threshold ({self.threshold}).",
            )

        logger.info(
            "[%s] %d shards collected from verified heirs. "
            "Ready for key reconstruction when owner's shard is provided.",
            self.plan_id, len(available_shards),
        )

        # NOTE: In production, heirs would each submit their shard independently.
        # The system would assemble them only when threshold is met.
        # For now, we log the recovery steps.

        return RecoveryResult(
            status=RecoveryStatus.ASSEMBLING,
            message=f"Recovery in progress. {len(available_shards)} heir shards collected. "
                    f"Awaiting shard assembly ({self.threshold} of {self.total_shares} needed).",
            collected_shards=available_shards,
            verified_heir_count=len(verified_heirs),
        )

    def complete_recovery(
        self, all_shards: List[KeyShard]
    ) -> RecoveryResult:
        """
        Complete recovery by reconstructing the key and decrypting instructions.

        Args:
            all_shards: At least `threshold` shards (from heirs + owner's device).

        Returns:
            RecoveryResult with decrypted instructions if successful.
        """
        if len(all_shards) < self.threshold:
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message=f"Need {self.threshold} shards, got {len(all_shards)}.",
            )

        try:
            master_key = reconstruct_key(all_shards[:self.threshold])
        except Exception as exc:
            logger.error("[%s] Key reconstruction failed: %s", self.plan_id, exc)
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message=f"Key reconstruction failed: {exc}",
            )

        if self.encrypted_instructions is None:
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message="No encrypted instructions found in plan.",
            )

        try:
            instructions = decrypt_data(self.encrypted_instructions, master_key)
            logger.info("[%s] Recovery COMPLETED — instructions decrypted", self.plan_id)
            return RecoveryResult(
                status=RecoveryStatus.COMPLETED,
                message="Recovery successful. Instructions decrypted.",
                decrypted_instructions=instructions.decode("utf-8"),
            )
        except Exception as exc:
            logger.error("[%s] Decryption failed: %s", self.plan_id, exc)
            return RecoveryResult(
                status=RecoveryStatus.FAILED,
                message=f"Decryption failed — wrong key or corrupted data: {exc}",
            )


@dataclass
class RecoveryResult:
    """Result of a recovery attempt."""
    status: RecoveryStatus
    message: str
    collected_shards: List[KeyShard] = field(default_factory=list)
    verified_heir_count: int = 0
    decrypted_instructions: Optional[str] = None
