#!/usr/bin/env python3
"""Fix weak research sections by re-generating them directly via Gemini."""

from __future__ import annotations

import asyncio
import logging
import sys
import time
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config.settings import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s │ %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger(__name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

IDEA = (
    "LegacyGuard: Crypto Inheritance Protocol and Security Infrastructure Layer — "
    "A secure inheritance protocol for digital assets that enables wallets, custody solutions, "
    "multisig systems, family offices, and estate-planning stakeholders to support compliant, "
    "privacy-preserving, verifiable inheritance workflows."
)


async def call_gemini(system: str, prompt: str, context: str = "") -> str:
    url = GEMINI_URL.format(model=settings.model_name)
    full = f"Context:\n{context[:60000]}\n\n---\n\n{prompt}" if context else prompt
    payload = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": full}]}],
        "generationConfig": {"maxOutputTokens": 8192, "temperature": 0.3},
    }
    for attempt in range(8):
        async with httpx.AsyncClient(timeout=180) as client:
            resp = await client.post(url, params={"key": settings.gemini_api_key}, json=payload)
        if resp.status_code == 429:
            wait = min(2 ** attempt + 1, 120)
            logger.warning("Rate limited, waiting %ds (attempt %d)", wait, attempt + 1)
            await asyncio.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        candidates = data.get("candidates", [])
        if candidates:
            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if text:
                return text
        await asyncio.sleep(2)
    raise RuntimeError("Gemini failed after 8 retries")


SECTIONS = [
    {
        "name": "Market Opportunity (Deep)",
        "system": (
            "You are a market sizing analyst for LegacyGuard. You estimate markets using "
            "rigorous top-down and bottom-up approaches across consumer, B2B infrastructure, "
            "family office, and estate planning segments. Show methodology and assumptions."
        ),
        "prompt": (
            f"For: {IDEA}\n\n"
            "Create an investor-grade market opportunity analysis.\n\n"
            "## 1. Problem Scale\n"
            "- Estimated total crypto permanently lost to death/incapacity ($ and BTC)\n"
            "- Annual growth rate of the problem\n"
            "- Why this accelerates with institutional adoption\n\n"
            "## 2. Consumer Inheritance Market\n"
            "- TAM: All crypto holders globally (580M+) who could need inheritance\n"
            "- SAM: Self-custody users in US/EU/UK with >$10K crypto (~15-30M)\n"
            "- SOM: Realistic 3-year capture at $99-299/year subscription\n"
            "- Willingness to pay analysis: What triggers purchase?\n\n"
            "## 3. B2B Infrastructure / API Market\n"
            "- TAM: All wallet/custody providers globally (~500+ companies)\n"
            "- SAM: Mid-to-large providers needing inheritance features (~100-200)\n"
            "- SOM: Realistic 3-year partnerships at $50K-500K/year\n"
            "- Why wallet companies want this (user retention, compliance, differentiation)\n\n"
            "## 4. Family Office / HNWI Market\n"
            "- TAM: Family offices with crypto (est. 3,000-5,000 globally)\n"
            "- SAM: Offices with >$5M crypto needing succession (~1,000-2,000)\n"
            "- SOM: Reachable through wealth advisory channels\n"
            "- Pricing: Premium contracts $10K-100K/year\n\n"
            "## 5. Estate Planning Tech Market\n"
            "- TAM: Estate planning platforms (~$5B market)\n"
            "- SAM: Platforms lacking crypto modules\n"
            "- SOM: White-label partnerships\n\n"
            "## 6. Combined TAM/SAM/SOM Summary\n"
            "| Segment | TAM | SAM | SOM (3yr) | Revenue Model | Confidence |\n\n"
            "## 7. Adoption Triggers\n"
            "What makes people/companies actually buy? (Death events in news, regulatory "
            "pressure, insurance requirements, partner integration, aging crypto-native population)\n\n"
            "## 8. Market Timing\n"
            "Is this too early, just right, or late? Evidence for each position.\n\n"
            "## 9. Comparable Funded Companies\n"
            "Which funded startups validate adjacent market demand?\n\n"
            "Use real data where available. Show calculations. Mark estimates clearly."
        ),
    },
    {
        "name": "Go-To-Market Strategy (Deep)",
        "system": (
            "You are a GTM strategist for LegacyGuard, a crypto inheritance protocol and "
            "infrastructure layer. You design realistic, founder-executable go-to-market plans "
            "for both B2B infrastructure and B2C consumer channels."
        ),
        "prompt": (
            f"For: {IDEA}\n\n"
            "Create a comprehensive, actionable GTM strategy.\n\n"
            "## 1. Strategic GTM Decision\n"
            "Compare three GTM approaches and recommend one:\n"
            "| Approach | Pros | Cons | Speed | Revenue | Defensibility |\n"
            "- B2C Direct (consumer app)\n"
            "- B2B Infrastructure (sell to wallet/custody companies)\n"
            "- B2B2C Hybrid (infrastructure distributed through partners)\n"
            "Clear recommendation with reasoning.\n\n"
            "## 2. Primary Entry Wedge\n"
            "The single best first move. Why this specific wedge beats alternatives.\n\n"
            "## 3. Target Customer Prioritization\n"
            "| Segment | Pain Level | WTP | Reachability | Deal Size | Priority |\n"
            "Rank: Retail HODLers, HNWIs, Family offices, Wallet providers, "
            "Custody platforms, Multisig users, Estate planners\n\n"
            "## 4. Partnership-First Distribution\n"
            "Top 5 partnership targets with specific company names:\n"
            "For each: value prop to partner, integration complexity, pilot offer, timeline\n\n"
            "## 5. Trust-Building Sequence\n"
            "For crypto inheritance, trust is everything. Define the sequence:\n"
            "1. Open-source core components\n"
            "2. Security audit (which firms, estimated cost)\n"
            "3. Advisory board (what profiles needed)\n"
            "4. Insurance / guarantees\n"
            "5. Transparency reports\n\n"
            "## 6. Content & Community Strategy\n"
            "- Key narratives (lost crypto stories, regulatory pressure)\n"
            "- Content channels (crypto Twitter, YouTube, podcasts, newsletters)\n"
            "- SEO opportunities\n"
            "- Community-building approach\n\n"
            "## 7. Sales Motion\n"
            "For B2B: enterprise sales cycle, decision makers, pricing negotiation\n"
            "For B2C: self-serve funnel, conversion optimization, retention\n\n"
            "## 8. First 90-Day GTM Plan\n"
            "Week-by-week with specific actions, targets, and success criteria.\n"
            "| Week | Action | Target | Success Metric |\n\n"
            "## 9. Key Metrics & KPIs\n"
            "| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |\n\n"
            "## 10. GTM Risks & Mitigations\n"
            "| Risk | Likelihood | Impact | Mitigation |\n\n"
            "Be specific. No generic marketing advice. Name real companies, real channels."
        ),
    },
    {
        "name": "Partnership Strategy (Deep)",
        "system": (
            "You are a B2B partnerships strategist for LegacyGuard. You design integration "
            "partnerships with crypto infrastructure companies. You think from the partner's "
            "perspective: what's in it for them, what would block adoption, how to structure pilots."
        ),
        "prompt": (
            f"For: {IDEA}\n\n"
            "Create a deep, actionable partnership strategy.\n\n"
            "## Top 7 Partner Categories (Detailed Analysis)\n\n"
            "For EACH category provide:\n\n"
            "### Category: [Name]\n"
            "**Target companies**: (name 3-5 specific companies)\n"
            "**Why they care**: (specific business benefit — retention, compliance, revenue)\n"
            "**Why they may resist**: (security concerns, legal liability, priority conflicts)\n"
            "**Decision maker**: (title, typical buying process)\n"
            "**Integration path**: (API integration, SDK embed, white-label)\n"
            "**Technical requirements**: (what LegacyGuard must provide)\n"
            "**Commercial model**: (rev share, licensing, per-activation)\n"
            "**Trust requirements**: (audits, insurance, open-source, SLAs)\n"
            "**Best pilot offer**: (free period, custom dev, co-branded launch)\n"
            "**Timeline**: (weeks from outreach to live integration)\n"
            "**Risk**: (what could go wrong)\n\n"
            "Categories:\n"
            "1. Hardware Wallets (Ledger, Trezor, Keystone, Foundation)\n"
            "2. Software Wallets (MetaMask, Trust Wallet, Phantom, Exodus)\n"
            "3. Multisig Providers (Gnosis Safe, Unchained, Nunchuk)\n"
            "4. Institutional Custody (Fireblocks, BitGo, Anchorage, Copper)\n"
            "5. Exchanges (Coinbase, Kraken, Binance)\n"
            "6. Family Offices & Wealth Managers\n"
            "7. Estate Planning Platforms (Trust & Will, Willful, FreeWill)\n\n"
            "## Partnership Priority Matrix\n"
            "| Category | Impact (1-10) | Feasibility (1-10) | Speed (1-10) | "
            "Revenue (1-10) | Strategic Value (1-10) | Total | Priority Rank |\n\n"
            "## Recommended First 3 Partnerships\n"
            "Specific companies, specific outreach strategy, specific pilot design.\n\n"
            "## Outreach Templates\n"
            "3 email templates: cold outreach, warm intro, conference follow-up.\n"
            "Tailored to the #1 priority partner category.\n\n"
            "## Common Objections & Responses\n"
            "| Objection | Why They Say It | Response | Evidence |\n\n"
            "## Pilot Program Design\n"
            "- Duration: 90 days\n"
            "- Scope: what's included, what's not\n"
            "- Success criteria (quantitative)\n"
            "- What LegacyGuard provides free\n"
            "- Data to collect during pilot\n"
            "- Path from pilot to paid contract\n"
        ),
    },
]


async def main() -> None:
    # Load existing strong content as context
    blueprint = Path(settings.reports_dir) / "startup_blueprint.md"
    context = blueprint.read_text(encoding="utf-8") if blueprint.exists() else ""

    start = time.monotonic()
    results: dict[str, str] = {}

    for section in SECTIONS:
        logger.info("Generating: %s", section["name"])
        try:
            content = await call_gemini(section["system"], section["prompt"], context)
            results[section["name"]] = content
            logger.info("  ✓ %s: %d chars", section["name"], len(content))
        except Exception as exc:
            logger.error("  ✗ %s: %s", section["name"], exc)
            results[section["name"]] = ""
        await asyncio.sleep(10)  # Rate limit safety

    # Save improved sections
    reports_dir = Path(settings.reports_dir)
    for name, content in results.items():
        if not content:
            continue
        slug = name.lower().replace(" ", "_").replace("(", "").replace(")", "")
        path = reports_dir / f"improved_{slug}.md"
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        header = f"# {name}\n*Generated {now} by LegacyGuard AI Strategy Lab*\n\n---\n\n"
        path.write_text(header + content, encoding="utf-8")

    elapsed = time.monotonic() - start
    logger.info("Done in %.1fs", elapsed)
    for name, content in results.items():
        status = "✓" if content else "✗"
        print(f"  {status} {name}: {len(content):,} chars")


if __name__ == "__main__":
    asyncio.run(main())
