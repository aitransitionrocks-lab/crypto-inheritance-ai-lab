# Test Scenarios

User test scenarios for LegacyGuard MVP validation. Each scenario represents a distinct user archetype with different motivations, technical proficiency, and trust thresholds.

---

## Scenario 1: Happy Path (Sarah, 35, Crypto-Savvy)

### User Profile
Sarah owns 2 BTC and 15 ETH across a Ledger hardware wallet and MetaMask. She is married with 2 kids (ages 3 and 6). She recently read a Twitter thread about a family that lost access to $2M in crypto after the holder died unexpectedly. The story hit close to home — she realized her husband wouldn't know how to access her crypto if something happened to her. She has been looking for a solution but hasn't found anything that doesn't require sharing her seed phrase.

### Steps

1. **Lands on LegacyGuard from a Twitter post** — Sarah sees a promoted tweet: "Don't let your crypto die with you. LegacyGuard protects your family's inheritance — without ever touching your keys." She clicks through.

2. **Reads landing page, clicks "Get Started"** — She scans the headline, reads the "How it works" section, and is reassured by the "non-custodial" messaging. She clicks the CTA within 45 seconds.

3. **Signs up with email** — Uses her personal Gmail. Sets a strong password. Verifies email. Total time: 60 seconds.

4. **Creates vault "Family Crypto"** — Names her vault, enters her Ledger's public BTC address and MetaMask ETH address. Briefly wonders if entering public addresses is safe (it is). Total time: 90 seconds.

5. **Adds husband as heir** — Enters husband's name and email. Feels a brief emotional pang — this is real. Continues. Total time: 30 seconds.

6. **Sets 90-day inactivity trigger** — Chooses 90 days as a balance between safety and convenience. Reads the explanation of what happens when it triggers. Total time: 45 seconds.

7. **Completes first check-in** — Clicks "I'm here" button. Sees confirmation and next check-in date. Total time: 10 seconds.

8. **Returns to dashboard** — Reviews her setup. Everything looks correct. Feels relieved. Bookmarks the page.

### Expected Outcome
Completes entire flow in <10 minutes. Feels relieved and empowered. Tells her husband she set something up for their crypto. May share on social media.

### Watch For
- Any hesitation at the heir step (emotional friction)
- Questions about what "vault" means (does she think it stores crypto?)
- Confusion about the trigger mechanism (does she understand it's based on her inactivity?)
- Whether she adds encrypted instructions or skips that step
- Post-setup behavior: does she explore the dashboard? Read FAQ?

### Success Indicators
- Completes all steps without external help
- Security confidence score >4/5
- Would recommend to a friend (NPS >8)
- Returns for first scheduled check-in

---

## Scenario 2: Confused User (Mike, 55, Crypto-Curious)

### User Profile
Mike bought $25K worth of Bitcoin through Coinbase 3 years ago after his son convinced him. He recently moved some to a Trezor hardware wallet (his son helped set it up) but doesn't fully understand self-custody vs. exchange custody. His financial advisor mentioned "digital asset estate planning" during their annual review, which prompted him to search online.

### Steps

1. **Arrives via Google search "crypto inheritance"** — Mike searches "what happens to my bitcoin when I die" and finds LegacyGuard in the results. He clicks through.

2. **Reads landing page — does he understand the value prop?** — He reads slowly. The term "non-custodial" confuses him. He's not sure what "dead man's switch" means. He scrolls looking for simpler language. He may leave if the page doesn't explain things clearly enough.

3. **Signs up** — If he stays, he signs up with his email. He may struggle with password requirements. Total time: 2-3 minutes.

4. **Gets confused at "vault setup" — what's a vault?** — Mike doesn't know what a "vault" is in this context. He wonders if he's supposed to transfer his Bitcoin somewhere. The term "wallet address" is unfamiliar — he knows he has a Trezor but doesn't know his public address. He may need to stop and ask his son, or he may abandon the flow.

5. **Tries to add heir but unsure if it's safe** — Mike wants to add his son but worries: "Will my son get an email now? What will it say? Is it safe to put his email here?" He reads the heir explanation text carefully.

6. **Gets stuck at trigger setup — "What's a dead man's switch?"** — The term alarms him. He doesn't understand the inactivity concept. He wonders: "What if I just forget to log in? Will it send everything to my son by accident?" He needs reassurance about false triggers and the ability to undo.

### Expected Outcome
Needs help at vault and trigger steps. May not complete setup in one session. Likely to return if he understands the concept, or abandon permanently if confused.

### Watch For
- **Language barriers:** Which terms confuse him? ("non-custodial," "vault," "dead man's switch," "wallet address," "public key")
- **Trust concerns:** Does he think LegacyGuard will access his funds? Does he worry about sharing heir email?
- **Technical barriers:** Can he find his wallet address? Does he understand the difference between public and private keys?
- **Emotional barriers:** Does the mortality framing upset him? Does he prefer softer language?
- **Support seeking:** Does he click help icons? FAQ? Chat support? Does he leave to ask someone?

### Design Implications
- Add tooltips for every technical term
- Consider a "beginner mode" with simplified language
- Add a "What is a wallet address?" help section with screenshots
- Rename "dead man's switch" to something less alarming (e.g., "safety timer" or "inactivity guardian")
- Add a "test mode" where users can see what heirs receive without actually sending

### Success Indicators
- Completes setup (even if over multiple sessions)
- Can explain how the product works in simple terms
- Doesn't feel intimidated by the technology
- Asks "can I set this up for my wife too?" (expansion signal)

---

## Scenario 3: Skeptical User (Alex, 28, DeFi Native)

### User Profile
Alex is deeply crypto-native. They hold positions across 5 chains (ETH, SOL, AVAX, ARB, BASE), use multiple DeFi protocols, and have been rugged twice. They run their own validator node. They don't trust any centralized service and view most crypto products with suspicion. They found LegacyGuard through a crypto Twitter thread and are already skeptical.

### Steps

1. **Arrives from crypto Twitter, already skeptical** — Alex clicks through with a "let me see what this scam is about" attitude. They immediately look for red flags: anonymous team? No code? Buzzwords without substance?

2. **Looks for trust signals** — Before signing up, Alex checks:
   - Is the code open source? (Looks for GitHub link)
   - Has it been audited? (Looks for audit reports)
   - Is it truly non-custodial? (Reads technical explanation)
   - Who is the team? (Looks for doxxed founders)
   - What data does LegacyGuard store? (Privacy policy)
   - Where is data stored? (Infrastructure details)

3. **Signs up only if trust signals are visible** — Alex will only create an account if they find satisfactory answers to the above. They may use a burner email initially.

4. **During vault setup, asks: "Where is my data stored?"** — Alex wants to know exactly what happens with their wallet addresses. Are they encrypted? Who has access? Can LegacyGuard be subpoenaed for this data? What happens if LegacyGuard gets hacked?

5. **At heir setup: "Can LegacyGuard access my funds?"** — Alex scrutinizes the heir notification mechanism. They want proof that LegacyGuard cannot initiate transactions, access private keys, or act as a custodian in any way.

6. **At trigger: "What if it triggers by mistake?"** — Alex is concerned about false positives. What if they go off-grid for 3 months? What if their email gets hacked and someone confirms a check-in? What's the undo mechanism?

### Expected Outcome
Will read everything on the site. Will likely search for external reviews, GitHub repos, and audit reports before committing. If trust signals are present and satisfactory, they become a strong advocate. If not, they will publicly criticize the product on Twitter.

### Watch For
- **Trust signal sufficiency:** Do the existing trust signals (non-custodial messaging, technical explanations) satisfy a crypto-native skeptic?
- **Technical depth:** Does the technical documentation go deep enough for someone who understands cryptography?
- **Open source expectations:** Is not having open source code a deal-breaker?
- **Competitive comparison:** Does Alex compare LegacyGuard to Casa, Unchained, or DIY solutions?
- **Community validation:** Does Alex look for community endorsements (Twitter, Discord, Reddit)?

### Design Implications
- Add a detailed technical architecture page explaining exactly what data is stored and how
- Publish security model documentation
- Consider open-sourcing core components (at least the encryption layer)
- Add a "Security" or "Trust" page addressing common concerns
- Include third-party endorsements or audit commitments
- Add a "What we CAN'T do" section (can't access your keys, can't move your funds)

### Success Indicators
- Creates account with real email (not burner)
- Completes setup with real wallet addresses
- Shares positive feedback publicly
- Refers other crypto-native users
- Offers to help with security review

---

## Scenario 4: Power User (Priya, 42, Family Office)

### User Profile
Priya manages a family office with $50M in diversified assets, including $8M in cryptocurrency across BTC, ETH, and several alt positions. She holds a CFA designation and sits on the boards of two crypto companies. She needs institutional-grade inheritance and succession planning that integrates with existing legal frameworks, compliance requirements, and multi-party governance structures. She found LegacyGuard through a partner referral at a family office conference.

### Steps

1. **Arrives via partner referral** — Priya visits the site after a colleague recommended it. She evaluates with an institutional lens: compliance, scalability, enterprise features, legal standing.

2. **Evaluates compliance and governance** — She looks for:
   - SOC 2 compliance or equivalent
   - Data residency and GDPR compliance
   - Audit trail for all actions
   - Multi-party approval workflows
   - Role-based access control
   - Legal documentation (ToS, privacy policy, DPA)

3. **Wants multiple vaults, multiple heirs, custom triggers** — The single-vault, single-heir MVP is immediately limiting. She needs:
   - Separate vaults for different asset classes
   - Multiple heirs with different access levels
   - Custom trigger conditions (not just inactivity)
   - Integration with legal counsel notification
   - Board member approval for trigger execution

4. **Asks about API integration** — Priya's family office uses Fireblocks for custody and has custom portfolio tracking. She needs LegacyGuard to integrate via API with existing systems.

5. **Needs legal documentation** — Before any engagement, she requires:
   - Comprehensive Terms of Service
   - Data Processing Agreement
   - Security assessment questionnaire completion
   - Insurance coverage details
   - Regulatory compliance documentation

### Expected Outcome
The MVP will not satisfy Priya's institutional requirements. However, if the core concept resonates, she represents a high-value future customer and potential design partner for the enterprise tier.

### Watch For
- **Feature gaps as deal-breakers:** Which missing features are absolute requirements vs. nice-to-haves?
- **Pricing expectations:** What would institutional-grade inheritance planning be worth? ($1K/month? $10K/year? Custom enterprise pricing?)
- **Competitive landscape:** What is she currently using? What alternatives has she evaluated?
- **Partnership potential:** Would she be willing to be a design partner for enterprise features?
- **Referral network:** Could she introduce LegacyGuard to other family offices?
- **Timeline expectations:** When does she need a solution? Is she evaluating now for implementation in 6 months?

### Design Implications
- Create an "Enterprise" or "Institutional" landing page (even before features exist)
- Add a "Contact Sales" flow for complex needs
- Document a product roadmap showing enterprise features planned
- Consider a pilot program for 2-3 family offices to co-design the enterprise tier
- Prepare a security questionnaire response template

### Success Indicators
- Expresses interest despite MVP limitations
- Agrees to a follow-up call about enterprise roadmap
- Provides specific feature requirements (design partner value)
- Offers to introduce colleagues or other family offices
- Signs up for updates or waitlist for enterprise tier

---

## Test Execution Plan

| Scenario | Test With | Method | Duration | When | Recruitment Channel |
|:---|:---|:---|:---|:---|:---|
| **Happy Path** | 5 crypto users (>$10K holdings, hardware wallet) | Screen recording + think-aloud protocol | 30 min each | Week 1 | Crypto Twitter, Reddit r/cryptocurrency |
| **Confused User** | 3 non-technical users (50+, Coinbase-only experience) | In-person guided session | 45 min each | Week 1 | Personal network, Facebook groups |
| **Skeptical User** | 3 DeFi-native users (active on-chain history) | Remote session via Discord/Twitter DM | 30 min each | Week 2 | Crypto Twitter, DeFi Discord servers |
| **Power User** | 2 financial advisors or family office managers | Structured video call interview | 60 min each | Week 2 | LinkedIn outreach, conference contacts |

### Pre-Test Checklist

- [ ] Test environment deployed and stable
- [ ] Screen recording software configured (Loom or OBS)
- [ ] Interview guide printed for moderator
- [ ] Consent form prepared and signed
- [ ] Compensation arranged ($25 gift card or equivalent crypto)
- [ ] Note-taking template ready
- [ ] Backup participants identified (in case of no-shows)

### Post-Test Analysis

After each test session:
1. Review recording within 24 hours
2. Fill out observation template (per scenario above)
3. Tag key moments: confusion, delight, frustration, trust signals
4. Rate overall success: completed / partial / abandoned
5. Identify top 3 insights and top 3 action items

After all sessions complete:
1. Cross-scenario analysis: What patterns emerge across all user types?
2. Priority matrix: Which issues affect the most users?
3. Quick wins: What can be fixed in <1 day?
4. Design decisions: What needs deeper investigation?
5. Update validation hypotheses based on observed behavior

### Metrics Summary Template

| Metric | Happy Path (n=5) | Confused (n=3) | Skeptical (n=3) | Power (n=2) |
|:---|:---|:---|:---|:---|
| Completion rate | | | | |
| Avg. time to complete | | | | |
| Trust score (1-5) | | | | |
| WTP (yes/no) | | | | |
| NPS (0-10) | | | | |
| Top friction point | | | | |
| Would recommend? | | | | |
