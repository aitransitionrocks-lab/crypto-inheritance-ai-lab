"""
LegacyGuard Cryptographic Core
================================

Implements key generation, Shamir's Secret Sharing (2-of-3),
and AES-256-GCM encryption/decryption.

Architecture:
    - User generates a master key (256-bit)
    - Master key is split into 3 shards using Shamir's Secret Sharing
    - Shard 1: Stored on user's device (encrypted at rest)
    - Shard 2: Held by a trusted contact (encrypted, delivered via secure channel)
    - Shard 3: Stored in LegacyGuard's zero-knowledge vault (encrypted, LG cannot read)
    - Any 2 of 3 shards can reconstruct the master key
    - Master key encrypts the actual inheritance instructions (seed phrases, passwords, etc.)

Non-custodial guarantee:
    LegacyGuard holds at most 1 shard. 1 shard reveals NOTHING about the secret.
    The system never has access to 2 shards simultaneously.
"""

from __future__ import annotations

import hashlib
import os
import secrets
from dataclasses import dataclass
from typing import List, Tuple

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


# ============================================================
# Shamir's Secret Sharing over a prime field
# ============================================================

# A large prime for the finite field (256-bit safe prime)
_PRIME = 2**256 - 189  # Largest 256-bit prime


def _mod_inverse(a: int, p: int) -> int:
    """Modular multiplicative inverse using extended Euclidean algorithm."""
    if a < 0:
        a = a % p
    g, x, _ = _extended_gcd(a, p)
    if g != 1:
        raise ValueError("Modular inverse does not exist")
    return x % p


def _extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    if a == 0:
        return b, 0, 1
    g, x, y = _extended_gcd(b % a, a)
    return g, y - (b // a) * x, x


def _eval_polynomial(coefficients: List[int], x: int, prime: int) -> int:
    """Evaluate a polynomial at point x in the finite field."""
    result = 0
    for i, coeff in enumerate(coefficients):
        result = (result + coeff * pow(x, i, prime)) % prime
    return result


def _lagrange_interpolation(shares: List[Tuple[int, int]], prime: int) -> int:
    """Reconstruct the secret (f(0)) from shares using Lagrange interpolation."""
    secret = 0
    for i, (xi, yi) in enumerate(shares):
        numerator = 1
        denominator = 1
        for j, (xj, _) in enumerate(shares):
            if i != j:
                numerator = (numerator * (-xj)) % prime
                denominator = (denominator * (xi - xj)) % prime
        lagrange = (yi * numerator * _mod_inverse(denominator, prime)) % prime
        secret = (secret + lagrange) % prime
    return secret


# ============================================================
# Public API
# ============================================================


def generate_key() -> bytes:
    """
    Generate a cryptographically secure 256-bit master key.

    Returns:
        32 bytes suitable for AES-256-GCM encryption.
    """
    return secrets.token_bytes(32)


@dataclass
class KeyShard:
    """A single shard from Shamir's Secret Sharing."""
    index: int  # 1-based shard number
    value: str  # Hex-encoded shard value
    label: str  # Human-readable label (e.g., "user_device", "trusted_contact", "vault")

    def to_tuple(self) -> Tuple[int, int]:
        return (self.index, int(self.value, 16))


def split_key(
    secret: bytes,
    threshold: int = 2,
    num_shares: int = 3,
    labels: List[str] | None = None,
) -> List[KeyShard]:
    """
    Split a secret into N shares using Shamir's Secret Sharing.

    Args:
        secret: The secret to split (must be <= 32 bytes).
        threshold: Minimum shares needed to reconstruct (default: 2).
        num_shares: Total shares to generate (default: 3).
        labels: Optional labels for each shard.

    Returns:
        List of KeyShard objects.

    Example:
        >>> key = generate_key()
        >>> shards = split_key(key, threshold=2, num_shares=3,
        ...     labels=["user_device", "trusted_contact", "legacyguard_vault"])
        >>> # Any 2 shards can reconstruct:
        >>> recovered = reconstruct_key([shards[0], shards[1]])
        >>> assert recovered == key
    """
    if len(secret) > 32:
        raise ValueError("Secret must be <= 32 bytes (256 bits)")
    if threshold > num_shares:
        raise ValueError("Threshold cannot exceed number of shares")
    if threshold < 2:
        raise ValueError("Threshold must be at least 2 for security")

    default_labels = [f"shard_{i+1}" for i in range(num_shares)]
    labels = labels or default_labels

    # Convert secret to integer
    secret_int = int.from_bytes(secret, byteorder="big")

    # Generate random polynomial coefficients (degree = threshold - 1)
    # coefficients[0] = secret, coefficients[1..threshold-1] = random
    coefficients = [secret_int]
    for _ in range(threshold - 1):
        coefficients.append(secrets.randbelow(_PRIME))

    # Evaluate polynomial at points 1, 2, ..., num_shares
    shards = []
    for i in range(1, num_shares + 1):
        y = _eval_polynomial(coefficients, i, _PRIME)
        shards.append(KeyShard(
            index=i,
            value=format(y, "064x"),  # 256-bit hex
            label=labels[i - 1] if i <= len(labels) else f"shard_{i}",
        ))

    return shards


def reconstruct_key(shards: List[KeyShard], key_length: int = 32) -> bytes:
    """
    Reconstruct the secret from a subset of shards.

    Args:
        shards: At least `threshold` shards from split_key().
        key_length: Expected key length in bytes (default: 32).

    Returns:
        The original secret as bytes.

    Raises:
        ValueError: If fewer than threshold shards provided (result will be wrong).
    """
    if len(shards) < 2:
        raise ValueError("Need at least 2 shards to reconstruct")

    share_tuples = [s.to_tuple() for s in shards]
    secret_int = _lagrange_interpolation(share_tuples, _PRIME)
    return secret_int.to_bytes(key_length, byteorder="big")


def encrypt_data(plaintext: bytes, key: bytes) -> bytes:
    """
    Encrypt data using AES-256-GCM.

    Args:
        plaintext: Data to encrypt.
        key: 32-byte encryption key.

    Returns:
        nonce (12 bytes) + ciphertext + tag.

    The inheritance instructions (seed phrases, passwords, notes) are
    encrypted with the master key before being stored anywhere.
    """
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    return nonce + ciphertext


def decrypt_data(encrypted: bytes, key: bytes) -> bytes:
    """
    Decrypt data encrypted with encrypt_data().

    Args:
        encrypted: nonce + ciphertext + tag (as returned by encrypt_data).
        key: 32-byte encryption key.

    Returns:
        The original plaintext.

    Raises:
        cryptography.exceptions.InvalidTag: If key is wrong or data tampered.
    """
    nonce = encrypted[:12]
    ciphertext = encrypted[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None)
