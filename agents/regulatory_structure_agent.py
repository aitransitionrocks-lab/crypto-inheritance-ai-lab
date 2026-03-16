"""Regulatory Structure Agent – analyzes legal architecture for a crypto infrastructure/protocol model."""

from __future__ import annotations

from agents.base import BaseAgent


class RegulatoryStructureAgent(BaseAgent):
    name = "regulatory_structure"
    role = "Regulatory Architecture Analyst"
    system_prompt = (
        "You are a crypto regulatory strategist who advises protocols and infrastructure companies "
        "on legal architecture. You understand how the choice of business model (protocol, infra, "
        "SaaS, consumer app) changes legal exposure dramatically. You know custody classifications, "
        "money transmission rules, MiCA, and cross-border structuring. Be specific about "
        "jurisdictions, entity structures, and regulatory strategies."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for regulatory landscape
        queries = [
            "crypto infrastructure legal classification 2024",
            "key management service regulation custody law",
            "crypto custody law 2024 US EU",
            "infrastructure provider liability crypto",
            "money transmission crypto software provider exemption",
            "MiCA crypto custody regulation Europe",
            "crypto entity structure legal architecture",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results
        results = await self.search(
            "crypto infrastructure vs consumer app legal classification custody 2024"
        )
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall prior legal and regulatory research
        context = self.recall(
            "legal regulatory custody classification money transmission crypto infrastructure"
        )

        # 4. Synthesize regulatory architecture
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Analyze how the protocol/infrastructure model changes legal exposure "
                "compared to a consumer-facing app. Provide:\n\n"
                "## 1. Regulatory Dimension Mapping\n"
                "For each dimension, analyze the implications:\n"
                "- **Custody Classification** — Does the service constitute custody? "
                "Under which jurisdictions? How to avoid custodial classification?\n"
                "- **Money Transmission** — Is this money transmission? State vs federal "
                "analysis (US), EU analysis.\n"
                "- **Data Handling** — GDPR, CCPA implications for key material and user data.\n"
                "- **Platform Liability** — What liability does the infrastructure provider carry "
                "if a user's inheritance fails?\n"
                "- **Cross-Border Issues** — How does operating across jurisdictions affect "
                "compliance requirements?\n\n"
                "## 2. Legal Posture Comparison\n"
                "Compare the regulatory burden when positioning as:\n"
                "- Software Provider (open-source tools)\n"
                "- Infrastructure Provider (APIs/SDKs, non-custodial)\n"
                "- Key Management Service (handling key material)\n"
                "- Fiduciary Service (taking on duty of care)\n\n"
                "For each: regulatory requirements, licenses needed, liability exposure, "
                "compliance cost, geographic limitations.\n\n"
                "## 3. Recommended Legal Architecture\n"
                "- Proposed entity structure (holding company, operating entities, foundation)\n"
                "- Recommended jurisdiction(s) and why\n"
                "- Legal architecture options (rank by risk/cost/flexibility)\n"
                "- What legal opinions are needed before launch?\n\n"
                "## 4. Regulatory Risk Matrix\n"
                "- Likelihood and severity of key regulatory risks\n"
                "- Mitigations for each\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("Regulatory Architecture", analysis)
        return {"Regulatory Architecture": analysis}
