"""Product Agent – designs product for consumer AND infrastructure use cases."""

from __future__ import annotations

from agents.base import BaseAgent


class ProductAgent(BaseAgent):
    name = "product"
    role = "Product Architect"
    system_prompt = (
        "You are a senior product architect for LegacyGuard, a crypto inheritance protocol "
        "and security infrastructure layer. You design for two audiences simultaneously: "
        "end consumers (wallet owners and heirs) AND infrastructure customers (wallet "
        "providers, custody platforms, multisig services, family offices). You define "
        "API/SDK needs for wallet provider integration, design white-label capabilities, "
        "and create multiple MVP variants. You think in terms of platforms, not just apps."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # Gather insights from other agents
        context_parts: list[str] = [
            self.recall("problem analysis crypto inheritance segments painkiller"),
            self.recall("security architecture options MVP feasible custodian"),
            self.recall("competitor whitespace gaps infrastructure API"),
            self.recall("legal strategy provider classification non-custodial"),
        ]
        context = "\n\n---\n\n".join(context_parts)

        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Design the product architecture for BOTH consumer and infrastructure "
                "use cases.\n\n"
                "## 1. Product Vision\n"
                "- One-liner positioning statement\n"
                "- Expanded vision: Why protocol + infrastructure, not just app?\n"
                "- Core thesis: What must be true for this to work?\n\n"
                "## 2. Consumer Product (B2C)\n"
                "### User Flows\n"
                "- Wallet owner: onboarding, heir configuration, check-in mechanism, "
                "key splitting, verification\n"
                "- Heir: notification, identity verification, claim process, key assembly\n"
                "### Feature Set\n"
                "- Must-have (MVP)\n"
                "- Phase 2 enhancements\n"
                "- Phase 3 (full platform)\n\n"
                "## 3. Infrastructure Product (B2B)\n"
                "### API / SDK Design\n"
                "- Core API endpoints a wallet provider would need\n"
                "- SDK integration flow (how a wallet app adds inheritance in <1 week)\n"
                "- Webhook system for liveness checks, trigger events, heir notifications\n"
                "### White-Label Capabilities\n"
                "- What can be branded by the partner?\n"
                "- What remains LegacyGuard-branded?\n"
                "- Customization parameters (timeouts, verification methods, UI)\n"
                "### Integration Architecture\n"
                "- How LegacyGuard plugs into existing wallet/custody infrastructure\n"
                "- Data flow diagram (what data stays with partner vs LegacyGuard)\n"
                "- Non-custodial integration pattern\n\n"
                "## 4. Three MVP Variants (Scored)\n"
                "Design 3 distinct MVP approaches and score each:\n\n"
                "### MVP-A: Fastest Validation\n"
                "- What to build, target user, timeline, cost, key risk\n"
                "- Score: Speed (1-5), Revenue potential (1-5), Defensibility (1-5)\n\n"
                "### MVP-B: Strongest B2B Angle\n"
                "- What to build, target customer, timeline, cost, key risk\n"
                "- Score: Speed (1-5), Revenue potential (1-5), Defensibility (1-5)\n\n"
                "### MVP-C: Strongest Protocol-First Angle\n"
                "- What to build, target user, timeline, cost, key risk\n"
                "- Score: Speed (1-5), Revenue potential (1-5), Defensibility (1-5)\n\n"
                "### MVP Comparison Table\n"
                "| Criteria | MVP-A | MVP-B | MVP-C |\n\n"
                "## 5. Technical Architecture\n"
                "- Backend services (API gateway, liveness engine, key splitting service)\n"
                "- Storage layer (what is stored, where, encryption at rest)\n"
                "- Blockchain integrations (which chains MVP, which later)\n"
                "- Infrastructure requirements and cost estimate\n\n"
                "## 6. Supported Chains & Wallet Types (Prioritized)\n"
                "| Chain/Wallet | MVP | Phase 2 | Phase 3 | Rationale |\n\n"
                "## 7. Key UX Principles\n"
                "- How to make key splitting feel simple and safe\n"
                "- Trust-building mechanisms (transparency, audit reports, open source)\n"
                "- The 'set it and forget it' design challenge\n\n"
                "## 8. Product Roadmap (18 months)\n"
                "- Phase 1 (Month 1-3): MVP build\n"
                "- Phase 2 (Month 4-9): B2B integration + consumer improvements\n"
                "- Phase 3 (Month 10-18): Protocol layer + ecosystem\n"
            ),
            context=context,
        )

        self.store_output("product_design", analysis)
        return {"Product Design": analysis}
