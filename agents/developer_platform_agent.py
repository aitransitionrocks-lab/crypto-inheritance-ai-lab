"""Developer Platform Agent – designs APIs, SDKs, and integration flows for LegacyGuard."""

from __future__ import annotations

from agents.base import BaseAgent


class DeveloperPlatformAgent(BaseAgent):
    name = "developer_platform"
    role = "Developer Platform Architect"
    system_prompt = (
        "You are a developer platform architect who has built and scaled API platforms used by "
        "thousands of developers. You understand what makes developers adopt a platform: great "
        "docs, simple auth, fast time-to-first-integration, sandboxes, and clear value. "
        "You also understand the crypto developer ecosystem — wallet SDKs, RPC providers, "
        "and how custody/key management integrations work. Be specific about endpoints, "
        "authentication patterns, and developer experience."
    )

    async def run(self, startup_idea: str) -> dict[str, str]:
        # 1. Search for developer platform patterns
        queries = [
            "crypto API platform design best practices",
            "developer platform go-to-market strategy",
            "wallet integration SDK patterns crypto",
            "crypto developer tools API design 2024",
            "Fireblocks API design developer experience",
            "developer-first vs partner-first platform strategy",
        ]
        for q in queries:
            await self.search(q)

        # 2. Scrape top results
        results = await self.search("crypto infrastructure API platform developer experience 2024")
        for r in results[:3]:
            await self.scrape(r["link"])

        # 3. Recall prior product and partnership research
        context = self.recall(
            "developer platform API SDK integration wallet custody infrastructure partnerships"
        )

        # 4. Synthesize developer platform design
        analysis = await self.think(
            prompt=(
                f"Based on the research about the startup idea: '{startup_idea}'\n\n"
                "Design a comprehensive developer platform strategy covering:\n\n"
                "## 1. Platform Strategy\n"
                "- Developer-first vs Partner-first: which approach and why?\n"
                "- Target developer personas (wallet devs, custody engineers, DeFi builders)\n"
                "- What makes developers adopt this platform?\n\n"
                "## 2. API Design\n"
                "Define the core API surface:\n"
                "- Key API endpoints (inheritance plan CRUD, beneficiary management, "
                "trigger configuration, status/monitoring, recovery execution)\n"
                "- Authentication model (API keys, OAuth, JWT, wallet-based auth)\n"
                "- Webhooks and event model (what events, delivery guarantees, retry logic)\n"
                "- Rate limiting and pricing tiers\n"
                "- Versioning strategy\n\n"
                "## 3. SDK & Integration Design\n"
                "- SDK languages and priorities (TypeScript, Python, Rust, Go)\n"
                "- Integration flows for wallet providers\n"
                "- Integration flows for custody platforms\n"
                "- What wallet providers/custody platforms would need to adopt LegacyGuard\n"
                "  (technical requirements, compliance, security review process)\n\n"
                "## 4. Developer Experience\n"
                "- Documentation structure (quickstart, guides, API reference, examples)\n"
                "- Sandbox / testnet environment design\n"
                "- Sample apps and code examples\n"
                "- Developer onboarding flow (time to first API call < X minutes)\n\n"
                "## 5. Go-to-Market for Developers\n"
                "- Launch strategy (beta program, hackathon sponsorship, grants)\n"
                "- Developer community building\n"
                "- Success metrics (time to first integration, MAU, API calls)\n\n"
                "Structure your response in markdown with clear headers."
            ),
            context=context,
        )

        self.store_output("Developer Platform Design", analysis)
        return {"Developer Platform Design": analysis}
