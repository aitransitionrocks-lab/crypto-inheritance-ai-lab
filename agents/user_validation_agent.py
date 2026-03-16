"""User Validation Agent – defines interview targets, generates interview plans, and clusters pain points."""

from __future__ import annotations

from agents.base import BaseAgent


class UserValidationAgent(BaseAgent):
    name = "user_validation"
    role = "User Research Strategist"
    system_prompt = (
        "You are a seasoned user researcher and product strategist who has conducted hundreds "
        "of customer discovery interviews for B2B and B2C crypto products. You know how to "
        "distinguish polite enthusiasm ('nice idea') from genuine willingness to pay ('painkiller'). "
        "Design interview plans that uncover real behavior, not hypothetical intent. "
        "Be specific, structured, and ruthlessly focused on validation signals."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for user research and pain points
        queries = [
            "crypto inheritance user research pain points",
            "digital estate planning user needs surveys",
            "crypto user pain points surveys 2024",
            "high net worth crypto holders estate planning",
            "family office digital asset management needs",
            "estate lawyer cryptocurrency challenges",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results
        results = await self.search("crypto inheritance user interviews pain points")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall prior research for context
        context = self.recall(
            "user personas pain points crypto inheritance estate planning willingness to pay"
        )

        # 4. Synthesize user validation plan
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Create a comprehensive user validation plan covering:\n\n"
                "## 1. Target Interview Segments\n"
                "Define who should be interviewed and why. For each segment:\n"
                "- **Retail Crypto Holders** (various portfolio sizes)\n"
                "- **High-Net-Worth Individuals (HNWI)** with significant crypto\n"
                "- **Family Office Managers** responsible for digital assets\n"
                "- **Estate Lawyers / Trust Attorneys** dealing with crypto\n"
                "- **Wallet Developers / Crypto Infrastructure Engineers**\n\n"
                "For each: sample size needed, where to recruit, screening criteria, "
                "expected interview duration.\n\n"
                "## 2. Structured Interview Plans\n"
                "For each segment, provide:\n"
                "- 8-12 specific interview questions (open-ended, behavior-focused)\n"
                "- What you're really testing with each question\n"
                "- Red flags that indicate 'nice idea' vs green flags for 'painkiller'\n\n"
                "## 3. Pain Point Clusters\n"
                "Based on research, cluster the known pain points into themes:\n"
                "- Rank by severity and frequency\n"
                "- Map which segments feel each pain most acutely\n\n"
                "## 4. Willingness-to-Pay Analysis\n"
                "- Which segment has the strongest willingness to pay?\n"
                "- What pricing signals to look for in interviews\n"
                "- 'Nice idea' indicators vs 'painkiller' indicators\n\n"
                "## 5. Validation Milestones\n"
                "- Define what 'validated' looks like (e.g., X/Y interviewees would pay $Z)\n"
                "- Timeline for validation sprint\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("User Validation Plan", analysis)
        return {"User Validation Plan": analysis}
