"""
Central orchestrator using LangGraph to coordinate all agents.
Executes the research pipeline in a defined sequence with rate-limit-safe stages.
"""

from __future__ import annotations

import asyncio
import logging
from typing import TypedDict

from langgraph.graph import StateGraph, END

from agents import (
    ResearchAgent,
    MarketAgent,
    CompetitorAgent,
    SecurityAgent,
    ProtocolSecurityAgent,
    LegalAgent,
    RegulatoryStructureAgent,
    ProductAgent,
    ProtocolStrategyAgent,
    DeveloperPlatformAgent,
    BusinessModelAgent,
    GTMAgent,
    InfrastructurePartnershipsAgent,
    UserValidationAgent,
    VCScoringAgent,
    ReportAgent,
)
from memory.vector_store import VectorStore

logger = logging.getLogger(__name__)


class PipelineState(TypedDict):
    """Shared state flowing through the LangGraph pipeline."""
    startup_idea: str
    sections: dict[str, str]
    current_stage: str
    errors: list[str]


class Orchestrator:
    """
    Coordinates the multi-agent research pipeline.

    Pipeline stages (8 stages, 16 agents — max 2 parallel to respect rate limits):
      1. Research        (research + market — parallel)
      2. Competitor      (competitor — solo, heavy scraping)
      3. Security        (security + protocol_security — parallel)
      4. Legal           (legal + regulatory_structure — parallel)
      5. Product & Infra (product + protocol_strategy + developer_platform — sequential pairs)
      6. Business        (business_model + gtm — parallel)
      7. Validation      (infrastructure_partnerships + user_validation + vc_scoring — sequential)
      8. Report          (report — sequential)
    """

    def __init__(self) -> None:
        self.memory = VectorStore()
        self._agents = {
            "research": ResearchAgent(self.memory),
            "market": MarketAgent(self.memory),
            "competitor": CompetitorAgent(self.memory),
            "security": SecurityAgent(self.memory),
            "protocol_security": ProtocolSecurityAgent(self.memory),
            "legal": LegalAgent(self.memory),
            "regulatory_structure": RegulatoryStructureAgent(self.memory),
            "product": ProductAgent(self.memory),
            "protocol_strategy": ProtocolStrategyAgent(self.memory),
            "developer_platform": DeveloperPlatformAgent(self.memory),
            "business_model": BusinessModelAgent(self.memory),
            "gtm": GTMAgent(self.memory),
            "infrastructure_partnerships": InfrastructurePartnershipsAgent(self.memory),
            "user_validation": UserValidationAgent(self.memory),
            "vc_scoring": VCScoringAgent(self.memory),
            "report": ReportAgent(self.memory),
        }
        self._graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        g = StateGraph(PipelineState)

        g.add_node("stage_1", self._stage_1)
        g.add_node("stage_2", self._stage_2)
        g.add_node("stage_3", self._stage_3)
        g.add_node("stage_4", self._stage_4)
        g.add_node("stage_5", self._stage_5)
        g.add_node("stage_6", self._stage_6)
        g.add_node("stage_7", self._stage_7)
        g.add_node("stage_8_report", self._stage_8_report)

        g.set_entry_point("stage_1")
        g.add_edge("stage_1", "stage_2")
        g.add_edge("stage_2", "stage_3")
        g.add_edge("stage_3", "stage_4")
        g.add_edge("stage_4", "stage_5")
        g.add_edge("stage_5", "stage_6")
        g.add_edge("stage_6", "stage_7")
        g.add_edge("stage_7", "stage_8_report")
        g.add_edge("stage_8_report", END)

        return g.compile()

    # ----------------------------------------------------------- helpers
    async def _run_pair(
        self, agent_names: list[str], state: PipelineState
    ) -> PipelineState:
        """Run up to 2 agents in parallel — safe for free-tier rate limits."""
        idea = state["startup_idea"]

        async def _run_one(name: str) -> tuple[str, dict[str, str]]:
            agent = self._agents[name]
            logger.info("▶ Starting agent: %s", agent.name)
            try:
                result = await agent.run(idea)
                logger.info("✓ Completed agent: %s", agent.name)
                return name, result
            except Exception as exc:
                logger.error("✗ Agent %s failed: %s", name, exc)
                state["errors"].append(f"{name}: {exc}")
                return name, {}

        tasks = [_run_one(n) for n in agent_names]
        results = await asyncio.gather(*tasks)

        for _, sections in results:
            state["sections"].update(sections)

        return state

    async def _run_sequential(
        self, agent_names: list[str], state: PipelineState
    ) -> PipelineState:
        """Run agents one at a time — safest for rate limits."""
        idea = state["startup_idea"]
        for name in agent_names:
            agent = self._agents[name]
            logger.info("▶ Starting agent: %s", agent.name)
            try:
                result = await agent.run(idea)
                state["sections"].update(result)
                logger.info("✓ Completed agent: %s", agent.name)
            except Exception as exc:
                logger.error("✗ Agent %s failed: %s", name, exc)
                state["errors"].append(f"{name}: {exc}")
        return state

    # ----------------------------------------------------------- stages
    async def _stage_1(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 1: Research Foundation ═══")
        state["current_stage"] = "research"
        return await self._run_sequential(["research", "market"], state)

    async def _stage_2(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 2: Competitor Analysis ═══")
        state["current_stage"] = "competitor"
        return await self._run_sequential(["competitor"], state)

    async def _stage_3(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 3: Security Deep Dive ═══")
        state["current_stage"] = "security"
        return await self._run_sequential(["security", "protocol_security"], state)

    async def _stage_4(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 4: Legal & Regulatory ═══")
        state["current_stage"] = "legal"
        return await self._run_sequential(["legal", "regulatory_structure"], state)

    async def _stage_5(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 5: Product & Infrastructure Design ═══")
        state["current_stage"] = "product_infra"
        return await self._run_sequential(
            ["product", "protocol_strategy", "developer_platform"], state
        )

    async def _stage_6(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 6: Business & GTM Strategy ═══")
        state["current_stage"] = "business"
        return await self._run_sequential(["business_model", "gtm"], state)

    async def _stage_7(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 7: Validation, Partnerships & Scoring ═══")
        state["current_stage"] = "validation"
        return await self._run_sequential(
            ["infrastructure_partnerships", "user_validation", "vc_scoring"], state
        )

    async def _stage_8_report(self, state: PipelineState) -> PipelineState:
        logger.info("═══ Stage 8: Report Generation ═══")
        state["current_stage"] = "report"
        report = self._agents["report"]
        try:
            result = await report.run(state["startup_idea"])
            state["sections"].update(result)
            logger.info("✓ Reports generated")
        except Exception as exc:
            logger.error("✗ Report generation failed: %s", exc)
            state["errors"].append(f"report: {exc}")
        return state

    # ----------------------------------------------------------- public API
    async def run(self, startup_idea: str) -> PipelineState:
        """Execute the full research pipeline."""
        initial_state: PipelineState = {
            "startup_idea": startup_idea,
            "sections": {},
            "current_stage": "init",
            "errors": [],
        }

        logger.info("Starting pipeline for: %s", startup_idea)
        self.memory.clear()

        final_state = await self._graph.ainvoke(initial_state)

        if final_state["errors"]:
            logger.warning("Pipeline completed with %d errors", len(final_state["errors"]))
        else:
            logger.info("Pipeline completed successfully")

        return final_state
