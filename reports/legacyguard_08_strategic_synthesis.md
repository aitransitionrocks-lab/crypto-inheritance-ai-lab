# LegacyGuard: Final Strategic Synthesis
*Decision Memo for Founders & Investors — 2026-03-16*

---

## 1. Core Thesis

Crypto inheritance is an infrastructure problem masquerading as a consumer problem. The $500B+ in at-risk digital assets will not be protected by yet another SaaS app that users forget to check into — it will be protected by an inheritance protocol embedded where users already manage their keys. LegacyGuard should be the cryptographic plumbing layer that wallet providers, custodians, and wealth managers plug into, not the brand that end-users interact with directly.

## 2. Primary Customer: B2B — Hardware and Software Wallet Providers

**The hard choice:** The MVP report recommends starting with a consumer app (MVP-A). We disagree. The consumer path is a trap for this specific product category. Here is why:

- **Trust bootstrapping is brutal in D2C crypto security.** A new, unknown company asking users to entrust their seed phrase recovery instructions requires years of reputation-building. Wallet providers like Ledger and Trezor already have that trust. Borrowing their trust through integration is 10x faster than building it from scratch.
- **The "dead man's switch" has a fatal retention problem.** Consumer churn will be extreme because the product delivers value only at death — users have no daily engagement loop. A B2B infrastructure model bills annually per integration, not per fickle consumer.
- **Unit economics favor B2B.** A single Ledger integration reaching 5M users at $1/user/year revenue share generates $5M ARR — equivalent to 25,000 individual $199 subscriptions, which would take years of costly D2C acquisition to reach.

**The consumer app should exist only as a reference implementation and proof-of-concept** to demonstrate the protocol to B2B partners, not as the primary revenue vehicle.

## 3. Best Market-Entry Wedge: Hardware Wallet Companion Integration (Ledger First)

**Why Ledger specifically:**
- Ledger Live already has an app/plugin ecosystem (Ledger Live Discover) that accepts third-party integrations — the integration path exists today.
- Ledger's user base (6M+ active devices) skews toward long-term holders with meaningful balances — exactly the demographic that worries about inheritance.
- Ledger has publicly expressed interest in expanding beyond key storage into broader financial services.
- A co-branded "Ledger Legacy" feature within Ledger Live would give LegacyGuard instant credibility that no amount of marketing spend could buy.

**Why not family offices first (as the partnership report suggests):** Family offices scored highest on the partnership matrix, but they are a terrible *first* move. They require SOC 2, proven track record, and long enterprise sales cycles. You cannot close Fidelity Digital Assets with a slide deck and zero deployed users. You need a live product with security audits first. Wallet integration gets you there.

## 4. Why Protocol + Infrastructure > Simple SaaS

- **Network effects and lock-in.** Once LegacyGuard's protocol is embedded in 5+ major wallets, switching costs for partners become enormous and the protocol becomes a de facto standard. A SaaS app has zero network effects — every user is an independent churn risk.
- **Regulatory moat.** As jurisdictions begin mandating digital asset succession planning (EU MiCA follow-on legislation is already signaling this), the compliance burden falls on wallet providers and custodians — who will need a certified inheritance infrastructure partner, not a consumer app.
- **Capital efficiency.** Infrastructure companies command 15-25x revenue multiples vs. 8-12x for SaaS. For the same $10M ARR, a protocol/infra positioning yields a $150-250M valuation vs. $80-120M for a consumer SaaS.

## 5. What Should Remain Centralized

- **Heir identity verification (KYC).** This requires regulated third-party providers (Persona, Onfido) and cannot be meaningfully decentralized without sacrificing legal enforceability.
- **Inactivity detection / proof-of-life monitoring.** Reliable multi-channel liveness checks (email, push, SMS, on-chain activity monitoring) require centralized orchestration to avoid false positives that could prematurely trigger inheritance.
- **Encrypted data storage.** Zero-knowledge encrypted vaults should be hosted on auditable, redundant cloud infrastructure (AWS/GCP with geographic distribution), not on-chain where storage costs are prohibitive and data permanence creates GDPR conflicts.
- **Customer support and dispute resolution.** Heir disputes, contested triggers, and edge cases require human judgment and legal process — these cannot be automated on-chain.
- **Billing, partner management, and API gateway.** Standard business infrastructure.

## 6. What May Become Decentralized Later

- **Trigger verification via smart contracts.** Once the protocol is proven, on-chain attestation of inactivity (using oracle networks like Chainlink) could make the trigger mechanism trust-minimized and auditable.
- **Encrypted shard distribution.** Shamir's Secret Sharing shards could be distributed across a decentralized storage network (e.g., IPFS/Filecoin or Arweave) for censorship resistance, once the user base justifies the complexity.
- **Governance of protocol parameters.** If LegacyGuard achieves protocol status, a DAO-like governance structure for setting standards (trigger timeframes, verification requirements) could increase ecosystem trust.
- **Heir credential issuance.** Decentralized identity (DID) standards could eventually replace centralized KYC for heir verification in crypto-native contexts.

## 7. Security Architecture Direction

**Recommendation: Client-side encryption with Shamir's Secret Sharing (SSS), hosted zero-knowledge vault, NO on-chain storage of sensitive data.**

Specific architecture:
- All recovery instructions encrypted client-side using AES-256-GCM with a user-derived Master Recovery Key (MRK).
- The MRK is split via 2-of-3 Shamir's Secret Sharing: one shard held by the user (offline backup), one shard held by LegacyGuard (encrypted at rest, released only after heir KYC + trigger verification), one shard held by a designated trusted third party (estate attorney, family member, or partner wallet provider).
- LegacyGuard NEVER possesses the ability to decrypt user data unilaterally. This is the single most important trust guarantee and must be independently auditable.
- All cryptographic libraries must be open-source and formally audited (prioritize libsodium/NaCl).
- **First security audit by Trail of Bits or NCC Group is non-negotiable before any partner integration or public launch.** Budget $200-300K.

**What we explicitly reject:** Fully on-chain inheritance smart contracts as the primary mechanism. They are too rigid, too expensive, create permanent public records, and cannot handle the edge cases (contested heirs, legal holds, multi-jurisdictional probate) that real inheritance involves. On-chain components should be limited to optional trigger attestation.

## 8. Legal Positioning Direction

**Recommendation: Position as a "secure information relay" — not a fiduciary, custodian, or estate executor.**

- LegacyGuard transmits encrypted data to verified heirs. It does not hold assets, execute trades, or make inheritance decisions. This is a critical legal distinction that avoids fiduciary liability, custody regulations (no money transmitter licensing), and executor obligations.
- **Jurisdiction: Incorporate in Delaware (US) with a Swiss or Liechtenstein subsidiary** for the protocol entity. This provides US investor/partner familiarity plus European regulatory credibility for the protocol layer.
- Terms of service must explicitly disclaim that LegacyGuard is NOT a legal estate plan and must recommend users also execute traditional wills that reference their LegacyGuard instructions.
- **Patent strategy:** File provisional patents on the specific combination of inactivity detection + SSS-based encrypted relay + multi-party heir verification. This creates defensive IP even if the protocol is open.
- Engage a specialized crypto-estate law firm (e.g., Anderson Kill, Debevoise & Plimpton digital assets practice) on retainer from day one.

## 9. Monetization Logic

**Primary model: B2B infrastructure licensing (70% of projected revenue)**
- Annual licensing fee per partner integration: $50K-$500K depending on partner size and user volume.
- Per-user-per-year revenue share: $1-$3 per protected user account, paid by the partner (who may pass cost to users as a premium feature or absorb it for retention).
- Target: 10 partner integrations by Year 3 = $5-7M ARR from B2B alone.

**Secondary model: Direct consumer subscriptions (30% of projected revenue)**
- "Guardian" plan at $199/year for users who come through direct channels or whose wallets don't yet integrate LegacyGuard.
- Serves primarily as a demand signal and proof-of-concept, not as the growth engine.
- Target: 10,000-15,000 direct subscribers by Year 3 = $2-3M ARR.

**Why not freemium:** Inheritance security is a high-trust, high-stakes product. Free tiers signal low value and attract users who won't convert. Premium-only from day one signals seriousness and filters for users with meaningful assets to protect.

## 10. Best Partnership Path (Top 3 Specific Companies)

**1. Ledger (Hardware Wallet — Priority #1)**
- **Why first:** Existing plugin ecosystem (Ledger Live Discover), security-conscious user base, 6M+ active devices, clear product gap. Ledger has no native inheritance feature.
- **Approach:** Fund the full integration, co-fund a joint security audit, offer 1,000 Ledger users free 1-year access as a pilot.
- **Timeline:** 6-9 months to pilot launch.

**2. Trust & Will (Estate Planning Platform — Priority #2)**
- **Why second:** Fastest integration path (3-6 months), natural product synergy (their users already think about estate planning), $25M+ funded with established user base. They lack any crypto module.
- **Approach:** Revenue-share model, API integration linking LegacyGuard plans to Trust & Will estate documents, co-funded marketing campaign.
- **Timeline:** 3-6 months to live integration.

**3. Casa (Multisig Provider — Priority #3)**
- **Why third:** Casa already offers Bitcoin inheritance but only for their own multisig setup. LegacyGuard's protocol could extend their coverage to non-Casa assets, making it a complement rather than a competitor. Casa's user base ($20M+ raised, premium-priced at $250+/year) is the exact target demographic.
- **Approach:** Position as "inheritance for everything else" — Casa handles their multisig keys, LegacyGuard handles broader recovery instructions, exchange credentials, DeFi positions.
- **Timeline:** 6-12 months.

## 11. Strongest MVP: B2B-Ready Inheritance SDK with Consumer Reference App

**One clear choice: Build the SDK first, wrap a consumer app around it second.**

**MVP Specification:**

| Component | Detail |
|:---|:---|
| **Core deliverable** | LegacyGuard Inheritance SDK (TypeScript/Rust) with REST API |
| **SDK capabilities** | Client-side AES-256-GCM encryption, Shamir's Secret Sharing (2-of-3), inactivity trigger configuration, heir designation, KYC webhook integration, encrypted shard storage/retrieval |
| **Reference app** | Web application ("Guardian" plan) demonstrating full SDK capabilities for individual users |
| **Target user for reference app** | Self-custody crypto holders, 30-55, $10K+ in crypto, US/EU |
| **Key features** | Secure account creation (2FA mandatory), client-side encrypted instruction upload, 2 beneficiaries, configurable dead man's switch (weekly/monthly/quarterly), heir KYC via Persona, multi-factor verified shard release |
| **What is NOT in MVP** | Mobile apps, on-chain triggers, M-of-N heir rules, passive proof-of-life, multi-language support |
| **Team** | 1 founder/PM, 1 lead security engineer, 2 full-stack devs, 1 UI/UX designer, part-time legal counsel |
| **Timeline** | 6 months (months 1-2: SDK core + crypto, months 3-4: reference app + KYC integration, month 5: security audit + closed beta, month 6: public launch) |
| **Budget** | $1.5-2M (including $200-300K mandatory security audit) |
| **Success metric** | 500 active consumer users AND 2 signed LOIs from wallet/platform partners within 3 months of launch |

**Why this beats a pure consumer app:** The SDK is the real product. The consumer app is a demo. When Ledger's Head of Product asks "show me how it works," you open the reference app. When they ask "how do we integrate," you hand them the SDK docs. Building SDK-first costs maybe 20% more than app-first but makes the B2B pivot instant instead of requiring a 6-month rebuild.

## 12. Top 5 Founder Next Moves

1. **Hire the lead security engineer first (Week 1-4).** This person defines everything — the encryption architecture, the SSS implementation, the audit scope. Without a world-class cryptographer, nothing else matters. Source from Trail of Bits alumni, Protocol Labs, or the Signal Foundation. Budget $200-250K/year.

2. **Engage Ledger's partnership team with a concrete integration proposal (Week 4-8).** Do not wait for a finished product. Present the architecture, the SDK roadmap, the co-funded audit plan, and the pilot design. Get a non-binding LOI or at minimum a named technical contact for integration planning. Warm intro via a shared VC or through Ledger's developer relations.

3. **Secure a $3-4M seed round with crypto-infra-focused VCs (Week 1-12).** Target Paradigm, a16z Crypto, Polychain, or Placeholder. The pitch is "Stripe for crypto inheritance" — infrastructure that every wallet needs but none will build in-house. The $77M Year-3 SOM across segments, combined with a live SDK and a Ledger LOI, is a fundable story.

4. **Commission the Trail of Bits / NCC Group security audit the moment the SDK core is code-complete (Month 4).** Do not delay this. Every week without an audit is a week you cannot show partners a clean security report. This is the single biggest trust accelerant.

5. **File a provisional patent on the inactivity-triggered SSS encrypted relay mechanism (Week 4-6).** Cost: $5-10K with a patent attorney. This buys 12 months of protection while you build, and signals to investors and partners that you take IP seriously. Even if the protocol eventually becomes open, the patent prevents competitors from patenting the same approach and blocking you.

---

## Go/No-Go Assessment

| Criteria | Score (1-10) | Evidence |
|:---|:---|:---|
| **Market Size** | 8 | $7B SAM across segments, $77M realistic 3-year SOM. Consumer TAM of $65.9B is inflated but the B2B infrastructure opportunity ($37.5M SAM for wallet/custody providers alone) is real and growing at 20-30% annually. |
| **Timing** | 9 | 659M crypto owners, aging early adopter demographic, EU MiCA driving compliance requirements, no dominant incumbent. The window is open now but will close within 2-3 years as wallet providers build in-house or a competitor emerges. |
| **Defensibility** | 7 | Protocol/infrastructure positioning creates switching costs and potential standards-setting power. Shamir's SSS + zero-knowledge vault architecture is technically complex to replicate well. First-mover advantage in partner integrations is real. Weakness: no hard technology moat — defensibility comes from execution speed and partner lock-in, not patents. |
| **Execution Complexity** | 5 | Cryptographic security is unforgiving — one implementation error and the company is dead. B2B sales cycles with security-conscious wallet companies are 6-12 months. Multi-jurisdictional legal compliance is genuinely hard. This is not a "two founders in a garage" product; it requires serious engineering talent from day one. |
| **Regulatory Risk** | 6 | "Secure information relay" positioning avoids the worst regulatory traps (not a custodian, not a money transmitter, not a fiduciary). But: crypto regulation is a moving target, GDPR right-to-deletion conflicts with inheritance data retention, and some jurisdictions may try to classify inheritance triggers as financial services. Manageable but requires ongoing legal investment. |
| **Funding Feasibility** | 7 | Crypto infrastructure is a proven VC thesis (Fireblocks raised $550M, Casa $20M+, Unchained $150M+). The "Stripe for crypto inheritance" pitch is clean and fundable. Weakness: current crypto market sentiment and the niche-sounding category may require more education for generalist investors. Crypto-native VCs are the right target. |

**Weighted Average: 7.0 / 10**

---

## Final Verdict: Conditional Build

**Build — but only if these three conditions are met within 90 days:**

1. **A lead security engineer with proven cryptographic implementation experience is hired or committed.** Without this person, the product cannot be built safely. If you cannot find this hire in 90 days, the project should be paused — not abandoned, but paused until this role is filled. Shipping insecure crypto inheritance software is worse than shipping nothing.

2. **At least one wallet provider (Ledger, Trezor, or Exodus) provides a written signal of integration interest** (LOI, named technical contact, or formal pilot agreement). If zero wallet providers will take a meeting after 90 days of outreach, the B2B thesis is wrong and you should either pivot to pure consumer (lower conviction) or walk away.

3. **A credible path to $3M+ in seed funding is established** (term sheet, strong verbal commitment from a lead investor, or acceptance into a top-tier crypto accelerator). The product cannot be built safely for less than $1.5M, and underfunded security products are dangerous products.

**If all three conditions are met: build aggressively.** The market is real, the timing is right, the problem is acute and growing, and the infrastructure positioning creates a durable business. LegacyGuard has the potential to become the default inheritance layer for the crypto ecosystem — but only if it is built with the right team, the right partners, and the right level of security rigor from day one.

**If any condition is not met: do not proceed.** This is not a product that can be "lean startup"-ed with duct tape and good intentions. People's generational wealth is at stake. Either build it right or don't build it.
