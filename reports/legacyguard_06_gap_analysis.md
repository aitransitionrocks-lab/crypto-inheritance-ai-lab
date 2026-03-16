# LegacyGuard — Gap Analysis: Current State vs. Target
*Generated 2026-03-16 by LegacyGuard AI Strategy Lab*

---

## Summary Table

| # | Area | Status | Current State Summary |
|---|------|--------|----------------------|
| 1 | Strategic Option Scoring | **Partial** | Protocol/infra pivot articulated but options not scored against each other with weighted criteria |
| 2 | Protocol Thesis | **Complete** | Clear zero-knowledge, self-custody-preserving protocol thesis across all reports |
| 3 | Infrastructure Thesis | **Partial** | Infrastructure layer concept present but lacks concrete API specs, SLAs, and technical architecture docs |
| 4 | Security Architecture Comparison | **Weak** | ZK and client-side encryption mentioned repeatedly; no comparison to competing architectures (Casa, Safe, Unchained) |
| 5 | Regulatory Structure Comparison | **Weak** | Regulatory need acknowledged; no jurisdiction-by-jurisdiction analysis or compliance roadmap |
| 6 | Market Wedge Recommendation | **Partial** | Consumer DMS app recommended as MVP-A; wedge strategy not clearly separated from broader GTM |
| 7 | MVP Comparison | **Complete** | Three MVPs scored on 8 criteria with clear recommendation for MVP-A |
| 8 | Partnership Prioritization | **Complete** | Two independent priority matrices (Report 04 and improved_partnership_strategy_deep) with ranked partners |
| 9 | VC Attractiveness | **Partial** | Investment memo exists with TAM/SAM/SOM and financial projections; lacks comparable term sheets and realistic risk-adjusted scenarios |
| 10 | Founder Decision Support | **Partial** | 30/60/90-day plan exists but lacks explicit decision gates, kill criteria, and conditional branching |

---

## Detailed Analysis

### 1. Strategic Option Scoring

**Status: Partial**

**Current state:** Report 01 (Executive Strategy) describes the pivot from consumer app to protocol/infrastructure layer. The rationale is well-argued qualitatively. Report 03 (MVP Recommendation) scores three MVP options on 8 dimensions using a 1-5 scale.

**Gap:** No single framework scores the full strategic option set (consumer-only vs. protocol-only vs. hybrid vs. white-label-only) against weighted business criteria (capital efficiency, time-to-revenue, defensibility, team fit). The pivot decision appears pre-made rather than formally evaluated.

**Target:** A decision matrix comparing 4-5 strategic options with 6-8 weighted criteria, sensitivity analysis on key assumptions, and a documented "why not" for each rejected option.

---

### 2. Protocol Thesis

**Status: Complete**

**Current state:** The protocol thesis -- zero-knowledge, self-custody-preserving "dead man's switch" enabling encrypted recovery instruction transfer -- is consistently articulated across Report 01, Report 02, and the improved deep-dive reports. The value proposition is clear: LegacyGuard becomes the inheritance layer that wallets, custodians, and platforms integrate.

**Gap:** Minor. The thesis could benefit from a one-page "protocol thesis statement" that can stand alone for external audiences. Currently scattered across multiple sections.

**Target:** Standalone protocol thesis document (1-2 pages) suitable for partner decks and investor one-pagers.

---

### 3. Infrastructure Thesis

**Status: Partial**

**Current state:** Report 01 describes LegacyGuard as an "infrastructure layer" with API/SDK distribution. Report 02 references B2B infrastructure revenue ($50K-$500K/year licensing). The improved GTM strategy discusses API-first distribution.

**Gap:** No technical architecture document exists. Missing: API endpoint specifications, SDK scope, integration complexity estimates, infrastructure cost modeling per partner integration, SLA definitions, and data flow diagrams. The "infrastructure" claim is strategic aspiration, not engineering reality.

**Target:** Technical architecture document with API design, SDK specifications, integration playbook (with estimated engineering hours per partner type), and infrastructure cost model.

---

### 4. Security Architecture Comparison

**Status: Weak**

**Current state:** All reports reference "zero-knowledge architecture," "client-side encryption," "AES-256-GCM," and "Shamir's Secret Sharing." Report 02 lists technical differentiators. The improved partnership strategy mentions security audit requirements from partners (SOC 2, ISO 27001).

**Gap:** No comparative analysis of LegacyGuard's security model vs. competitors. Casa uses 3-of-5 multisig with inheritance key. Unchained uses collaborative custody. Safe uses smart contract recovery. These are fundamentally different architectures with different trust models, attack surfaces, and failure modes. The reports treat LegacyGuard's security as self-evidently superior without substantiation.

**Target:** Security architecture comparison matrix: LegacyGuard vs. Casa vs. Unchained vs. Safe vs. manual seed phrase backup. Dimensions: trust model, single points of failure, attack surface, key compromise scenarios, user experience, recovery time, legal enforceability.

---

### 5. Regulatory Structure Comparison

**Status: Weak**

**Current state:** Reports mention "proactive legal compliance," "jurisdictional inheritance laws," and the need for "legal counsel." The improved market opportunity report notes regulatory momentum as a timing factor. Report 05 includes "engage estate planning attorney" in Week 1.

**Gap:** No jurisdiction-specific analysis. US (state-by-state variation in digital asset inheritance law), EU (GDPR + varying succession law), UK (different probate rules), Switzerland, Singapore -- all have materially different requirements. No analysis of whether LegacyGuard's model constitutes a "financial service," "digital vault," or "data processor" under various regulatory regimes. No compliance roadmap with milestones.

**Target:** Regulatory comparison table covering top 5 jurisdictions: classification risk, data residency requirements, inheritance law compatibility, required licenses/registrations, estimated compliance cost and timeline.

---

### 6. Market Wedge Recommendation

**Status: Partial**

**Current state:** Report 03 recommends MVP-A (consumer DMS app) as the entry wedge. The improved GTM strategy recommends a "Hybrid: Consumer-Led, Infrastructure-Ready" approach. The improved market opportunity report identifies "Prudent Hodlers" with >$10K in self-custody as the initial segment.

**Gap:** The wedge recommendation is spread across three reports with slightly different framings. No single, crisp statement of: "We enter through X segment, with Y product, at Z price point, because it gives us A advantage for the infrastructure play." The relationship between the consumer wedge and the B2B infrastructure play is implied but not explicitly modeled (e.g., how many consumer users are needed before the first B2B partner signs).

**Target:** One-page market wedge brief: entry segment, product, price, conversion path to infrastructure, and minimum thresholds for B2B pivot.

---

### 7. MVP Comparison

**Status: Complete**

**Current state:** Report 03 evaluates three MVPs (Consumer DMS App, B2B API/SDK, Multisig Plugin) across 8 criteria with a 1-5 scoring matrix. MVP-A wins with score 32/40. Includes budget ($1.5-2M), timeline (6 months), team (5-6 FTEs + part-time), and validation plan with specific metrics.

**Gap:** Minor. Could benefit from a "what we defer and why" section explicitly listing features excluded from MVP-A and the rationale for each. The budget estimate lacks a breakdown by phase.

**Target:** Add deferred-features list and phase-gated budget to existing MVP recommendation.

---

### 8. Partnership Prioritization

**Status: Complete**

**Current state:** Report 04 provides a 5-pathway priority matrix (1-5 scoring on 4 dimensions). The improved partnership strategy deep-dive provides a 7-category matrix (1-10 scoring on 5 dimensions) with specific company targets, outreach strategies, and pilot designs for the top 3 partners (Fidelity Digital Assets, Ledger, Trust & Will).

**Gap:** Minor inconsistency between the two reports. Report 04 ranks Hardware Wallets #1; the deep-dive ranks Family Offices #1 and Hardware Wallets #2. This is not addressed or reconciled. Additionally, neither report models the financial impact of partnerships (expected revenue per partner, cost of integration, break-even timeline).

**Target:** Reconcile priority rankings between the two reports with explicit rationale. Add financial model per partnership type: integration cost, expected revenue ramp, break-even point.

---

### 9. VC Attractiveness

**Status: Partial**

**Current state:** Report 02 is a full investment memo with thesis, problem quantification ($13.18B TAM), solution description, market sizing (SAM $1.977B), financial projections (Year 5: $97.7M ARR), competitive landscape, team requirements, risk factors, and ask ($5M seed). The improved market opportunity report provides segment-level TAM/SAM/SOM ($77.34M combined SOM Year 3).

**Gap:** Financial projections lack sensitivity analysis ("what if conversion is 50% lower?"). No comparable term sheet analysis (what did Casa, Unchained, Trust & Will raise, at what valuation, at what stage?). The $5M seed ask is stated without showing how it maps to specific milestones that derisk the business for Series A. Risk factors listed but not quantified or mitigated with specific actions.

**Target:** Add sensitivity table (bull/base/bear), comparable funding rounds with valuations, milestone-linked use-of-funds, and risk mitigation matrix.

---

### 10. Founder Decision Support

**Status: Partial**

**Current state:** Report 05 provides a 30/60/90-day action plan with weekly breakdowns, specific actions, outputs, and key assumptions to validate. Covers user validation, technical spec, legal strategy, MVP development, partnership outreach, and fundraising prep.

**Gap:** No explicit decision gates ("if X metric is not met by Day 30, then pivot to Y"). No kill criteria ("abandon the project if Z"). No conditional branching ("if hardware wallet partnership closes first, reprioritize MVP to SDK-first"). The plan reads as a linear execution script rather than an adaptive decision framework.

**Target:** Add decision gates at Day 30, Day 60, and Day 90 with go/no-go criteria, alternative paths, and kill conditions. Include a "decisions the founder must make" checklist with deadlines.

---

## Priority Gaps to Close

| Priority | Gap | Effort | Impact |
|----------|-----|--------|--------|
| 1 | Security architecture comparison | Medium | High -- required for partner conversations and investor due diligence |
| 2 | Regulatory structure comparison | High | High -- blocks market entry in non-US jurisdictions |
| 3 | Infrastructure technical architecture | High | High -- "infrastructure" claim is unsubstantiated without this |
| 4 | Decision gates for founder plan | Low | High -- turns linear plan into adaptive strategy |
| 5 | Strategic option scoring framework | Medium | Medium -- ensures pivot decision is defensible |
| 6 | Market wedge brief (consolidated) | Low | Medium -- eliminates cross-report confusion |
| 7 | VC sensitivity analysis and comparables | Medium | Medium -- strengthens fundraising materials |
| 8 | Partnership financial models | Medium | Medium -- needed before committing integration resources |
