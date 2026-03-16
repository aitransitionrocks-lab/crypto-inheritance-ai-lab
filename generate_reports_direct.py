#!/usr/bin/env python3
"""
Direct report generator — calls Gemini directly without ChromaDB.
Uses the existing report_agent prompts but feeds context from the startup_blueprint.md.
"""

from __future__ import annotations

import asyncio
import logging
import sys
import time
from pathlib import Path

import httpx
from rich.console import Console

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))

from config.settings import settings

console = Console()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

IDEA = (
    "LegacyGuard: Crypto Inheritance Protocol and Security Infrastructure Layer — "
    "A secure inheritance protocol for digital assets that enables wallets, custody solutions, "
    "multisig systems, family offices, and estate-planning stakeholders to support compliant, "
    "privacy-preserving, verifiable inheritance workflows."
)

SYSTEM = (
    "You are an expert business strategist and report writer for LegacyGuard, a crypto "
    "inheritance protocol and security infrastructure layer. Your writing is direct, specific, "
    "and avoids fluff. Every report includes explicit recommendations, scorecards, "
    "comparison tables, go/no-go conclusions, key assumptions, and open questions."
)


async def call_gemini(prompt: str, context: str) -> str:
    """Single Gemini call with retry."""
    url = GEMINI_URL.format(model=settings.model_name)
    full = f"Context:\n{context[:80000]}\n\n---\n\n{prompt}"
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM}]},
        "contents": [{"role": "user", "parts": [{"text": full}]}],
        "generationConfig": {"maxOutputTokens": 8192, "temperature": 0.3},
    }

    for attempt in range(8):
        async with httpx.AsyncClient(timeout=180) as client:
            resp = await client.post(url, params={"key": settings.gemini_api_key}, json=payload)

        if resp.status_code == 429:
            wait = min(2 ** attempt + 1, 120)
            logger.warning("Rate limited, waiting %.0fs (attempt %d)", wait, attempt + 1)
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


REPORTS = [
    (
        "01_executive_strategy",
        "LegacyGuard — Protocol + Infrastructure Strategy",
        (
            "Write: 'LegacyGuard — Protocol + Infrastructure Strategy'\n\n"
            "Structure:\n"
            "## Executive Summary (500 words)\n"
            "## Strategic Positioning (Consumer SaaS vs Infrastructure vs Protocol comparison table)\n"
            "## Market Opportunity Summary (TAM/SAM/SOM table)\n"
            "## Competitive Advantage & Defensibility (scored 1-10)\n"
            "## Recommended Architecture\n"
            "## Business Model Recommendation (primary + secondary revenue)\n"
            "## Go/No-Go Scorecard (| Criteria | Score | Evidence | Risk |)\n"
            "## Key Assumptions (top 5, how to test each)\n"
            "## Open Questions (5-10)\n"
            "## Conclusion: Build or Don't Build?\n"
        ),
    ),
    (
        "02_vc_investment_memo",
        "Should LegacyGuard Be Built as a Venture-Scale Company?",
        (
            "Write a VC investment memo.\n\n"
            "## Thesis (1 paragraph)\n"
            "## The Problem (quantified)\n"
            "## The Solution & Differentiator\n"
            "## Market Size (TAM/SAM/SOM)\n"
            "## Business Model & Unit Economics\n"
            "## Competitive Landscape\n"
            "## Go-To-Market\n"
            "## Risks & Mitigations (| Risk | Likelihood | Impact | Mitigation |)\n"
            "## Financial Projections (| Metric | Year 1 | Year 2 | Year 3 |)\n"
            "## Funding Ask & Milestones\n"
            "## Venture Scale Assessment (can this be $100M+ revenue?)\n"
            "## Conclusion: Invest or Pass?\n"
        ),
    ),
    (
        "03_mvp_recommendation",
        "What Should LegacyGuard Build First?",
        (
            "Write the MVP recommendation report.\n\n"
            "## 3 MVP Options\n"
            "MVP-A: Fastest validation (consumer-facing)\n"
            "MVP-B: Strongest B2B infrastructure angle\n"
            "MVP-C: Strongest protocol-first angle\n\n"
            "## Scoring Matrix (| Criteria | Weight | MVP-A | MVP-B | MVP-C |)\n"
            "Criteria: Speed, cost, revenue potential, learning value, defensibility, "
            "investor appeal. Weighted scores.\n\n"
            "## Recommended MVP (which one, why)\n"
            "## MVP Specification (features, target user, timeline, team, budget)\n"
            "## Validation Plan (| Assumption | Test | Success Criteria | Timeline |)\n"
            "## Kill Criteria (when to stop)\n"
            "## After MVP: Next 6 months\n"
        ),
    ),
    (
        "04_partnership_playbook",
        "How LegacyGuard Can Enter Through Infrastructure Partnerships",
        (
            "Write the partnership playbook.\n\n"
            "## Why Partnerships First?\n"
            "## Top 5 Partnership Pathways (for each: targets, value prop, integration, "
            "commercial model, pilot offer, timeline)\n"
            "1. Hardware Wallets (Ledger, Trezor)\n"
            "2. Software Wallets (MetaMask, Trust Wallet)\n"
            "3. Multisig (Gnosis Safe, Unchained)\n"
            "4. Institutional Custody (Fireblocks, BitGo)\n"
            "5. Family Offices / Wealth Managers\n\n"
            "## Priority Matrix (| Partner | Impact | Feasibility | Speed | Revenue | Priority |)\n"
            "## Pilot Program Design\n"
            "## Common Objections & Responses\n"
            "## 3 Outreach Email Templates\n"
        ),
    ),
    (
        "05_founder_action_plan",
        "30-Day, 60-Day, 90-Day Founder Plan",
        (
            "Write the founder action plan.\n\n"
            "## Days 1-30: Validate\n"
            "Week 1: Problem validation (interviews, personas)\n"
            "Week 2: Solution hypothesis & tech spec\n"
            "Week 3: Partner conversations\n"
            "Week 4: Go/No-Go decision framework\n\n"
            "## Days 31-60: Build MVP\n"
            "Week 5-6: Core build\n"
            "Week 7-8: Integration & testing\n\n"
            "## Days 61-90: Launch & Learn\n"
            "Week 9-10: Pilot launch\n"
            "Week 11-12: Iterate & expand\n\n"
            "## Milestones (| Milestone | Date | Metric | Status |)\n"
            "## 90-Day Budget (| Category | Monthly | Total |)\n"
            "## Team Needs\n"
            "## Risk Register (| Risk | Prob | Impact | Mitigation |)\n"
        ),
    ),
]


async def main() -> None:
    # Load context from existing blueprint
    blueprint_path = Path(settings.reports_dir) / "startup_blueprint.md"
    if blueprint_path.exists():
        context = blueprint_path.read_text(encoding="utf-8")
    else:
        console.print("[red]No startup_blueprint.md found. Run the pipeline first.[/red]")
        sys.exit(1)

    console.print(f"[cyan]Context loaded: {len(context):,} chars from startup_blueprint.md[/cyan]")
    start = time.monotonic()

    for slug, title, prompt in REPORTS:
        console.print(f"\n[bold]Generating: {title}...[/bold]")
        try:
            content = await call_gemini(prompt + f"\n\nStartup: {IDEA}", context)
            # Save
            path = Path(settings.reports_dir) / f"legacyguard_{slug}.md"
            now = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).strftime("%Y-%m-%d")
            header = f"# {title}\n*Generated {now} by LegacyGuard AI Strategy Lab*\n\n---\n\n"
            path.write_text(header + content, encoding="utf-8")
            console.print(f"  [green]✓ {slug}: {len(content):,} chars[/green]")
        except Exception as exc:
            console.print(f"  [red]✗ {slug}: {exc}[/red]")

        # Rate limit pause between reports
        await asyncio.sleep(8)

    elapsed = time.monotonic() - start
    console.print(f"\n[bold green]All reports generated in {elapsed:.1f}s[/bold green]")
    console.print(f"Saved to: [cyan]{settings.reports_dir}[/cyan]")


if __name__ == "__main__":
    asyncio.run(main())
