#!/usr/bin/env python3
"""Generate legal/compliance documents via Gemini API."""

import httpx
import time
import os
from datetime import datetime

API_KEY = "AIzaSyABiqTWh-I4QqcdXtaz6SimLDgOLiaDM_c"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
BASE = "/Users/petermarggraff/AI-projekte/crypto_inheritance_ai_lab"
TODAY = "2026-03-17"

DOCUMENTS = [
    {
        "path": "reports/regulatory_landscape.md",
        "prompt": """Create a regulatory landscape analysis for LegacyGuard, a non-custodial crypto inheritance protocol.

## Jurisdictional Analysis

### United States
- Federal: SEC/CFTC custody rules, FinCEN money transmission
- State: Wyoming DAO LLC, Delaware trust law, NY BitLicense
- RUFADAA (Uniform Fiduciary Access to Digital Assets Act)
- Non-custodial exemption analysis

### European Union
- MiCA regulation: custody vs non-custody classification
- GDPR: right to deletion vs inheritance data retention
- Individual country variations

### Switzerland
- FINMA DLT Act, crypto-friendly regulatory framework
- Foundation structure for protocol entities

### Singapore
- MAS Payment Services Act
- Digital token classification

## Key Regulatory Questions
| Question | US Answer | EU Answer | CH Answer | SG Answer |

## Non-Custodial Classification Analysis
Why LegacyGuard is NOT a custodian: technical proof, legal reasoning.

## Recommended Launch Jurisdiction
Best place to incorporate and launch first, with reasoning.

## Licensing Requirements Summary
What licenses are needed (if any) in each jurisdiction.

## Risks & Mitigations
| Risk | Jurisdiction | Likelihood | Mitigation |"""
    },
    {
        "path": "legal/terms_of_service.md",
        "prompt": """Draft Terms of Service for LegacyGuard, a non-custodial crypto inheritance protocol and infrastructure layer. Use professional legal language but keep it readable.

# LegacyGuard Terms of Service
Effective Date: [Date]

Include these sections:
1. Acceptance of Terms
2. Service Description (non-custodial inheritance protocol, key splitting, dead man's switch)
3. User Eligibility (18+, legal capacity)
4. Account Registration and Security
5. Non-Custodial Architecture (LegacyGuard does NOT hold, control, or have access to user assets)
6. User Responsibilities (key security, heir selection, check-in compliance)
7. Heir Designation and Recovery (user acknowledges risks of incorrect heir setup)
8. API and Partner Usage (terms for B2B partners using the API)
9. Fees and Payment
10. Disclaimers (no financial/legal/tax advice, no guarantee of asset recovery)
11. Limitation of Liability (cap at fees paid in last 12 months)
12. Intellectual Property
13. Data Protection (reference to Privacy Policy)
14. Termination
15. Governing Law (suggest Delaware or Switzerland)
16. Dispute Resolution (arbitration clause)
17. Changes to Terms
18. Contact Information

Be thorough but not excessively long. ~3000-4000 words."""
    },
    {
        "path": "legal/privacy_policy.md",
        "prompt": """Draft a Privacy Policy for LegacyGuard, a non-custodial crypto inheritance protocol.

# LegacyGuard Privacy Policy
Effective Date: [Date]

Include:
1. Introduction and scope
2. Data controller identity
3. Data collected:
   - Account data (email, hashed password)
   - Heir data (name, email, relationship — encrypted at rest)
   - Plan data (trigger settings, check-in history)
   - Usage data (IP, device, browser)
   - What we do NOT collect (private keys, seed phrases, wallet contents)
4. How data is used
5. Legal bases for processing (GDPR Article 6)
6. Data sharing (only with designated heirs upon trigger, partners only receive anonymized metadata)
7. Data security measures (AES-256-GCM, TLS 1.3, SOC 2 roadmap)
8. Data retention (active accounts: indefinite, deleted accounts: 30 days, legal hold exceptions)
9. International data transfers
10. User rights (GDPR: access, rectification, erasure, portability, objection)
11. CCPA rights (California residents)
12. Children's privacy (not for under 18)
13. Cookie policy
14. Changes to policy
15. Contact and DPO

~2500-3500 words."""
    },
    {
        "path": "reports/legal_architecture.md",
        "prompt": """Create a Legal Architecture Memo for LegacyGuard.

# Legal Architecture Memo: LegacyGuard

## Recommended Entity Structure
- Protocol Company (Foundation in Switzerland or Cayman)
- Operating Company (Delaware C-Corp or Swiss GmbH)
- Why separate entities protect the protocol

## Non-Custodial Classification Defense
Technical arguments:
- Shamir 2-of-3: LG holds max 1 shard (insufficient alone)
- Client-side key generation
- Zero-knowledge vault design
- No access to user assets at any point

Legal arguments:
- Does not meet SEC/MiCA custody definitions
- Software provider, not financial service
- Infrastructure layer, not asset manager

## Compliance Roadmap
| Milestone | Timeline | Cost Estimate |
- SOC 2 Type I certification
- ISO 27001
- External security audit (Trail of Bits, OpenZeppelin)
- Penetration testing
- Bug bounty program

## Insurance Considerations
- Crypto insurance for operational risks
- E&O insurance
- Cyber liability insurance

## Regulatory Risk Matrix
| Scenario | Probability | Impact | Mitigation |"""
    },
    {
        "path": "reports/compliance_checklist.md",
        "prompt": """Create a compliance checklist for LegacyGuard.

# LegacyGuard Compliance Checklist

## Per User Story Compliance Touchpoints

### Onboarding
| Step | Regulatory Touchpoint | Requirement | Status |
- Email verification
- Age confirmation (18+)
- ToS acceptance
- Privacy policy consent
- Jurisdiction check

### Plan Creation
| Step | Touchpoint | Requirement | Status |
- Data encryption
- Heir consent notification
- Non-custodial confirmation

### Heir Invitation
| Step | Touchpoint | Requirement | Status |
- Email notification (CAN-SPAM, GDPR consent)
- Identity verification readiness
- Data minimization

### Trigger & Recovery
| Step | Touchpoint | Requirement | Status |
- Safety period enforcement
- Multi-factor verification
- Audit trail generation

## KYC/AML Policy
- MVP: No KYC for basic users (non-custodial exemption)
- B2B Partners: Business verification required
- Family Office: Enhanced due diligence
- High-value triggers: Optional KYC for regulatory comfort

## Data Protection Checklist
- Encryption at rest ✓
- Encryption in transit ✓
- Access controls
- Audit logging
- Breach notification plan
- DPO appointment
- DPIA (Data Protection Impact Assessment)

## Recommended External Counsel
| Specialization | Why Needed | When to Engage |
- Crypto regulatory counsel
- Estate and trust law
- Data protection / GDPR
- Corporate structuring
- Insurance broker"""
    },
]


def generate_document(doc, index):
    """Call Gemini API and save the result."""
    print(f"\n[{index+1}/5] Generating: {doc['path']}")

    payload = {
        "contents": [{"parts": [{"text": doc["prompt"]}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
        }
    }

    with httpx.Client(timeout=120.0) as client:
        resp = client.post(URL, json=payload)

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:500]}")
        return False

    data = resp.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        print(f"  ERROR parsing response: {e}")
        print(f"  Response: {str(data)[:500]}")
        return False

    header = f"<!-- Generated by Gemini API on {TODAY} -->\n<!-- LegacyGuard - Crypto Inheritance Protocol -->\n\n"

    filepath = os.path.join(BASE, doc["path"])
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w") as f:
        f.write(header + text)

    word_count = len(text.split())
    print(f"  Saved: {filepath} ({word_count} words)")
    return True


def main():
    print("=" * 60)
    print("LegacyGuard Legal Document Generator")
    print(f"Date: {TODAY}")
    print("=" * 60)

    success = 0
    for i, doc in enumerate(DOCUMENTS):
        if i > 0:
            print(f"  Waiting 10 seconds before next call...")
            time.sleep(10)
        if generate_document(doc, i):
            success += 1

    print(f"\n{'=' * 60}")
    print(f"Done: {success}/5 documents generated successfully.")
    print("=" * 60)


if __name__ == "__main__":
    main()
