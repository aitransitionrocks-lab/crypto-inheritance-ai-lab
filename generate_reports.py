#!/usr/bin/env python3
"""
Standalone report generator — runs only the Report Agent against existing memory.
Use after a successful pipeline run where only report generation failed.
"""

from __future__ import annotations

import asyncio
import logging
import sys
import time

from rich.console import Console

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))

from config.settings import settings
from memory.vector_store import VectorStore
from agents.report_agent import ReportAgent

console = Console()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)-20s │ %(levelname)-8s │ %(message)s",
    datefmt="%H:%M:%S",
)

IDEA = (
    "LegacyGuard: Crypto Inheritance Protocol and Security Infrastructure Layer — "
    "A secure inheritance protocol for digital assets that enables wallets, custody solutions, "
    "multisig systems, family offices, and estate-planning stakeholders to support compliant, "
    "privacy-preserving, verifiable inheritance workflows."
)


async def main() -> None:
    memory = VectorStore()
    console.print(f"[cyan]Memory has {memory.count} docs[/cyan]")

    report_agent = ReportAgent(memory)
    start = time.monotonic()

    console.print("[bold]Generating 5 strategic reports...[/bold]")
    try:
        result = await report_agent.run(IDEA)
        elapsed = time.monotonic() - start
        console.print(f"\n[bold green]Reports generated in {elapsed:.1f}s[/bold green]")
        for title, content in result.items():
            console.print(f"  • {title}: {len(content):,} chars")
        console.print(f"\nSaved to: [cyan]{settings.reports_dir}[/cyan]")
    except Exception as exc:
        console.print(f"[red]Report generation failed: {exc}[/red]")
        raise


if __name__ == "__main__":
    asyncio.run(main())
