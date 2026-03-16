"""Business Model Agent – models multiple revenue strategies with unit economics."""

from __future__ import annotations

from agents.base import BaseAgent


class BusinessModelAgent(BaseAgent):
    name = "business_model"
    role = "Business Strategist"
    system_prompt = (
        "You are a business strategist for LegacyGuard, a crypto inheritance protocol "
        "and security infrastructure layer. You model multiple revenue strategies: consumer "
        "subscription, B2B API licensing, white-label fees, per-activation pricing, and "
        "enterprise contracts. You calculate unit economics for each model and score "
        "strategic options on venture-scale criteria. You think about defensibility, "
        "switching costs, and long-term value creation across both consumer and infrastructure."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        queries: list[str] = [
            "B2B API pricing models infrastructure SaaS crypto tools revenue",
            "white-label fintech licensing fees pricing benchmarks",
            "crypto custody service pricing Fireblocks BitGo per-wallet fees",
            "per-activation pricing model insurance fintech triggered events",
            "enterprise contract pricing crypto security infrastructure annual",
            "consumer subscription pricing crypto security tools willingness to pay",
            "SaaS unit economics benchmarks CAC LTV payback crypto fintech 2024",
            "protocol revenue models token vs fee-based Web3 infrastructure",
        ]
        for q in queries:
            await self.search(q)

        context_parts: list[str] = [
            self.recall("market opportunity TAM SAM SOM segments B2B consumer"),
            self.recall("competitor pricing features revenue model funding"),
            self.recall("product design MVP variants API SDK white-label"),
        ]
        context = "\n\n---\n\n".join(context_parts)

        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Model multiple revenue strategies and score strategic options.\n\n"
                "## 1. Revenue Model Comparison\n"
                "For EACH revenue model, calculate unit economics:\n\n"
                "### Model A: Consumer Subscription (B2C)\n"
                "- Pricing tiers and features\n"
                "- CAC estimate, LTV estimate, LTV:CAC ratio\n"
                "- Payback period, churn assumptions\n"
                "- Revenue projection (Year 1-3)\n\n"
                "### Model B: B2B API Licensing\n"
                "- Pricing: setup fee + monthly base + per-API-call / per-wallet\n"
                "- CAC (enterprise sales cycle), contract value, expansion revenue\n"
                "- Revenue projection (Year 1-3)\n\n"
                "### Model C: White-Label Fees\n"
                "- Pricing: implementation fee + monthly license + revenue share\n"
                "- Unit economics per white-label customer\n"
                "- Revenue projection (Year 1-3)\n\n"
                "### Model D: Per-Activation Pricing\n"
                "- Pricing: fee charged when inheritance is actually triggered\n"
                "- Challenge: low-frequency event economics\n"
                "- Revenue projection (Year 1-3)\n\n"
                "### Model E: Enterprise Contracts (Family Office / Institutional)\n"
                "- Pricing: annual contract, AUM-based or flat fee\n"
                "- Unit economics per enterprise customer\n"
                "- Revenue projection (Year 1-3)\n\n"
                "### Revenue Model Comparison Table\n"
                "| Model | Year 1 Rev | Year 3 Rev | Gross Margin | CAC | LTV | "
                "LTV:CAC | Scalability | Defensibility |\n\n"
                "## 2. Strategic Options Scorecard\n"
                "Score 7 strategic options on a 1-10 scale across 6 criteria:\n"
                "| Strategy | Market Size | Defensibility | Speed to Rev | "
                "Venture Scale | Execution Risk | Total Score |\n"
                "Options:\n"
                "1. Consumer SaaS (direct to crypto holders)\n"
                "2. B2B2C (sell through wallet providers)\n"
                "3. Protocol (decentralized inheritance protocol with token)\n"
                "4. Infrastructure (API/SDK layer for custody/wallet companies)\n"
                "5. Combined (consumer + infrastructure simultaneously)\n"
                "6. Multisig Module (plug-in for existing multisig setups)\n"
                "7. HNWI Premium (high-touch service for wealthy crypto holders)\n\n"
                "## 3. Recommended Strategy (with reasoning)\n"
                "Which combination gives the best risk-adjusted path to venture scale?\n"
                "- Primary revenue model\n"
                "- Secondary revenue model\n"
                "- Sequencing: What to launch first, what to add when\n\n"
                "## 4. Cost Structure\n"
                "- Engineering team (sizes by phase)\n"
                "- Infrastructure costs (cloud, blockchain nodes, HSMs)\n"
                "- Security audits (frequency, cost)\n"
                "- Legal / compliance\n"
                "- Sales (if B2B)\n"
                "- Burn rate by phase\n\n"
                "## 5. Funding Strategy\n"
                "- Pre-seed: amount, milestones, target investors\n"
                "- Seed: amount, milestones, target investors\n"
                "- Series A triggers: what metrics needed\n"
                "- Alternative: bootstrapped path — is it viable?\n\n"
                "## 6. Key Assumptions & Risks\n"
                "List the 5 most critical assumptions and what happens if each is wrong."
            ),
            context=context,
        )

        self.store_output("business_model", analysis)
        return {"Business Model": analysis}
