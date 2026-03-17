# Validation System

A comprehensive system for capturing feedback, tracking user behavior, conducting interviews, and making data-driven decisions during LegacyGuard MVP testing.

---

## 1. Feedback Capture

### In-App Feedback Widget

A lightweight, non-intrusive feedback mechanism embedded directly in the application.

**Implementation:**
- Floating button in bottom-right corner: "How's your experience?"
- Opens a modal with a maximum of 3 questions
- Submissions stored in Supabase `feedback` table with user ID and timestamp

**Questions:**

1. **"How confident do you feel about the security?"** (1-5 scale)
   - Scale: 1 = Not at all confident, 5 = Extremely confident
   - Purpose: Measures trust, the foundational metric for LegacyGuard
   - Alert threshold: Average score <3.0 triggers immediate UX review

2. **"What confused you?"** (free text, optional)
   - Purpose: Captures friction points in the user's own words
   - Analysis: Tag responses by category (terminology, flow, trust, technical)
   - Review: Weekly qualitative analysis of all responses

3. **"Would you pay for this? How much?"** (free text, optional)
   - Purpose: Early willingness-to-pay signal
   - Analysis: Extract price points, categorize as yes/no/maybe
   - Benchmark: Compare stated WTP against actual pricing page behavior

**Trigger Points:**
- **After completing setup:** Capture first impressions while experience is fresh (show once, 5-second delay after final step)
- **After 7 days:** Capture early retention sentiment (has the user checked in? Do they remember the product?)
- **After 30 days:** Capture sustained value perception (has the product become part of their routine?)

**Technical Implementation:**
- React component with Supabase edge function backend
- Store responses in `feedback` table: `{user_id, trigger, q1_score, q2_text, q3_text, created_at}`
- Dashboard view for aggregated scores and text responses

### Post-Setup Survey (Google Form)

A more comprehensive survey for deeper insights, sent after the initial in-app feedback moment has passed.

**Delivery:** Automated email sent 24 hours after setup completion via Supabase edge function + email service (Resend or SendGrid free tier).

**10 Survey Questions:**

1. How did you hear about LegacyGuard? (Multiple choice + other)
2. Before LegacyGuard, what was your plan for your crypto if something happened to you? (Free text)
3. How easy was the setup process? (1-5 scale)
4. Which step felt most difficult or confusing? (Multiple choice: signup/vault/heir/trigger/check-in)
5. Do you believe your crypto is safe with LegacyGuard's approach? (1-5 scale)
6. In your own words, how does LegacyGuard protect your crypto inheritance? (Free text)
7. Did you add a real heir or a test email? (Real heir / Test email / Prefer not to say)
8. Would you recommend LegacyGuard to a friend who holds crypto? (1-10 NPS scale)
9. What would you pay for this service? ($0 / $1-5/mo / $5-10/mo / $10-20/mo / $50+ one-time / Other)
10. What one feature would make LegacyGuard significantly better? (Free text)

**Response Goal:** >30% response rate (incentivize with "early supporter" badge or extended free access).

---

## 2. Analytics Events

Track these events to understand user behavior quantitatively. Use PostHog (free tier: 1M events/month) or store as JSON logs in Supabase for custom analysis.

### Event Schema

| Event | Trigger | Data Captured |
|:---|:---|:---|
| `page_view` | Every page load | `page`, `timestamp`, `referrer`, `utm_source`, `utm_medium`, `device_type` |
| `signup_start` | Click "Sign Up" button | `source` (landing page / nav / CTA), `device`, `referrer` |
| `signup_complete` | Account successfully created | `time_to_complete` (seconds), `auth_method`, `referral_code` |
| `vault_created` | Vault saved successfully | `chains_selected` (array), `num_addresses`, `time_to_complete`, `vault_name_length` |
| `heir_added` | Heir form submitted | `relationship_type` (spouse/child/parent/sibling/friend/other), `email_domain_type` (personal/corporate/disposable) |
| `trigger_configured` | Trigger saved | `interval_days` (90/180/365), `method` (email), `custom_message_added` (boolean) |
| `checkin_completed` | Check-in confirmed | `method` (dashboard_button/email_link), `days_before_due`, `response_time_from_reminder` |
| `setup_abandoned` | Leave page during setup (no return within 30min) | `last_step_completed`, `time_on_last_step`, `total_time_in_flow` |
| `pricing_viewed` | Visit pricing page | `source` (nav/CTA/post-setup), `time_on_page`, `scroll_depth` |
| `pricing_clicked` | Click subscribe/buy button | `plan_selected`, `price_point`, `time_to_click` |
| `instructions_saved` | Encrypted instructions stored | `char_count`, `time_to_write` |
| `dashboard_visit` | Return to dashboard | `days_since_last_visit`, `actions_taken` |
| `feedback_submitted` | In-app feedback sent | `trigger_point`, `security_score`, `has_confusion_text`, `has_wtp_text` |

### Key Funnels to Monitor

**Primary Funnel (Setup Completion):**
```
page_view → signup_start → signup_complete → vault_created → heir_added → trigger_configured → checkin_completed
```
Target: >40% end-to-end conversion.

**Engagement Funnel (Retention):**
```
checkin_completed (1st) → dashboard_visit (week 1) → checkin_completed (2nd) → dashboard_visit (month 1)
```
Target: >60% complete second check-in.

**Monetization Funnel:**
```
setup_complete → pricing_viewed → pricing_clicked
```
Target: >10% of setup-complete users click a pricing CTA.

### Implementation Notes
- Use a simple `trackEvent(name, properties)` utility function
- Store in Supabase `analytics_events` table: `{event_name, user_id, properties (JSONB), timestamp}`
- Build a simple admin dashboard or export to Google Sheets weekly
- PostHog free tier provides funnels, session recordings, and feature flags out of the box

---

## 3. User Interview Script (10 Questions)

### Pre-Interview Setup

**Recruitment message:** "We're building a tool to protect crypto inheritance. We'd love 15 minutes of your time. As a thank you, you'll get lifetime early-supporter access."

**Target:** 2 interviews per week, minimum 8 in first month.

**Format:** Video call (Zoom/Google Meet), recorded with permission. One interviewer, one note-taker (or use Otter.ai for transcription).

### Interview Questions

**Opening (1 minute):** "Thanks for joining. We're exploring how crypto holders think about inheritance. There are no right or wrong answers — we just want to understand your experience."

1. **"Do you own cryptocurrency? Roughly how much?"** (Don't need exact numbers)
   - *Listen for:* Portfolio size indicates pain level. >$10K = high pain. <$1K = low urgency.
   - *Follow-up:* "What chains/wallets do you use?"

2. **"Have you thought about what happens to your crypto if something happens to you?"**
   - *Listen for:* Emotional response. Avoidance = aware but uncomfortable. Detailed plan = already solved.
   - *Follow-up:* "When did you first think about this?"

3. **"What do you currently do about this?"** (Nothing? Paper in safe? Shared password?)
   - *Listen for:* Current solution sophistication. "Nothing" = highest opportunity. Existing solution = competitive insight.
   - *Follow-up:* "How confident are you in that approach?"

4. **"What worries you most about existing solutions?"**
   - *Listen for:* Trust concerns, complexity complaints, cost objections.
   - *Follow-up:* "Have you looked at any specific products?"

5. **[Show LegacyGuard landing page/demo] "What's your first impression?"**
   - *Listen for:* Emotional reaction. "Oh, this is exactly what I need" vs. "Hmm, I'm not sure."
   - *Watch for:* Where their eyes go first. What they read. What they skip.

6. **"Does the 'dead man's switch' concept make sense to you?"**
   - *Listen for:* Can they explain it back? Do they understand the trigger mechanism?
   - *Follow-up:* "What would you call this feature?"

7. **"How do you feel about storing encrypted instructions?"**
   - *Listen for:* Comfort level with storing sensitive information. Trust in encryption.
   - *Follow-up:* "What would you store in the instructions field?"

8. **"Would you trust this with your crypto inheritance?"**
   - *Listen for:* Conditional trust ("if it's audited," "if it's open source") vs. absolute trust/distrust.
   - *Follow-up:* "What would increase your trust?"

9. **"What would make you NOT use this?"**
   - *Listen for:* Deal-breakers. These are critical for product design.
   - *Follow-up:* "Is there anything that would change your mind?"

10. **"What would you pay for this? Monthly? One-time?"**
    - *Listen for:* Price anchoring. Compare stated WTP with actual behavior later.
    - *Follow-up:* "What's the maximum you'd consider?"

**Closing (1 minute):** "Would you recommend this to someone you know? Can we follow up in a few weeks to share what we've built?"

### Post-Interview Analysis Template

| Question | Key Insight | Sentiment (+/-/neutral) | Action Item |
|:---|:---|:---|:---|
| Q1-Q4 | Problem awareness | | |
| Q5-Q7 | Solution fit | | |
| Q8-Q9 | Trust & objections | | |
| Q10 | Willingness to pay | | |

---

## 4. Friction Point Tracking

Systematically track WHERE users get stuck in the setup flow.

### Friction Indicators by Step

| Step | Expected Time | Friction Indicators | Measurement Method |
|:---|:---|:---|:---|
| **Landing → Signup** | <60 seconds | Scroll depth <50%, time on page >3min (reading but not acting), exit rate >70%, CTA not visible above fold | PostHog/analytics: `page_view` to `signup_start` time delta |
| **Signup → Vault** | <120 seconds | Form abandonment mid-entry, error rate on form fields >10%, users clicking "back" or navigating away, help icon clicks | Track `signup_complete` to `vault_created` time, form field error events |
| **Vault → Heir** | <60 seconds | Hesitation time >2 minutes on heir form, back-button clicks, users typing and deleting in email field, page revisits | Session recording analysis, `vault_created` to `heir_added` time |
| **Heir → Trigger** | <90 seconds | Slider/dropdown interaction without committing (changing values repeatedly), help icon clicks >2, tooltip views, abandonment | Track trigger configuration changes, `heir_added` to `trigger_configured` time |
| **Trigger → Check-in** | <30 seconds | Completion rate <80%, users reading help text extensively, clicking away before confirming | `trigger_configured` to `checkin_completed` time, completion rate |

### Friction Response Protocol

- **Minor friction** (>80% pass, slight delay): Log and monitor. Address in next sprint.
- **Moderate friction** (50-80% pass): Add contextual help (tooltips, examples). A/B test copy changes.
- **Severe friction** (<50% pass): Redesign the step. Consider splitting into sub-steps or reordering the flow.

### Session Recording Review

- Review 5 session recordings per week (prioritize abandoned sessions)
- Tag recordings: `smooth`, `hesitation`, `confusion`, `abandonment`
- Create a "friction heatmap" showing which steps cause the most issues
- Tool: PostHog session recordings (free tier) or Hotjar (free tier: 35 sessions/day)

---

## 5. Weekly Validation Cadence

A structured weekly rhythm to ensure consistent data collection, analysis, and iteration.

### Monday: Review Analytics Dashboard

- **Morning (30 minutes):**
  - Check key metrics: signups (total, this week), setup completion rate, check-in compliance
  - Review funnel conversion rates
  - Flag any anomalies (sudden drop-offs, error spikes)
- **Output:** Updated metrics dashboard, list of concerns

### Wednesday: User Interviews

- **2 interviews scheduled** (30 minutes each + 15 minutes debrief)
  - Week 1-2: Focus on Happy Path and Confused User scenarios
  - Week 3-4: Focus on Skeptical User and Power User scenarios
- **Post-interview:** Fill out analysis template, identify top 3 insights
- **Output:** Interview notes, updated insight log

### Friday: Synthesize and Iterate

- **Morning (60 minutes):**
  - Combine quantitative data (analytics) with qualitative data (interviews, feedback)
  - Update hypothesis status (confirmed / needs more data / refuted)
  - Identify top 3 product changes for next week
  - Write a brief "Week N Validation Summary" (5 bullets max)
- **Output:** Weekly summary, prioritized action items, updated hypothesis tracker

### Monthly Review (End of Month)

- Comprehensive review of all 8 hypotheses
- Decision framework evaluation (GREEN / YELLOW / RED)
- Stakeholder update with data-backed recommendations
- Go/no-go decision on continued development investment

---

## 6. Decision Framework

After 30 days of validation, use this framework to make a clear go/no-go decision.

### GREEN — Proceed to Full Development

**Criteria (ALL must be met):**
- >50 users complete full setup (vault + heir + trigger)
- >40% setup completion rate (signup to check-in)
- >10% willingness to pay (pricing page click-through)
- Average security confidence score >3.5/5
- >60% check-in compliance rate

**Action:** Invest in Phase 2 features (multiple heirs, Shamir splitting, mobile app). Begin monetization.

### YELLOW — Iterate and Extend Validation

**Criteria (some signals positive, some concerning):**
- 20-50 users complete setup
- 20-40% setup completion rate
- Mixed willingness to pay signals (5-10%)
- Trust scores between 2.5-3.5
- Specific friction points identified but addressable

**Action:** Extend validation by 2-4 weeks. Address identified friction points. Run targeted experiments on weak areas. Do NOT invest in new features until core metrics improve.

### RED — Pivot or Abandon

**Criteria (ANY of these):**
- <20 users complete setup despite adequate traffic
- <20% setup completion rate
- 0% willingness to pay
- Average trust score <2.5
- Qualitative feedback consistently negative about core concept

**Action:** Conduct post-mortem analysis. Identify whether the problem is:
1. **Positioning** (right product, wrong message) → Reposition and retest
2. **Product** (wrong solution to real problem) → Pivot the approach
3. **Market** (problem not painful enough) → Abandon or fundamentally rethink

### Decision Meeting Agenda

1. Review 30-day metrics against criteria (15 minutes)
2. Present qualitative findings from interviews (15 minutes)
3. Discuss edge cases and nuances (15 minutes)
4. Make decision: GREEN / YELLOW / RED (15 minutes)
5. Define next steps with owners and deadlines (15 minutes)

**Total:** 75-minute decision meeting with all stakeholders.
