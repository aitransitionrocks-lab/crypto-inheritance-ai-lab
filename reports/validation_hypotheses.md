# Validation Hypotheses

A structured set of hypotheses to validate before and during LegacyGuard MVP development. Each hypothesis includes a clear statement, test method, success criteria, failure signal, and priority level.

---

## H1: Users Trust a Non-Custodial Inheritance Service

**Statement:** Crypto holders will trust a third-party service with their inheritance planning, provided the service is clearly non-custodial and never touches their private keys.

**Test Method:** Create a landing page explaining LegacyGuard's value proposition and non-custodial approach. Drive targeted traffic (crypto communities, Twitter ads, Reddit) and measure the visitor-to-signup conversion rate.

**Success Criteria:** >5% visitor-to-signup conversion rate. Qualitative feedback mentions "trust," "non-custodial," or "secure" positively.

**Failure Signal:** <1% conversion rate. Trust objections dominate feedback (e.g., "How do I know you won't steal my keys?", "I don't trust any third party"). Users bounce within 10 seconds of landing.

**Priority:** CRITICAL — If users don't trust the fundamental premise, nothing else matters. This hypothesis must be validated before any significant development investment.

**Analysis:** Trust is the foundational barrier in crypto. Users who have adopted self-custody have explicitly chosen to remove third parties from their security model. LegacyGuard must convincingly demonstrate that it operates outside their key management entirely. The landing page must lead with non-custodial proof, not features.

---

## H2: Users Complete the Full Setup Flow

**Statement:** Users who sign up will complete the entire 5-step setup flow (signup, vault creation, heir addition, trigger configuration, first check-in) without abandoning.

**Test Method:** Implement full funnel tracking from signup through each step. Track completion rates, time spent per step, and drop-off points. Use session recordings (Hotjar free tier) to observe behavior.

**Success Criteria:** >40% of users who start signup complete all 5 steps. Average setup time <10 minutes.

**Failure Signal:** >70% drop off at the vault or heir step. Average setup time >20 minutes. High back-button usage or rage clicks detected.

**Priority:** CRITICAL — A product that users sign up for but never fully set up delivers zero value. The setup flow is the product for MVP purposes.

**Analysis:** Each step in the flow introduces a new concept and a new commitment. The vault step requires users to think about their holdings. The heir step requires them to name a real person. The trigger step forces them to confront their own mortality timeline. Any of these could cause emotional friction beyond mere UX friction. The flow must be designed to feel progressive and empowering, not burdensome.

---

## H3: Users Understand the Dead Man's Switch Concept

**Statement:** Users will intuitively understand how the inactivity-based trigger works — that if they stop checking in for a defined period, the system assumes they are incapacitated and notifies their heir.

**Test Method:** Post-setup survey asking users to explain in their own words how LegacyGuard works. Include the question: "Can you explain what happens if you stop checking in?" Supplement with in-app comprehension checks.

**Success Criteria:** >70% of surveyed users can correctly explain the mechanism without prompting. Users use terms like "if I stop responding," "timer," "automatic notification."

**Failure Signal:** >40% of users are confused about what happens when the trigger fires. Common misconceptions include: "LegacyGuard sends my keys," "My crypto gets transferred automatically," or "I have to die for it to work."

**Priority:** HIGH — Misunderstanding the core mechanism leads to either false confidence (thinking it does more than it does) or unnecessary fear (thinking it's riskier than it is). Both erode trust and retention.

**Analysis:** The term "dead man's switch" is evocative but potentially alarming. Alternative framing like "inactivity guardian" or "safety timer" may test better. The key insight to validate is whether the concept itself resonates or whether the specific terminology matters more than expected.

---

## H4: Users Are Willing to Pay

**Statement:** Users who complete setup and experience the product will demonstrate willingness to pay for ongoing protection.

**Test Method:** After users complete setup and have used the product for at least 7 days, show a pricing page with 2-3 options. Track page views, time spent, and click-through on "Subscribe" or "Buy" buttons. Do not actually charge — capture intent only.

**Success Criteria:** >10% of users who see the pricing page click a purchase button. Qualitative feedback suggests price points between $5-20/month are acceptable.

**Failure Signal:** <3% click-through at any price point. Feedback consistently says "this should be free" or "I'd never pay for this." Users who see pricing immediately churn.

**Priority:** HIGH — Willingness to pay validates that the product delivers enough perceived value to sustain a business. However, this is secondary to proving trust and usability first.

**Analysis:** Crypto users are accustomed to free tools and open-source solutions. The willingness to pay for inheritance planning signals that the pain point is severe enough to overcome the "free or nothing" mentality. Testing multiple price points ($5/mo, $10/mo, $50/year, $99 lifetime) will help identify the optimal model. A one-time payment may resonate better with users who distrust subscriptions ("what if the company disappears?").

---

## H5: Users Actually Check In Regularly

**Statement:** Users will consistently respond to check-in reminders and maintain their active status over time, demonstrating ongoing engagement with the product.

**Test Method:** Track check-in compliance over 30 days. Measure: response rate to email reminders, time between reminder and check-in, users who miss a check-in window, users who return after missing.

**Success Criteria:** >60% of users check in within their designated reminder window. Average response time <24 hours after reminder. <10% of users go completely silent (potential false trigger risk).

**Failure Signal:** >50% miss their first check-in. >30% never check in again after initial setup. High rate of accidental trigger activations.

**Priority:** MEDIUM — Check-in behavior is essential for the product to function but can be iterated on post-launch. Poor check-in rates may indicate UX issues rather than product-market fit problems.

**Analysis:** Check-in fatigue is a real risk. A 90-day cycle means users only need to check in ~4 times per year, which is manageable. However, users may forget about the product entirely between check-ins. The reminder system (frequency, channel, tone) will be critical. Consider: email, push notifications (future), SMS (future). The reminder must feel helpful, not nagging.

---

## H6: Users Invite Real Heirs (Not Fake Emails)

**Statement:** Users will add legitimate heir email addresses (real family members or trusted contacts) rather than placeholder or fake emails.

**Test Method:** Track heir email delivery rate and open rate. Monitor for obvious fake patterns (test@test.com, random strings, disposable email domains). Follow up with heir-side engagement metrics.

**Success Criteria:** >50% of heir notification emails are opened. <10% of heir emails bounce or use disposable domains. Heirs who open emails spend >30 seconds reading.

**Failure Signal:** <20% of heir emails are opened. >30% bounce or use disposable domains. Users are adding fake emails to "test" the system without committing.

**Priority:** MEDIUM — Fake heir emails indicate that users are exploring but not committing. This could mean they don't trust the system enough to involve real family, or they want to test before committing. Either way, it signals incomplete activation.

**Analysis:** The heir step is emotionally loaded. Adding a real person's email means acknowledging mortality and involving a family member in a potentially uncomfortable conversation. Some users may prefer to "set it up" with a fake email first and update later. The product should accommodate this behavior pattern while encouraging real heir addition.

---

## H7: The "Lost Crypto" Narrative Drives Viral Sharing

**Statement:** Content about lost cryptocurrency (stories of families losing access, statistics on dormant wallets) will drive organic sharing and awareness of LegacyGuard.

**Test Method:** Create 5-10 social media posts about lost crypto (statistics, stories, scenarios). Track engagement metrics: shares, retweets, comments, click-throughs to landing page. Test across Twitter/X, Reddit (r/cryptocurrency, r/Bitcoin), and crypto Discord servers.

**Success Criteria:** >2% share rate on social posts. >500 organic impressions per post. At least 1 post achieves >50 shares. Measurable traffic to landing page from social content.

**Failure Signal:** No engagement despite quality content. <0.5% share rate. Comments are dismissive ("just write it down") rather than engaged. Zero viral moments in 30 days.

**Priority:** MEDIUM — Viral growth would accelerate user acquisition but is not required for MVP validation. Paid acquisition can supplement if organic fails.

**Analysis:** The lost crypto narrative is emotionally compelling and data-rich. An estimated 3-4 million BTC are lost forever. Stories of families unable to access deceased relatives' crypto regularly make news. This narrative aligns perfectly with LegacyGuard's value proposition and should resonate deeply with the target audience.

---

## H8: Wallet Providers See Integration Value

**Statement:** Hardware and software wallet providers will see strategic value in partnering with LegacyGuard to offer inheritance planning as an integrated feature for their users.

**Test Method:** Cold outreach to 10 product managers at major wallet providers (Ledger, Trezor, MetaMask, Trust Wallet, Exodus). Pitch: "Your users' #1 unmet need is inheritance planning. We've built the solution. Let's integrate." Track response rate and willingness to take a discovery call.

**Success Criteria:** 3+ wallet PMs take a discovery call. At least 1 expresses interest in a pilot integration. Feedback validates that inheritance is a requested feature from their users.

**Failure Signal:** 0 responses after 20 outreach attempts across 10 companies. Responses indicate "not a priority" or "we're building this internally." Market timing is wrong.

**Priority:** LOW (phase 2) — Partnership validation is important for long-term strategy but should not block MVP launch. The MVP must prove user demand independently first.

**Analysis:** Wallet providers are natural distribution partners. Their users are exactly LegacyGuard's target segment. However, enterprise sales cycles are long, and wallet companies may prefer to build inheritance features internally. The outreach serves dual purposes: validating partnership potential and gathering competitive intelligence about internal roadmaps.

---

## Validation Priority Matrix

| Hypothesis | Priority | Test Cost | Test Duration | Blocks Launch? |
|:---|:---|:---|:---|:---|
| H1: Users trust non-custodial service | CRITICAL | $200 (ads) + 1 day (landing page) | 1-2 weeks | **YES** |
| H2: Users complete setup flow | CRITICAL | $0 (built into MVP) | 2-4 weeks | **YES** |
| H3: Users understand dead man's switch | HIGH | $0 (survey) | 2-4 weeks | No (iterate on UX) |
| H4: Users willing to pay | HIGH | $0 (pricing page) | 4 weeks | No (but blocks monetization) |
| H5: Users check in regularly | MEDIUM | $0 (built into MVP) | 4-8 weeks | No (iterate on reminders) |
| H6: Real heirs invited | MEDIUM | $0 (analytics) | 2-4 weeks | No (monitor and iterate) |
| H7: Lost crypto narrative drives sharing | MEDIUM | $0-100 (content creation) | 2-4 weeks | No (nice to have) |
| H8: Wallet provider partnerships | LOW | $0 (outreach time) | 4-8 weeks | No (phase 2) |

### Pre-Development Validation Requirements

**MUST validate before spending money on development:**

1. **H1 (Trust)** — Run a landing page test with $200 in targeted ads. If <1% convert, the fundamental premise needs reworking before building anything.
2. **H2 (Setup completion)** — Can be partially validated with a clickable prototype (Figma) before building the real product. Run 5 users through the prototype flow.

**Validate during MVP development (parallel track):**

3. **H3 (Understanding)** — Test terminology and explanations with 5-10 users during prototype testing.
4. **H4 (Willingness to pay)** — Include in landing page test ("Starting at $X/month" to gauge price sensitivity).

**Validate post-launch:**

5. H5 through H8 — These require a functioning product and real user behavior data. They inform iteration, not launch decisions.
