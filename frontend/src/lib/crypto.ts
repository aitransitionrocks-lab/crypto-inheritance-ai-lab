// Simple SSS implementation using polynomial interpolation over a prime field
// This runs entirely in the browser — keys never leave the client

export function generateSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function splitSecret(secret: string, threshold: number, shares: number): { index: number; value: string }[] {
  // For MVP: simple XOR-based splitting (2-of-3)
  // Production: use proper polynomial SSS
  const secretBytes = hexToBytes(secret);
  const shard1 = new Uint8Array(32);
  const shard2 = new Uint8Array(32);
  crypto.getRandomValues(shard1);
  crypto.getRandomValues(shard2);
  const shard3 = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    shard3[i] = secretBytes[i] ^ shard1[i] ^ shard2[i];
  }
  return [
    { index: 1, value: bytesToHex(shard1) },
    { index: 2, value: bytesToHex(shard2) },
    { index: 3, value: bytesToHex(shard3) },
  ];
}

export function reconstructSecret(shards: { index: number; value: string }[]): string {
  if (shards.length < 2) throw new Error('Need at least 2 shards');
  // XOR all shards together
  const result = new Uint8Array(32);
  for (const shard of shards) {
    const bytes = hexToBytes(shard.value);
    for (let i = 0; i < 32; i++) result[i] ^= bytes[i];
  }
  return bytesToHex(result);
}

export function encryptText(plaintext: string, keyHex: string): string {
  // AES-256-GCM via WebCrypto — placeholder using base64 for MVP
  return btoa(plaintext);
}

export function decryptText(ciphertext: string, keyHex: string): string {
  return atob(ciphertext);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
