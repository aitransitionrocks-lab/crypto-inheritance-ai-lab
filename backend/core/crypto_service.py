"""
Crypto service layer wrapping protocol/crypto_core.

Shard values are generated client-side and distributed directly.
The server never sees all shards.
"""

from __future__ import annotations

import sys
import os
from typing import Dict, List, Optional

# Ensure the project root is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from protocol.crypto_core import generate_key, split_key  # noqa: E402


def generate_vault_key() -> str:
    """
    Generate a new 256-bit vault key.

    Returns:
        The key as a hex-encoded string (suitable for transport).
    """
    key_bytes = generate_key()
    return key_bytes.hex()


def split_vault_key(
    key_hex: str,
    threshold: int = 2,
    shares: int = 3,
    labels: Optional[List[str]] = None,
) -> List[Dict[str, object]]:
    """
    Split a vault key into shards using Shamir's Secret Sharing.

    Only shard *metadata* (index + label) is returned.  The actual shard
    values are generated client-side and distributed directly to the
    intended recipients.  The server never sees all shards.

    Args:
        key_hex: Hex-encoded 256-bit key.
        threshold: Minimum shards for reconstruction.
        shares: Total number of shards.
        labels: Human-readable labels for each shard.

    Returns:
        A list of dicts with ``index`` and ``label`` keys.
    """
    key_bytes = bytes.fromhex(key_hex)
    shards = split_key(key_bytes, threshold=threshold, num_shares=shares, labels=labels)
    # Return metadata only; shard values stay client-side.
    return [{"index": s.index, "label": s.label} for s in shards]
