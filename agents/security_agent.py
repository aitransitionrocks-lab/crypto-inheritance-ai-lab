"""Security Agent – deep dive into cryptographic architecture and trust models."""

from __future__ import annotations

from agents.base import BaseAgent


class SecurityAgent(BaseAgent):
    name = "security"
    role = "Cryptographic Security Architect"
    system_prompt = (
        "You are a cryptographic security architect for LegacyGuard, a crypto inheritance "
        "protocol and security infrastructure layer. You evaluate threshold cryptography, "
        "MPC, Shamir's Secret Sharing, timelocks, and recovery models with precision. "
        "You define trust assumptions explicitly, map attack surfaces, and distinguish "
        "between MVP-feasible and later-phase security features. You think adversarially "
        "about both technical and social engineering threats. A critical design constraint: "
        "LegacyGuard must avoid becoming a custodian at all costs."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        queries: list[str] = [
            "Shamir secret sharing vs MPC threshold signatures comparison tradeoffs",
            "timelock encryption Bitcoin CLTV CSV inheritance automated transfer",
            "threshold signature scheme FROST GG20 wallet inheritance application",
            "MPC key management non-custodial architecture design pattern",
            "social recovery wallet smart contract security audit findings",
            "crypto key management avoid custodian classification architecture",
            "dead man switch cryptographic design inactivity proof liveness",
            "attack vectors crypto inheritance service threat model analysis",
            "Lit Protocol threshold cryptography access control encryption",
            "zero knowledge proof identity verification inheritance claim",
        ]
        for q in queries:
            await self.search(q)

        context = self.recall(
            "cryptographic security Shamir MPC threshold timelock recovery "
            "custodian trust model attack surface"
        )
        analysis: str = await self.think(
            prompt=(
                f"For the startup idea: '{startup_idea}'\n\n"
                "Provide a deep security architecture analysis for an inheritance protocol "
                "and infrastructure layer.\n\n"
                "## 1. Cryptographic Primitive Comparison\n"
                "Create a detailed comparison table:\n"
                "| Approach | How It Works | Trust Assumptions | MVP Feasible? | "
                "Custody Risk | Complexity | Best For |\n"
                "Cover:\n"
                "- Shamir's Secret Sharing (SSS)\n"
                "- Multi-Party Computation (MPC / TSS)\n"
                "- Timelock encryption (Bitcoin CLTV/CSV, Ethereum timelocks)\n"
                "- Smart contract-based recovery (social recovery wallets)\n"
                "- Hybrid approaches (SSS + timelock, MPC + dead man's switch)\n\n"
                "## 2. Architecture Options (Ranked)\n"
                "Design 3 distinct architecture options:\n"
                "- **Option A: Fastest MVP** — simplest crypto, quickest to build\n"
                "- **Option B: Strongest Security** — minimal trust, maximal decentralization\n"
                "- **Option C: Best for B2B/Infrastructure** — API-first, modular, embeddable\n"
                "For each: diagram-ready description, components, trust assumptions, "
                "estimated build time.\n\n"
                "## 3. The Custodian Problem\n"
                "Critical analysis: At what point does LegacyGuard become a custodian?\n"
                "- What architectural choices create custody risk?\n"
                "- What specific designs AVOID custodian classification?\n"
                "- How do regulators (SEC, FCA, MiCA) define custody?\n"
                "- Recommended architecture to stay non-custodial.\n\n"
                "## 4. Threat Model\n"
                "For EACH attack vector, define likelihood, impact, and mitigation:\n"
                "- Insider attack (rogue employee)\n"
                "- External hack (server compromise)\n"
                "- Social engineering (fake death claim)\n"
                "- Key-holder collusion\n"
                "- Liveness failure (switch triggers prematurely)\n"
                "- Liveness failure (switch never triggers)\n"
                "- Rubber-hose attack (physical coercion)\n"
                "- Regulatory seizure / forced disclosure\n\n"
                "## 5. Trust Assumptions Matrix\n"
                "| Component | What is trusted | What is trustless | Risk if trust fails |\n\n"
                "## 6. MVP vs. Later-Phase Security Features\n"
                "| Feature | MVP (Month 1-3) | Phase 2 (Month 4-9) | Phase 3 (Month 10+) |\n"
                "Classify each feature: SSS, MPC, timelock, ZKP identity, multi-chain, "
                "hardware wallet integration, institutional key ceremony.\n\n"
                "## 7. Security Trade-offs and Recommendations\n"
                "Explicit trade-off analysis: usability vs security, speed vs decentralization, "
                "cost vs robustness. What should LegacyGuard optimize for at each stage?"
            ),
            context=context,
        )

        self.store_output("security_architecture", analysis)
        return {"Security Architecture": analysis}
