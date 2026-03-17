"""LegacyGuard Protocol — cryptographic core, triggers, and heir management."""

from protocol.crypto_core import generate_key, split_key, reconstruct_key, encrypt_data, decrypt_data
from protocol.triggers import DeadManSwitch
from protocol.heirs import Heir, InheritancePlan

__all__ = [
    "generate_key", "split_key", "reconstruct_key", "encrypt_data", "decrypt_data",
    "DeadManSwitch", "Heir", "InheritancePlan",
]
