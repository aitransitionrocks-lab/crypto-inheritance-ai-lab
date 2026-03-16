"""Research Agent – deep multi-angle research on crypto inheritance and succession."""

from __future__ import annotations

from agents.base import BaseAgent


class ResearchAgent(BaseAgent):
    name = "research"
    role = "Primary Researcher"
    system_prompt = (
        "You are a senior researcher for LegacyGuard, a crypto inheritance protocol "
        "and security infrastructure layer. You investigate the succession problem across "
        "all segments: retail self-custody, HNWIs, family offices, multisig setups, "
        "corporate treasury, and wealth managers. "
        "Distinguish clearly between 'nice to have' and 'painkiller' problems. "
        "Cite real data wherever possible. Be rigorous, skeptical, and structured."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Broad search across multiple problem angles
        queries: list[str] = [
            "bitcoin lost due to owner death statistics Chainalysis 2024",
            "crypto inheritance dispute lawsuit heirs estate court cases",
            "self-custody wallet owner dies family locked out real stories",
            "HNWI crypto holders estate planning gaps family office",
            "multisig wallet succession failure co-signer death incapacity",
            "corporate treasury crypto key person risk single point of failure",
            "wealth manager digital asset inheritance compliance burden",
            "crypto inheritance user pain points reddit forum complaints",
            "Fireblocks Anchorage custody succession planning gap",
            "lost cryptocurrency billions estimated total 2024 report",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results for deeper context
        deep_results = await self.search(
            "crypto inheritance problem scale real data lost wallets death"
        )
        for r in deep_results[:3]:
            await self.scrape(r["link"])

        # 3. Synthesize findings with decision-useful framing
        context = self.recall(
            "crypto inheritance lost wallets death succession multisig family office"
        )
        analysis: str = await self.think(
            prompt=(
                f"Based on the following research about: '{startup_idea}'\n\n"
                "Provide a comprehensive, multi-segment problem analysis:\n\n"
                "## 1. Core Problem Statement\n"
                "Define the problem precisely. Why do crypto assets get permanently lost "
                "when holders die or become incapacitated? What makes this fundamentally "
                "different from traditional asset inheritance?\n\n"
                "## 2. Scale of the Problem (Hard Data)\n"
                "Estimate total crypto lost to death/incapacity. Reference Chainalysis, "
                "Glassnode, or other credible sources. Quantify in USD and BTC equivalent.\n\n"
                "## 3. Segment-by-Segment Pain Analysis\n"
                "For EACH of these segments, describe the specific pain, urgency, and "
                "willingness to pay:\n"
                "- **Retail self-custody** (individual HODLers)\n"
                "- **HNWIs** ($1M+ crypto holdings)\n"
                "- **Family offices** managing multi-generational crypto wealth\n"
                "- **Multisig setups** (DAOs, shared wallets, co-founders)\n"
                "- **Corporate treasury** (companies holding BTC/ETH on balance sheet)\n"
                "- **Wealth managers / estate planners** (professional intermediaries)\n\n"
                "## 4. Painkiller vs. Vitamin Classification\n"
                "For each segment, classify: Is the inheritance problem a 'painkiller' "
                "(urgent, must-solve) or a 'vitamin' (nice to have)? Explain why.\n\n"
                "## 5. Current Workarounds and Why They Fail\n"
                "What do people actually do today? Paper seed phrases in safes, shared "
                "passwords, trusted third parties, lawyers — and why each fails.\n\n"
                "## 6. Why the Problem Is Accelerating\n"
                "Aging crypto-native population, regulatory pressure, institutional "
                "adoption increasing key-person risk, ETF holders vs self-custody.\n\n"
                "## 7. Key User Personas (Prioritized)\n"
                "Define 4-5 distinct personas with their specific context, pain level, "
                "and budget range.\n\n"
                "Structure your response in markdown. Be specific — no hand-waving."
            ),
            context=context,
        )

        self.store_output("problem_analysis", analysis)
        return {"Problem Analysis": analysis}
