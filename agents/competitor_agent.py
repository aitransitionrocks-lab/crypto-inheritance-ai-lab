"""Competitor Agent – deep competitive analysis across 7 categories."""

from __future__ import annotations

from agents.base import BaseAgent


class CompetitorAgent(BaseAgent):
    name = "competitor"
    role = "Competitive Intelligence Analyst"
    system_prompt = (
        "You are a competitive intelligence analyst for LegacyGuard, a crypto inheritance "
        "protocol and security infrastructure layer. You systematically map the competitive "
        "landscape across 7 distinct categories: direct inheritance products, multisig "
        "inheritance, wallet recovery services, institutional custody succession, estate "
        "planning software, security infrastructure providers, and protocol-based alternatives. "
        "Be objective, create structured competitive maps, and identify exploitable whitespace."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search across all 7 competitive categories
        queries: list[str] = [
            # Direct inheritance
            "Casa inheritance plan bitcoin features pricing review 2024",
            "Sarcophagus protocol crypto dead man switch on-chain",
            "Trustee wallet crypto inheritance service heir recovery",
            # Multisig inheritance
            "Gnosis Safe multisig succession key rotation recovery module",
            "Unchained Capital collaborative custody inheritance Bitcoin",
            # Wallet recovery
            "Ledger Recover seed phrase backup controversy security",
            "social recovery wallet Argent Ethereum smart contract",
            # Institutional custody
            "Fireblocks institutional custody succession policy key ceremony",
            "BitGo custody inheritance corporate key management policies",
            # Estate planning software
            "Willful Trust & Will digital estate planning crypto support",
            "estate planning software digital asset integration gap",
            # Security infrastructure
            "Lit Protocol threshold cryptography key management infrastructure",
            "Web3Auth MPC wallet infrastructure SDK provider",
            # Protocol alternatives
            "ERC-4337 account abstraction inheritance module smart wallet",
            "timelock Bitcoin script inheritance automated transfer",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape key competitor pages for deeper intelligence
        competitor_results = await self.search(
            "crypto inheritance competitor comparison 2024 features pricing"
        )
        for r in competitor_results[:4]:
            await self.scrape(r["link"])

        # 3. Deep analysis across all 7 categories
        context = self.recall(
            "crypto inheritance competitors Casa Sarcophagus Fireblocks multisig recovery "
            "Ledger Recover estate planning Lit Protocol"
        )
        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Create a comprehensive competitive landscape analysis across 7 categories.\n\n"
                "## Category 1: Direct Crypto Inheritance Products\n"
                "Companies: Casa, Sarcophagus, Trustee, Safe Haven, etc.\n"
                "For each: product description, target user, pricing, strengths, weaknesses, "
                "funding status.\n\n"
                "## Category 2: Multisig Inheritance Solutions\n"
                "Companies/projects: Gnosis Safe modules, Unchained Capital, Nunchuk, etc.\n"
                "How do multisig setups handle key-holder death/incapacity today?\n\n"
                "## Category 3: Wallet Recovery Services\n"
                "Companies: Ledger Recover, Argent social recovery, ZenGo MPC, etc.\n"
                "Overlap with inheritance? Where does recovery end and inheritance begin?\n\n"
                "## Category 4: Institutional Custody Succession\n"
                "Companies: Fireblocks, BitGo, Anchorage, Copper, etc.\n"
                "Do they offer succession features? What are the gaps?\n\n"
                "## Category 5: Estate Planning Software\n"
                "Companies: Trust & Will, Willful, FreeWill, Everplans, etc.\n"
                "Do they support crypto? How well? What's missing?\n\n"
                "## Category 6: Security Infrastructure Providers\n"
                "Companies: Lit Protocol, Web3Auth, Dfns, Fordefi, etc.\n"
                "Could they build inheritance? Are they potential partners or threats?\n\n"
                "## Category 7: Protocol-Based Alternatives\n"
                "Projects: ERC-4337 modules, Bitcoin timelocks, smart contract wills.\n"
                "What exists on-chain? How mature is it?\n\n"
                "## Competitive Map (Summary Table)\n"
                "| Company | Category | Target | Model | Funding | Threat Level | Partner Potential |\n\n"
                "## Whitespace Analysis\n"
                "Where is the competitive gap? What is NO ONE building well?\n"
                "- Infrastructure/API layer for wallet providers?\n"
                "- Cross-chain inheritance protocol?\n"
                "- White-label inheritance for custody platforms?\n"
                "- Family office-grade succession planning?\n\n"
                "## Strategic Implications for LegacyGuard\n"
                "Given this landscape, what positioning gives LegacyGuard the strongest "
                "defensible advantage? Consumer product, infrastructure layer, or protocol?\n\n"
                "Use markdown tables for all comparisons. Be specific about funding, users, "
                "traction where data exists."
            ),
            context=context,
        )

        self.store_output("competitor_landscape", analysis)
        return {"Competitor Landscape": analysis}
