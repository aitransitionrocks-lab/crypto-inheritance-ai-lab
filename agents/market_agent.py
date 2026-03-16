"""Market Agent – sizes market across consumer, B2B, infrastructure, and estate tech."""

from __future__ import annotations

from agents.base import BaseAgent


class MarketAgent(BaseAgent):
    name = "market"
    role = "Market Analyst"
    system_prompt = (
        "You are a market sizing analyst for LegacyGuard, a crypto inheritance protocol "
        "and security infrastructure layer. You estimate markets using rigorous top-down "
        "and bottom-up approaches across multiple segments: consumer inheritance, B2B "
        "infrastructure, family office services, and estate planning technology. "
        "Always show your methodology, assumptions, and data sources. Use the crypto "
        "custody market as a reference anchor. Distinguish between addressable and "
        "realistically capturable opportunity."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        queries: list[str] = [
            "crypto custody market size revenue 2024 2025 forecast Fireblocks BitGo",
            "total cryptocurrency holders worldwide 2024 verified data",
            "digital estate planning software market size growth rate",
            "family office crypto allocation percentage AUM 2024",
            "crypto inheritance service willingness to pay consumer survey",
            "B2B API infrastructure market crypto security tools revenue",
            "multisig wallet market adoption Gnosis Safe usage statistics",
            "HNWI crypto holders net worth distribution digital assets",
            "enterprise crypto treasury management market size",
            "estate planning technology market insurtech wealthtech overlap",
        ]
        for q in queries:
            await self.search(q)

        context = self.recall(
            "crypto market size custody users wallets family office estate planning B2B"
        )
        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Size the market opportunity across MULTIPLE segments. For each segment, "
                "calculate TAM, SAM, and SOM separately.\n\n"
                "## 1. Consumer Inheritance Market\n"
                "- TAM: All crypto holders who could need inheritance planning\n"
                "- SAM: Self-custody users in English-speaking + EU markets\n"
                "- SOM: Realistic 3-year capture with consumer product\n"
                "- Revenue model assumption: $X/year subscription\n\n"
                "## 2. B2B Infrastructure / API Market\n"
                "- TAM: All wallet providers, exchanges, custody platforms that could "
                "integrate inheritance infrastructure\n"
                "- SAM: Mid-size wallet/custody providers needing plug-in inheritance\n"
                "- SOM: Realistic integration partnerships in 3 years\n"
                "- Revenue model assumption: API licensing + per-activation fees\n\n"
                "## 3. Family Office / HNWI Market\n"
                "- TAM: Family offices with crypto allocation globally\n"
                "- SAM: Offices with >$5M crypto needing succession planning\n"
                "- SOM: Reachable through wealth advisory channels\n"
                "- Revenue model assumption: Premium annual contracts\n\n"
                "## 4. Estate Planning Tech Market\n"
                "- TAM: Estate planning software + digital will platforms\n"
                "- SAM: Platforms needing crypto-specific modules\n"
                "- SOM: Partnership/white-label integrations\n\n"
                "## 5. Crypto Custody Market (Reference Anchor)\n"
                "- Total market size and growth for context\n"
                "- What percentage of custody revenue maps to succession features?\n\n"
                "## 6. Combined TAM/SAM/SOM Summary Table\n"
                "Create a markdown table combining all segments with:\n"
                "| Segment | TAM | SAM | SOM (3yr) | Revenue Model | Confidence |\n\n"
                "## 7. Growth Drivers & Headwinds\n"
                "What accelerates adoption? What slows it down?\n\n"
                "## 8. Market Timing Assessment\n"
                "Is this a 'too early' market, 'just right', or 'late'? Why?\n\n"
                "Show all calculations. Use real data where available, clearly mark "
                "estimates. Use markdown tables for comparisons."
            ),
            context=context,
        )

        self.store_output("market_opportunity", analysis)
        return {"Market Opportunity": analysis}
