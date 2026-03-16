"""GTM Agent – designs go-to-market for infrastructure/protocol model with partnership-first distribution."""

from __future__ import annotations

from agents.base import BaseAgent


class GTMAgent(BaseAgent):
    name = "gtm"
    role = "Growth & Partnership Strategist"
    system_prompt = (
        "You are a go-to-market strategist for LegacyGuard, a crypto inheritance protocol "
        "and security infrastructure layer. You design GTM for infrastructure and protocol "
        "models, not just consumer apps. Your focus is partnership-first distribution: "
        "hardware wallets, wallet apps, multisig providers, custody providers, exchanges, "
        "family offices, and estate planners. You define integration paths, pilot offers, "
        "and prioritize partnership pathways by impact and feasibility."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        queries: list[str] = [
            "B2B infrastructure GTM strategy crypto fintech partnership distribution",
            "hardware wallet partnerships Ledger Trezor integration program developer",
            "wallet app SDK integration partnership crypto security modules",
            "custody provider partnership program Fireblocks BitGo integration",
            "crypto exchange partnership white-label security features",
            "family office crypto service provider selection RFP process",
            "estate planning attorney digital asset specialist referral network",
            "developer relations crypto infrastructure adoption strategy",
            "crypto B2B pilot program design enterprise sales cycle shorten",
            "protocol adoption strategy Web3 infrastructure developer community",
        ]
        for q in queries:
            await self.search(q)

        context_parts: list[str] = [
            self.recall("market opportunity segments B2B consumer family office"),
            self.recall("product design API SDK white-label MVP variants"),
            self.recall("competitor landscape whitespace partnership potential"),
            self.recall("business model revenue strategy B2B API licensing"),
        ]
        context = "\n\n---\n\n".join(context_parts)

        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Design the go-to-market strategy for an infrastructure/protocol model "
                "with partnership-first distribution.\n\n"
                "## 1. Top 5 Partnership Pathways (Ranked)\n"
                "For EACH pathway, define:\n"
                "- Partner type and specific target companies\n"
                "- Value proposition TO the partner (why they integrate)\n"
                "- Integration complexity (Low / Medium / High)\n"
                "- Revenue model with partner\n"
                "- Timeline to first integration\n"
                "- Pilot offer (what LegacyGuard offers to close the first deal)\n\n"
                "### Pathway 1: Hardware Wallet Manufacturers\n"
                "Targets: Ledger, Trezor, Keystone, Foundation Devices\n\n"
                "### Pathway 2: Software Wallet Apps\n"
                "Targets: MetaMask, Trust Wallet, Phantom, Exodus, BlueWallet\n\n"
                "### Pathway 3: Multisig / Shared Custody Providers\n"
                "Targets: Gnosis Safe, Unchained Capital, Nunchuk, BitGo\n\n"
                "### Pathway 4: Institutional Custody Platforms\n"
                "Targets: Fireblocks, Anchorage, Copper, Qredo\n\n"
                "### Pathway 5: Family Offices & Wealth Managers\n"
                "Targets: Crypto-native family offices, wealth advisory firms\n\n"
                "### Partnership Pathway Scorecard\n"
                "| Pathway | Impact (1-10) | Feasibility (1-10) | Speed (1-10) | "
                "Revenue (1-10) | Priority Score |\n\n"
                "## 2. Secondary Distribution Channels\n"
                "- Estate planning attorney networks\n"
                "- Crypto exchanges (Coinbase, Kraken, Binance inheritance features)\n"
                "- Insurance companies (crypto insurance riders)\n"
                "- Accounting firms with crypto practices\n"
                "- DeFi protocols (DAO treasury succession)\n\n"
                "## 3. Consumer GTM (Parallel Track)\n"
                "Even if infrastructure-first, there may be a direct consumer channel:\n"
                "- Target audience and persona\n"
                "- Positioning and messaging\n"
                "- Content strategy (the 'lost crypto' narrative)\n"
                "- Community building (crypto-native channels)\n"
                "- SEO / content marketing opportunities\n\n"
                "## 4. Developer Relations Strategy\n"
                "If LegacyGuard is infrastructure, developer adoption matters:\n"
                "- Documentation and developer experience\n"
                "- Hackathon and grant program\n"
                "- Open-source components strategy\n"
                "- Developer community channels\n\n"
                "## 5. Integration Playbook\n"
                "Step-by-step process for onboarding a new wallet/custody partner:\n"
                "1. Initial outreach and value proposition\n"
                "2. Technical assessment and integration scope\n"
                "3. Pilot program structure (duration, success criteria)\n"
                "4. Commercial terms negotiation\n"
                "5. Integration support and go-live\n"
                "6. Co-marketing and case study\n\n"
                "## 6. Pilot Offer Design\n"
                "What does LegacyGuard offer to close the first 3-5 integration partners?\n"
                "- Free integration period?\n"
                "- Revenue share instead of upfront fees?\n"
                "- Custom development?\n"
                "- Co-branded launch?\n\n"
                "## 7. Trust & Credibility Building\n"
                "For infrastructure, trust is everything:\n"
                "- Security audit strategy (which firms, when)\n"
                "- Open-source credibility\n"
                "- Advisory board composition\n"
                "- Insurance and guarantees\n\n"
                "## 8. Key Metrics & KPIs\n"
                "- Partnership pipeline metrics\n"
                "- Integration metrics (time to integrate, API calls)\n"
                "- End-user adoption through partners\n"
                "- Revenue per partner\n\n"
                "## 9. 90-Day Launch Plan\n"
                "Week-by-week plan focused on closing first partnerships:\n"
                "- Weeks 1-4: Outreach and pipeline building\n"
                "- Weeks 5-8: Pilot negotiations and technical prep\n"
                "- Weeks 9-12: First integration live + case study\n"
            ),
            context=context,
        )

        self.store_output("gtm_strategy", analysis)
        return {"Go-To-Market Strategy": analysis}
