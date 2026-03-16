"""Legal Agent – analyzes legal exposure across provider classifications and jurisdictions."""

from __future__ import annotations

from agents.base import BaseAgent


class LegalAgent(BaseAgent):
    name = "legal"
    role = "Legal & Regulatory Analyst"
    system_prompt = (
        "You are a legal and regulatory analyst for LegacyGuard, a crypto inheritance "
        "protocol and security infrastructure layer. You analyze legal exposure differences "
        "across provider classifications: software provider, infrastructure provider, key "
        "management service, and fiduciary. You map jurisdictions, assess custody classification "
        "risk, and distinguish consumer app risk from infrastructure provider risk. "
        "You identify the critical tension between GDPR right-to-deletion and inheritance "
        "obligation. Note: You provide analysis, not legal advice."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        queries: list[str] = [
            "crypto custody definition SEC CFTC when does software become custodian",
            "MiCA regulation crypto custody service provider classification EU 2024",
            "key management service legal classification non-custodial vs custodial",
            "software provider vs financial service provider crypto regulation distinction",
            "GDPR right to deletion conflict inheritance obligation digital assets",
            "crypto inheritance service money transmitter classification FinCEN",
            "digital asset estate law RUFADAA uniform fiduciary access act by state",
            "UK FCA crypto custody regulation 2024 classification criteria",
            "Switzerland FINMA crypto inheritance legal framework DLT act",
            "fiduciary duty crypto key holder estate planning liability cases",
            "infrastructure provider SaaS legal liability crypto B2B vs B2C risk",
            "smart contract legal liability code is law jurisdiction enforceability",
        ]
        for q in queries:
            await self.search(q)

        context = self.recall(
            "legal regulatory crypto custody classification GDPR inheritance "
            "fiduciary infrastructure provider jurisdiction"
        )
        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Analyze the legal and regulatory landscape for a crypto inheritance "
                "protocol and infrastructure layer.\n\n"
                "## 1. Provider Classification Risk Matrix\n"
                "Create a comparison table analyzing LegacyGuard's legal exposure under "
                "different provider classifications:\n"
                "| Classification | Definition | Regulatory Burden | Licensing | "
                "Liability Exposure | Recommended? |\n"
                "Cover:\n"
                "- Pure software provider (SaaS tool)\n"
                "- Infrastructure provider (API/SDK for wallet companies)\n"
                "- Key management service (touches keys but non-custodial)\n"
                "- Custodian (holds or controls assets)\n"
                "- Fiduciary (acts on behalf of asset owner)\n\n"
                "## 2. Consumer App vs. Infrastructure Provider Risk\n"
                "Compare legal risk profiles:\n"
                "- B2C consumer inheritance app: What regulations apply? What licenses needed?\n"
                "- B2B infrastructure provider: How does risk change when the wallet company "
                "is the customer, not the end user?\n"
                "- Protocol layer: If LegacyGuard is a decentralized protocol, what changes?\n\n"
                "## 3. Custody Classification Deep Dive\n"
                "The critical question: Does LegacyGuard 'custody' assets?\n"
                "- SEC/CFTC custody definitions and how they apply\n"
                "- EU MiCA custody service provider definition\n"
                "- UK FCA crypto custody classification\n"
                "- Architecture choices that trigger vs avoid custody classification\n"
                "- Specific design patterns that keep LegacyGuard non-custodial\n\n"
                "## 4. Jurisdictional Map\n"
                "| Jurisdiction | Key Regulation | Custody Threshold | Inheritance Law | "
                "GDPR/Privacy | Risk Level | Recommended Entry? |\n"
                "Cover: US (federal + Delaware, Wyoming, NY), EU (MiCA), UK, Switzerland, "
                "Singapore, UAE, Cayman Islands.\n\n"
                "## 5. GDPR vs. Inheritance Obligation Tension\n"
                "Critical analysis of the conflict:\n"
                "- GDPR Article 17: Right to erasure — can a deceased person's data be deleted?\n"
                "- Inheritance law: Obligation to preserve and transfer asset access\n"
                "- How does this tension play out practically?\n"
                "- Recommended data architecture to satisfy both requirements\n"
                "- Data minimization strategy for inheritance infrastructure\n\n"
                "## 6. Liability Scenarios\n"
                "Analyze specific failure modes and legal consequences:\n"
                "- Switch triggers prematurely (owner alive, assets transferred)\n"
                "- Switch never triggers (owner dead, assets locked forever)\n"
                "- Heir disputes (multiple claimants)\n"
                "- Data breach (encrypted shares exposed)\n"
                "- Regulatory change (service becomes illegal mid-operation)\n\n"
                "## 7. Recommended Legal Strategy\n"
                "- Optimal entity structure and jurisdiction of incorporation\n"
                "- Licensing strategy (what to get, what to avoid triggering)\n"
                "- Terms of service key provisions\n"
                "- Insurance requirements and options\n"
                "- Legal advisors / firms specializing in this intersection\n\n"
                "Be specific about which architectural choices create which legal risks."
            ),
            context=context,
        )

        self.store_output("legal_strategy", analysis)
        return {"Legal Strategy": analysis}
