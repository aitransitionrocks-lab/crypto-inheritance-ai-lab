"""VC Scoring Agent – evaluates the startup idea like a top-tier seed investor."""

from __future__ import annotations

from agents.base import BaseAgent


class VCScoringAgent(BaseAgent):
    name = "vc_scoring"
    role = "Venture Capital Analyst"
    system_prompt = (
        "You are a partner at a top-tier crypto-native venture fund (think Paradigm, a16z crypto, "
        "Polychain level). You have seen thousands of pitches and funded dozens of winners. "
        "You evaluate with brutal honesty — you want to find reasons to say yes, but you never "
        "ignore red flags. Score rigorously, justify every score, and be specific about what "
        "would change your assessment."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for funding landscape and comparables
        queries = [
            "crypto startup funding 2024 seed stage deals",
            "seed stage crypto infrastructure deals valuations",
            "VC thesis crypto security inheritance",
            "crypto startup investment criteria top VCs",
            "crypto inheritance startup funding rounds",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results
        results = await self.search("crypto VC investment criteria 2024 infrastructure")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall ALL prior agent outputs for comprehensive evaluation
        prior_context_queries = [
            "market size crypto inheritance total addressable market",
            "competitive landscape crypto inheritance solutions",
            "protocol strategy business model tokenization",
            "partnership opportunities wallet custody integration",
            "security architecture MPC threshold cryptography",
            "regulatory risk legal classification custody",
            "go-to-market strategy developer platform",
            "product roadmap MVP features",
            "business model revenue pricing",
        ]
        context_parts: list[str] = []
        for q in prior_context_queries:
            context_parts.append(self.recall(q, n=3))
        context = "\n\n---\n\n".join(context_parts)

        # 4. Generate VC scorecard
        analysis = await self.think(
            prompt=(
                f"Based on all available research about the startup idea: '{startup_idea}'\n\n"
                "Evaluate this startup idea as a top-tier seed investor. Provide:\n\n"
                "## Scoring Dimensions (1-10 each with justification)\n"
                "1. **Market Size** — TAM, SAM, SOM; is this a billion-dollar market?\n"
                "2. **Timing** — Why now? What has changed to make this possible/necessary?\n"
                "3. **Moat / Defensibility** — What prevents fast-followers? Network effects, "
                "data, switching costs, brand, regulatory?\n"
                "4. **Team / Technical Complexity** — How hard is this to build? What team is needed?\n"
                "5. **GTM Feasibility** — Is there a clear path to first 100 customers?\n"
                "6. **Regulatory Risk** — How likely is regulation to kill or help this?\n"
                "7. **Revenue Quality** — Recurring? High-margin? Predictable? Growing with crypto AUM?\n"
                "8. **Defensibility Over Time** — Does the moat widen or narrow over 5 years?\n\n"
                "## Overall Assessment\n"
                "- **Overall Score** (weighted average with your weights explained)\n"
                "- **Fundable vs Unfundable** — Clear verdict with reasoning\n"
                "- **What Would Make This Investable** — Top 3-5 things that would change a 'no' "
                "to a 'yes' or a 'maybe' to a 'strong yes'\n"
                "- **Comparable Investments** — What funded companies is this most similar to?\n"
                "- **Red Flags** — What concerns you most?\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("VC Scorecard", analysis)
        return {"VC Scorecard": analysis}
