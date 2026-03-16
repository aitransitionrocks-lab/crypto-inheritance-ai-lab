"""Protocol Security Agent – deep-dives into cryptographic approaches for key recovery and inheritance."""

from __future__ import annotations

from agents.base import BaseAgent


class ProtocolSecurityAgent(BaseAgent):
    name = "protocol_security"
    role = "Cryptographic Security Architect"
    system_prompt = (
        "You are a world-class cryptographic engineer and security architect who has designed "
        "key management systems for major crypto protocols. You understand Shamir Secret Sharing, "
        "MPC, threshold signatures, timelocks, and social recovery at implementation depth. "
        "You evaluate each approach on security guarantees, trust assumptions, UX impact, and "
        "engineering complexity. Be precise, technical, and practical about MVP trade-offs."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for cryptographic approaches
        queries = [
            "MPC wallet recovery multi-party computation comparison",
            "threshold cryptography comparison Shamir vs MPC vs threshold signatures",
            "timelock smart contracts inheritance dead man switch",
            "social recovery wallets Vitalik design",
            "Shamir Secret Sharing implementation security analysis",
            "dead man's switch crypto patterns 2024",
            "MPC vs threshold signatures security trade-offs",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results for technical depth
        results = await self.search("MPC threshold cryptography wallet recovery comparison 2024")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall prior security research
        context = self.recall(
            "security cryptography key management MPC Shamir threshold signatures recovery"
        )

        # 4. Synthesize protocol security architecture
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Provide a deep protocol security architecture analysis. Go DEEPER than a "
                "general overview — this should be technically rigorous.\n\n"
                "## Cryptographic Approach Comparison\n"
                "For EACH of the following, analyze in detail:\n\n"
                "1. **Shamir Secret Sharing (SSS)**\n"
                "2. **Multi-Party Computation (MPC)**\n"
                "3. **Threshold Signatures (TSS)**\n"
                "4. **Timelock Contracts (on-chain)**\n"
                "5. **Social Recovery (Argent/Vitalik model)**\n"
                "6. **Dead Man's Switch Patterns**\n\n"
                "For each approach, cover:\n"
                "- Security guarantees (what it protects against)\n"
                "- Trust assumptions (who must be honest, what can go wrong)\n"
                "- Implementation complexity (engineering effort, libraries, auditing)\n"
                "- UX impact (what the user experiences, friction points)\n"
                "- MVP feasibility (can this ship in 3 months with a small team?)\n"
                "- Chain compatibility (EVM only? Multi-chain? Bitcoin?)\n\n"
                "## Comparison Matrix\n"
                "Create a comparison table scoring each approach on the dimensions above.\n\n"
                "## Recommended MVP Security Architecture\n"
                "- What should the MVP use and why?\n"
                "- What can wait for v2/v3?\n"
                "- What are the non-negotiable security properties for launch?\n"
                "- What audit scope is needed before launch?\n\n"
                "## Attack Vectors & Mitigations\n"
                "- Top 5 attack vectors for the recommended architecture\n"
                "- Mitigation for each\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("Protocol Security Architecture", analysis)
        return {"Protocol Security Architecture": analysis}
