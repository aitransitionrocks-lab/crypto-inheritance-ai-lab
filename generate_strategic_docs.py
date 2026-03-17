"""Generate 3 strategic documents via Gemini REST API using httpx."""

import httpx
import time
import json
from pathlib import Path

API_KEY = "AIzaSyABiqTWh-I4QqcdXtaz6SimLDgOLiaDM_c"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
REPORTS_DIR = Path("/Users/petermarggraff/AI-projekte/crypto_inheritance_ai_lab/reports")
GENERATION_DATE = "2026-03-17"

DOCUMENTS = [
    {
        "filename": "partner_prioritization_matrix.md",
        "title": "Partner Prioritization Matrix",
        "system": "You are a B2B partnerships strategist for LegacyGuard, a crypto inheritance protocol.",
        "prompt": """Create a partner prioritization analysis for LegacyGuard.

## Partner Categories Analysis

For EACH of these 8 categories, provide detailed analysis:

1. Hardware Wallets (Ledger, Trezor, Keystone)
2. Software Wallets (MetaMask, Trust Wallet, Phantom, Exodus)
3. Multisig Providers (Gnosis Safe, Unchained, Nunchuk)
4. Custody Providers (Fireblocks, BitGo, Anchorage)
5. Exchanges (Coinbase, Kraken, Binance)
6. Family Offices
7. Estate Planners & Legal-Tech (Trust & Will, Willful)
8. Wealth Management Platforms

For each category:
- Value proposition (why they integrate LegacyGuard)
- Potential resistance (what blocks adoption)
- Integration path (API, SDK, plugin, white-label)
- Commercial model (licensing, rev share, per-activation)
- Technical requirements
- Trust & compliance requirements
- Timeline estimate

## Prioritization Matrix
| Category | Impact (1-10) | Ease (1-10) | Speed (1-10) | Revenue (1-10) | Strategic (1-10) | Total | Rank |

## Top 5 Priority Partners
For each: specific target company, first outreach action, pilot offer.

## Partnership Roadmap (12 months)
Quarter by quarter plan.""",
    },
    {
        "filename": "developer_portal.md",
        "title": "Developer Portal Documentation",
        "system": "You are a developer relations lead for LegacyGuard crypto inheritance API.",
        "prompt": """Create complete developer portal documentation.

# LegacyGuard Developer Portal

## Overview
What the API does, non-custodial architecture, why developers integrate.

## Quick Start (5 minutes)
Step-by-step with code examples in Python AND Node.js:
1. Get API key
2. Create a plan
3. Add heirs
4. Configure trigger
5. Check in

Include full curl, Python (requests), and Node.js (fetch) examples for each step.

## Authentication
- API key acquisition
- Request headers (Authorization: Bearer <key>)
- Rate limits (100 req/min free, 1000 req/min pro)

## API Reference
For each endpoint, provide: method, path, description, request body, response, error codes.

### Plans API
- POST /v1/partners/plans - Create plan
- GET /v1/partners/plans - List plans
- GET /v1/partners/plans/{id} - Get plan
- PUT /v1/partners/plans/{id} - Update plan

### Heirs API
- POST /v1/partners/plans/{id}/heirs - Add heir
- DELETE /v1/partners/plans/{id}/heirs/{heir_id} - Remove heir

### Triggers API
- POST /v1/partners/plans/{id}/checkin - Check in
- GET /v1/partners/plans/{id}/trigger - Get status

### Webhooks
- Plan created, heir added, check-in recorded, trigger activated, recovery initiated
- Webhook payload format, signature verification

## SDKs
- Python SDK (pip install legacyguard)
- Node.js SDK (npm install @legacyguard/sdk)
- Both with example usage

## Sandbox
- Test API key generation
- Mock data and simulated triggers
- Test heir claim flow

## Security Best Practices
- Never log shard values
- Use HTTPS only
- Validate webhook signatures

## Terms & Policies
- Link to Terms of Service (/legal/terms-of-service)
- Link to Privacy Policy (/legal/privacy-policy)
- Rate limit policy
- Data handling commitments""",
    },
    {
        "filename": "partner_integration_guide.md",
        "title": "Partner Integration Guide",
        "system": "You are a technical integration architect for LegacyGuard.",
        "prompt": """Create a step-by-step partner integration guide.

# LegacyGuard Partner Integration Guide

## Architecture Overview
- Diagram description: Partner App → LegacyGuard API → User's Device
- Non-custodial flow: keys split client-side, only metadata goes to API
- What data the partner sends vs what stays local

## Integration Types
### Type A: API Integration (simplest)
### Type B: SDK Embed (recommended)
### Type C: White-Label (deepest)

For each type: effort, timeline, customization level, example code.

## Step-by-Step Integration

### Step 1: Register as Partner
### Step 2: Get API Credentials
### Step 3: Implement Vault Setup Flow
- Code example: Generate key client-side, split with SSS, send metadata to API
### Step 4: Implement Heir Management
### Step 5: Implement Trigger Configuration
### Step 6: Implement Check-in Flow
### Step 7: Handle Webhooks
### Step 8: Test in Sandbox
### Step 9: Security Review Checklist
### Step 10: Go Live

## Trust Signals for Partner UI
- 'Powered by LegacyGuard' badge
- Non-custodial proof messaging
- Shard visualization component (embeddable)

## Technical Requirements
- HTTPS, TLS 1.3
- Webhook endpoint for events
- Client-side key generation capability

## Compliance Requirements
- Non-custodial architecture proof
- Security audit (annual)
- Data processing agreement""",
    },
]


def call_gemini(system_instruction: str, prompt: str) -> str:
    """Call Gemini API and return the text response."""
    payload = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 12000,
        },
    }

    headers = {"Content-Type": "application/json"}

    with httpx.Client(timeout=120.0) as client:
        response = client.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

    # Extract text from response
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError(f"No candidates in response: {json.dumps(data, indent=2)}")

    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts)
    return text


def main():
    for i, doc in enumerate(DOCUMENTS):
        print(f"\n{'='*60}")
        print(f"Generating document {i+1}/3: {doc['title']}")
        print(f"{'='*60}")

        try:
            content = call_gemini(doc["system"], doc["prompt"])

            # Add header with title and generation date
            header = f"# {doc['title']}\n\n**Generated:** {GENERATION_DATE}\n\n---\n\n"
            full_content = header + content

            output_path = REPORTS_DIR / doc["filename"]
            output_path.write_text(full_content, encoding="utf-8")
            print(f"Saved to: {output_path}")
            print(f"Size: {len(full_content):,} characters")

        except Exception as e:
            print(f"ERROR generating {doc['filename']}: {e}")

        # Wait 10 seconds between calls (skip after last)
        if i < len(DOCUMENTS) - 1:
            print("Waiting 10 seconds for rate limiting...")
            time.sleep(10)

    print(f"\n{'='*60}")
    print("All documents generated.")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
