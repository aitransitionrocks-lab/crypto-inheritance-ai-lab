"""Protocol Strategy Agent – analyzes protocol vs SaaS vs infra business models."""

from __future__ import annotations

from agents.base import BaseAgent


class ProtocolStrategyAgent(BaseAgent):
    name = "protocol_strategy"
    role = "Protocol Strategy Analyst"
    system_prompt = (
        "You are a senior crypto-native strategist who has designed tokenomics and protocol "
        "architectures for multiple successful projects. You understand the trade-offs between "
        "protocol-based, SaaS, and infrastructure business models in the crypto space. "
        "Analyze with nuance — not everything should be decentralized, and not every token adds value. "
        "Be rigorous, opinionated, and specific."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for protocol and business-model insights
        queries = [
            "protocol-based crypto services business model",
            "DeFi inheritance protocols tokenization",
            "tokenized security infrastructure pros cons",
            "protocol network effects crypto startups",
            "crypto SaaS vs protocol vs infrastructure comparison",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results for deeper context
        results = await self.search("crypto protocol business model analysis 2024")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall prior research for richer context
        context = self.recall("protocol business model tokenization decentralization")

        # 4. Synthesize protocol strategy analysis
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Provide a deep protocol strategy analysis covering:\n"
                "1. **Protocol vs SaaS vs Infrastructure** — Compare these three business model "
                "archetypes for a crypto inheritance/recovery service. Which fits best and why?\n"
                "2. **Tokenization Assessment** — Does adding a token help or hurt? Under what "
                "conditions would tokenization create genuine value vs being extractive?\n"
                "3. **Governance Assumptions** — What governance model is appropriate? DAO, "
                "multisig council, centralized with transparency, or hybrid?\n"
                "4. **Network Effects Analysis** — Where do network effects exist (if any)? "
                "Are they same-side or cross-side? How strong are they?\n"
                "5. **Decentralization Map** — What MUST be decentralized (key management, "
                "trigger mechanisms) vs what SHOULD stay centralized (UX, onboarding, support)?\n"
                "6. **Recommended Architecture** — Propose the optimal model with justification.\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("Protocol Strategy", analysis)
        return {"Protocol Strategy": analysis}
