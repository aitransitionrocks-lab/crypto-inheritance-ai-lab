"""Infrastructure Partnerships Agent – maps integration opportunities and partnership pathways."""

from __future__ import annotations

from agents.base import BaseAgent


class InfrastructurePartnershipsAgent(BaseAgent):
    name = "infrastructure_partnerships"
    role = "Partnership Strategist"
    system_prompt = (
        "You are a crypto business development expert with deep relationships across the wallet, "
        "custody, exchange, and institutional crypto ecosystem. You understand what motivates "
        "partners to integrate, what makes them resist, and how to structure deals that align "
        "incentives. Be specific about partner names, integration paths, and commercial models."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for partnership and integration data
        queries = [
            "wallet provider partnership models crypto infrastructure",
            "crypto infrastructure B2B integration opportunities",
            "custody API integration Fireblocks BitGo",
            "Ledger Trezor third party integration programs",
            "Gnosis Safe multisig integration partners",
            "family office crypto custody solutions",
            "estate planning crypto service partnerships",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results
        results = await self.search("crypto custody wallet partnership integration 2024")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall context from prior agents
        context = self.recall(
            "wallet providers custody platforms partnerships integration crypto infrastructure"
        )

        # 4. Synthesize partnership strategy
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Provide a comprehensive partnership strategy covering these partner categories:\n\n"
                "For EACH of the following categories, analyze:\n"
                "- Why they care (incentive to partner)\n"
                "- Why they resist (blockers and concerns)\n"
                "- Integration path (technical and business steps)\n"
                "- Commercial model (revenue share, licensing, free tier, etc.)\n"
                "- Technical requirements (APIs, security standards, compliance)\n"
                "- Best pilot offer (what to propose to get a foot in the door)\n\n"
                "**Categories:**\n"
                "1. Wallet Providers (MetaMask, Phantom, Rainbow, etc.)\n"
                "2. Hardware Wallets (Ledger, Trezor, Keystone)\n"
                "3. Exchanges (Coinbase, Kraken, Binance)\n"
                "4. Multisig Platforms (Gnosis Safe/Safe, Squads)\n"
                "5. Custody Providers (Fireblocks, BitGo, Anchorage)\n"
                "6. Family Offices & Wealth Managers\n"
                "7. Estate Planners & Trusts Lawyers\n\n"
                "Then: **Prioritize the top 5 partnership pathways** ranked by feasibility, "
                "strategic value, and speed to close. Explain your ranking.\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("Partnership Strategy", analysis)
        return {"Partnership Strategy": analysis}
