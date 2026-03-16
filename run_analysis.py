#!/usr/bin/env python3
"""
CLI entry point – runs the full multi-agent research pipeline.

Usage:
    python run_analysis.py
    python run_analysis.py --idea "Your custom startup idea"
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
import time

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.table import Table

# Ensure project root is on sys.path
sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))

from config.settings import settings
from orchestrator.orchestrator import Orchestrator

console = Console()

DEFAULT_IDEA = (
    "LegacyGuard: Crypto Inheritance Protocol and Security Infrastructure Layer — "
    "A secure inheritance protocol for digital assets that enables wallets, custody solutions, "
    "multisig systems, family offices, and estate-planning stakeholders to support compliant, "
    "privacy-preserving, verifiable inheritance workflows."
)


def setup_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s │ %(name)-20s │ %(levelname)-8s │ %(message)s",
        datefmt="%H:%M:%S",
    )
    # Quiet noisy libraries
    for name in ("httpx", "httpcore", "chromadb", "sentence_transformers"):
        logging.getLogger(name).setLevel(logging.WARNING)


def validate_config() -> bool:
    missing = settings.validate()
    if missing:
        console.print(
            Panel(
                f"[red]Missing required API keys:[/red] {', '.join(missing)}\n\n"
                "Copy .env.example → .env and fill in your keys.",
                title="⚠  Configuration Error",
            )
        )
        return False
    return True


async def main(idea: str, verbose: bool) -> None:
    setup_logging(verbose)

    console.print(
        Panel(
            f"[bold cyan]{idea}[/bold cyan]",
            title="🔬 LegacyGuard Strategic Research Engine",
            subtitle="Multi-Agent Startup Analyzer",
        )
    )

    if not validate_config():
        sys.exit(1)

    orchestrator = Orchestrator()
    start = time.monotonic()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
        console=console,
    ) as progress:
        task = progress.add_task("Running full analysis pipeline...", total=None)
        state = await orchestrator.run(idea)
        progress.update(task, description="Pipeline complete!")

    elapsed = time.monotonic() - start

    # Summary table
    table = Table(title="Pipeline Results")
    table.add_column("Section", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("Length", justify="right")

    for section, content in state["sections"].items():
        status = "✓" if content else "✗"
        table.add_row(section, status, f"{len(content):,} chars" if content else "—")

    console.print(table)

    if state["errors"]:
        console.print(f"\n[yellow]Warnings ({len(state['errors'])}):[/yellow]")
        for err in state["errors"]:
            console.print(f"  • {err}")

    console.print(f"\n[bold green]Done in {elapsed:.1f}s[/bold green]")
    console.print(f"Reports saved to: [cyan]{settings.reports_dir}[/cyan]")
    console.print(f"  • startup_blueprint.md")
    console.print(f"  • startup_blueprint.docx")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Crypto Inheritance AI Lab")
    parser.add_argument("--idea", default=DEFAULT_IDEA, help="Startup idea to analyze")
    parser.add_argument("-v", "--verbose", action="store_true", help="Debug logging")
    args = parser.parse_args()

    asyncio.run(main(args.idea, args.verbose))
