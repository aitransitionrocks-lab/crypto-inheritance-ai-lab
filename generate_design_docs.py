#!/usr/bin/env python3
"""Generate all LegacyGuard product design documents via Gemini."""

from __future__ import annotations

import asyncio
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config.settings import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s │ %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger(__name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM = (
    "You are a senior product designer, UX architect, and security UX specialist for "
    "LegacyGuard — a crypto inheritance protocol and security infrastructure layer. "
    "You design Apple-level product clarity for extremely sensitive crypto workflows. "
    "Your designs communicate trust, security, clarity, control, and simplicity. "
    "You avoid typical DeFi UX problems: confusing workflows, technical jargon, "
    "unsafe mental models, overwhelming UI, poor onboarding. "
    "All outputs should be structured for implementation in Figma, React, and Next.js."
)

CONTEXT_SUMMARY = """
LegacyGuard is a crypto inheritance protocol + security infrastructure layer.
Primary users: self-custody holders, HNWIs, family offices, wallet partners, developers.
Security: Shamir Secret Sharing (2-of-3), client-side AES-256-GCM, zero-knowledge vault.
Business model: B2B infrastructure (SDK for wallets) + B2C consumer app as reference implementation.
Key principle: LegacyGuard NEVER becomes a custodian. Non-custodial by design.
The system must handle: vault setup, heir configuration, trigger logic (dead man's switch),
heir claim process, security recovery, partner integrations, developer APIs.
"""


async def call_gemini(prompt: str) -> str:
    url = GEMINI_URL.format(model=settings.model_name)
    full = f"Context:\n{CONTEXT_SUMMARY}\n\n---\n\n{prompt}"
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM}]},
        "contents": [{"role": "user", "parts": [{"text": full}]}],
        "generationConfig": {"maxOutputTokens": 8192, "temperature": 0.3},
    }
    for attempt in range(8):
        async with httpx.AsyncClient(timeout=180) as client:
            resp = await client.post(url, params={"key": settings.gemini_api_key}, json=payload)
        if resp.status_code == 429:
            wait = min(2 ** attempt + 1, 120)
            logger.warning("Rate limited, waiting %ds", wait)
            await asyncio.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        candidates = data.get("candidates", [])
        if candidates:
            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if text:
                return text
        await asyncio.sleep(2)
    raise RuntimeError("Gemini failed after 8 retries")


DOCS = [
    (
        "01_ux_architecture",
        "Product UX Architecture & Personas",
        (
            "Create the complete Product UX Architecture for LegacyGuard.\n\n"
            "## Part 1: Persona Profiles\n\n"
            "Define 6 personas with full detail:\n\n"
            "### Persona 1: Self-Custody Crypto Holder\n"
            "- Demographics, crypto holdings range, technical skill\n"
            "- Primary goal: Ensure family can access crypto if I die\n"
            "- Main fears: Losing control, being scammed, complexity\n"
            "- Trust requirements: Open-source, audited, non-custodial proof\n"
            "- Expected UX simplicity: High (Venmo-level)\n"
            "- Interaction frequency: Setup once, check-in monthly\n"
            "- Onboarding needs: Education about key splitting, trust-building\n\n"
            "### Persona 2: High-Net-Worth Crypto Holder ($1M+)\n"
            "Same structure. Emphasize: premium feel, white-glove setup, advisor involvement.\n\n"
            "### Persona 3: Family Office Operator\n"
            "Same structure. Emphasize: multi-wallet, multi-beneficiary, compliance reporting.\n\n"
            "### Persona 4: Wallet Integration Partner (e.g., Ledger PM)\n"
            "Same structure. Emphasize: SDK quality, documentation, minimal integration effort.\n\n"
            "### Persona 5: Developer Integrating the Protocol\n"
            "Same structure. Emphasize: clear API docs, sandbox, quick start.\n\n"
            "### Persona 6: Estate Planning Advisor\n"
            "Same structure. Emphasize: legal compliance, audit trail, client management.\n\n"
            "## Part 2: Core Product Modules\n\n"
            "### User-Facing Modules\n"
            "For each module, define: purpose, key screens, interaction model, data requirements.\n"
            "1. Secure Vault Setup\n"
            "2. Inheritance Plan Creation\n"
            "3. Heir Management\n"
            "4. Trigger Logic Configuration\n"
            "5. Verification & Recovery Flow\n"
            "6. Activity Monitoring & Check-ins\n"
            "7. Security Dashboard\n"
            "8. Notifications & Alerts\n\n"
            "### Partner-Facing Modules\n"
            "1. Wallet Integration Layer\n"
            "2. Partner Management Dashboard\n"
            "3. Inheritance Trigger APIs\n"
            "4. Verification APIs\n\n"
            "### Developer-Facing Modules\n"
            "1. Protocol Documentation Portal\n"
            "2. API Explorer (interactive)\n"
            "3. SDK Examples & Quickstart\n"
            "4. Sandbox Environment\n\n"
            "## Part 3: Information Architecture\n"
            "Define the navigation structure (sitemap) for:\n"
            "- Consumer app\n"
            "- Partner dashboard\n"
            "- Developer portal\n"
            "Use indented lists to show hierarchy."
        ),
    ),
    (
        "02_user_journeys",
        "User Journey Maps",
        (
            "Design complete step-by-step user journeys for LegacyGuard.\n\n"
            "For EACH flow, provide:\n"
            "- Step number\n"
            "- Screen name\n"
            "- User action\n"
            "- System response\n"
            "- Emotional state (anxious → confident progression)\n"
            "- Trust-building element at this step\n"
            "- Error handling\n\n"
            "## FLOW 1 — New User Onboarding (12-15 steps)\n"
            "From landing page to first vault setup complete.\n"
            "Include: trust introduction, security explanation (non-technical), "
            "inheritance problem education, wallet connection, vault initialization, "
            "encryption setup, first heir invitation.\n"
            "The onboarding must transform anxiety into confidence.\n\n"
            "## FLOW 2 — Inheritance Plan Creation (8-10 steps)\n"
            "From dashboard to complete plan.\n"
            "Include: define heirs (name, email, relationship), define asset coverage "
            "(which wallets/chains), define trigger mechanism (inactivity period), "
            "configure verification requirements (multi-party, ID check), "
            "secure confirmation (password + 2FA).\n\n"
            "## FLOW 3 — Dead Man's Switch / Trigger Setup (6-8 steps)\n"
            "From plan to active monitoring.\n"
            "Include: inactivity threshold selection (30/60/90/180/365 days), "
            "periodic check-in method (email, app push, SMS, hardware key), "
            "fallback verification (trusted contact confirms), "
            "notification logic (what heirs see and when).\n\n"
            "## FLOW 4 — Heir Claim Process (10-12 steps)\n"
            "From heir notification to asset recovery instructions.\n"
            "Include: heir notification (email + app), identity verification "
            "(government ID, video, security questions), multi-party confirmation "
            "(if configured), waiting period (48h-7d safety window), "
            "recovery protocol (key assembly), asset transfer instructions.\n"
            "This is the most emotionally sensitive flow — design accordingly.\n\n"
            "## FLOW 5 — Security Recovery / Emergency (6-8 steps)\n"
            "Owner regains access or revokes.\n"
            "Include: owner recovery (proves liveness), emergency override "
            "(cancel pending claim), revocation (remove heir, change trigger), "
            "update plan (add wallets, change thresholds).\n\n"
            "## Journey Summary Table\n"
            "| Flow | Steps | Duration | Complexity | Emotional Arc | Key Risk |\n"
        ),
    ),
    (
        "03_trust_security_ux",
        "Trust UX Framework & Security UX Design",
        (
            "Design the Trust and Security UX layers for LegacyGuard.\n\n"
            "# Part 1: Trust UX Framework\n\n"
            "## Trust Communication Principles\n"
            "Define 5 core trust principles and how each manifests in UI.\n\n"
            "## Trust UX Elements\n"
            "Design specific UI elements that build trust:\n\n"
            "### Security Transparency Screens\n"
            "- What: Real-time view of security status\n"
            "- Shows: encryption status, key shard locations, audit history\n"
            "- Visual design: green/amber/red indicators, no technical jargon\n\n"
            "### Cryptographic Explanation Layers\n"
            "- Progressive disclosure: Level 1 (simple metaphor), Level 2 (how it works), "
            "Level 3 (technical detail)\n"
            "- Example: Explain Shamir's Secret Sharing as 'Your key is split into 3 puzzle "
            "pieces. Any 2 pieces can reconstruct it. No single piece reveals anything.'\n\n"
            "### Risk Explanation Prompts\n"
            "- Before every high-risk action, show: what will happen, what could go wrong, "
            "how to undo it\n"
            "- Design pattern: Warning → Explanation → Confirmation → Success\n\n"
            "### Confirmation Checkpoints\n"
            "- Multi-step confirmation for irreversible actions\n"
            "- Design: Review screen → Type confirmation phrase → Biometric/2FA → Done\n\n"
            "### Trust Indicators\n"
            "- Persistent: security score badge, last audit date, uptime indicator\n"
            "- Contextual: 'Your data is encrypted with AES-256' shown at relevant moments\n\n"
            "### Activity Logs\n"
            "- Every action logged with timestamp, IP, device\n"
            "- Heir-visible logs (what the heir can see about plan status)\n\n"
            "## Trust Architecture Visualization\n"
            "Design how users understand:\n"
            "- Where keys are stored (visual diagram: 'Shard 1: Your device, Shard 2: "
            "Trusted contact, Shard 3: LegacyGuard encrypted vault')\n"
            "- What LegacyGuard CAN and CANNOT access (explicit 'We cannot' statements)\n"
            "- How heirs gain access (step-by-step visual)\n"
            "- How false triggers are prevented (safety mechanisms visual)\n\n"
            "# Part 2: Security UX Design\n\n"
            "## Security Interaction Patterns\n"
            "For each pattern, define: when it appears, what it shows, user action required.\n\n"
            "### Multi-Factor Confirmation\n"
            "- Pattern: Password → Biometric → Email code\n"
            "- When: Creating plan, adding heir, changing trigger\n\n"
            "### Multi-Party Approvals\n"
            "- Pattern: Owner + Trusted Contact must both approve\n"
            "- UI: Split-screen approval status, real-time updates\n\n"
            "### Threshold Cryptography Actions\n"
            "- Pattern: Visual representation of key assembly\n"
            "- Animation: Puzzle pieces coming together\n\n"
            "### Security Alerts\n"
            "- Tiers: Info (blue), Warning (amber), Critical (red)\n"
            "- Examples: New device login, trigger approaching, unauthorized access attempt\n\n"
            "### Suspicious Activity Detection\n"
            "- Pattern: Automatic pause + owner notification\n"
            "- UI: 'Unusual activity detected. Your plan is paused. Verify identity to resume.'\n\n"
            "## High-Risk Action UX Rules\n"
            "For each action, define the security UX flow:\n"
            "- Changing heirs: Cool-down period (72h) + multi-factor + notification to existing heirs\n"
            "- Altering trigger logic: Re-authentication + confirmation phrase + 24h delay\n"
            "- Disabling protections: Owner identity re-verification + 'Are you sure' with consequences\n"
            "- Emergency recovery: Multi-party verification + government ID + video verification\n\n"
            "## Security UX Anti-Patterns to Avoid\n"
            "List 10 specific UX anti-patterns that crypto security products commonly make, "
            "and how LegacyGuard avoids each."
        ),
    ),
    (
        "04_design_system",
        "Complete Design System",
        (
            "Create the complete LegacyGuard Design System.\n\n"
            "## 1. Design Philosophy\n"
            "3 sentences defining the visual and interaction philosophy.\n"
            "Keywords: professional, trustworthy, secure, minimalist, warm.\n"
            "Anti-keywords: DeFi meme culture, crypto-bro aesthetics, dark mode only.\n\n"
            "## 2. Color System\n"
            "Define with hex codes:\n"
            "### Primary Colors\n"
            "- Primary: Deep navy (#1a2332) — trust, stability\n"
            "- Primary Light: (#2a3a4f)\n"
            "- Accent: Warm gold (#c9a84c) — value, legacy\n"
            "- Accent Light: (#e8d49a)\n\n"
            "### Semantic Colors\n"
            "- Success: (#22c55e) — confirmations, active status\n"
            "- Warning: (#f59e0b) — caution, pending actions\n"
            "- Error: (#ef4444) — critical alerts\n"
            "- Info: (#3b82f6) — informational\n\n"
            "### Neutral Scale\n"
            "- Background: (#f8fafc)\n"
            "- Surface: (#ffffff)\n"
            "- Border: (#e2e8f0)\n"
            "- Text Primary: (#0f172a)\n"
            "- Text Secondary: (#64748b)\n"
            "- Text Muted: (#94a3b8)\n\n"
            "### Security Status Colors\n"
            "- Secure: (#22c55e)\n"
            "- Attention: (#f59e0b)\n"
            "- Critical: (#ef4444)\n"
            "- Inactive: (#94a3b8)\n\n"
            "## 3. Typography\n"
            "- Font family: Inter (headings + body), JetBrains Mono (code/addresses)\n"
            "- Scale: H1 (32px/700), H2 (24px/600), H3 (20px/600), H4 (16px/600), "
            "Body (16px/400), Body Small (14px/400), Caption (12px/400)\n"
            "- Line heights, letter spacing for each\n\n"
            "## 4. Spacing System\n"
            "- Base unit: 4px\n"
            "- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96\n"
            "- Component padding: 16px (cards), 24px (sections), 32px (pages)\n\n"
            "## 5. Border Radius\n"
            "- Small: 6px (buttons, inputs)\n"
            "- Medium: 12px (cards)\n"
            "- Large: 16px (modals)\n"
            "- Full: 999px (badges, avatars)\n\n"
            "## 6. Shadow System\n"
            "- sm: 0 1px 2px rgba(0,0,0,0.05)\n"
            "- md: 0 4px 6px rgba(0,0,0,0.07)\n"
            "- lg: 0 10px 15px rgba(0,0,0,0.1)\n"
            "- xl: 0 20px 25px rgba(0,0,0,0.15)\n\n"
            "## 7. Iconography\n"
            "- Icon set: Lucide Icons (open source, consistent)\n"
            "- Security icons: Shield, Lock, Key, Eye, Fingerprint\n"
            "- Inheritance icons: Users, Heart, FileCheck, Clock, Bell\n"
            "- Size: 16px (inline), 20px (buttons), 24px (navigation), 32px (features)\n\n"
            "## 8. Component Library\n"
            "Define specifications for each component:\n\n"
            "### Buttons\n"
            "- Primary, Secondary, Ghost, Danger\n"
            "- States: default, hover, active, disabled, loading\n"
            "- Sizes: sm (32px), md (40px), lg (48px)\n\n"
            "### Cards\n"
            "- Vault Card (status, name, assets, last activity)\n"
            "- Heir Card (avatar, name, relationship, status)\n"
            "- Alert Card (severity, message, action)\n"
            "- Metric Card (label, value, trend)\n\n"
            "### Status Indicators\n"
            "- Security Score Badge (0-100, color-coded)\n"
            "- Plan Status (Active, Pending, Triggered, Expired)\n"
            "- Check-in Status (On time, Due soon, Overdue)\n\n"
            "### Form Elements\n"
            "- Text inputs, dropdowns, toggles, sliders\n"
            "- Crypto address input (with validation + ENS resolution)\n"
            "- Duration selector (for trigger timing)\n\n"
            "### Modals & Dialogs\n"
            "- Confirmation modal (with typed phrase)\n"
            "- Security verification modal\n"
            "- Success celebration modal\n\n"
            "### Navigation\n"
            "- Sidebar (desktop), Bottom tabs (mobile)\n"
            "- Breadcrumbs for multi-step flows\n\n"
            "## 9. Layout Grid\n"
            "- Desktop: 12-column, 1280px max-width, 24px gutter\n"
            "- Tablet: 8-column, 768px\n"
            "- Mobile: 4-column, 375px\n\n"
            "## 10. Animation Rules\n"
            "- Transitions: 150ms ease-out (micro), 300ms ease-in-out (layout)\n"
            "- Loading: Skeleton screens, not spinners\n"
            "- Success: Subtle check animation (Lottie)\n"
            "- Security: Shield pulse animation for verification\n"
            "- No: Bouncing, flashing, aggressive animations\n\n"
            "## 11. Interaction Feedback\n"
            "- Click: Subtle scale (0.98) + shadow change\n"
            "- Hover: Background tint + cursor change\n"
            "- Focus: 2px ring in accent color\n"
            "- Success: Green check + haptic (mobile)\n"
            "- Error: Red shake + message\n\n"
            "## 12. Accessibility\n"
            "- WCAG 2.1 AA compliance\n"
            "- Minimum contrast ratios\n"
            "- Keyboard navigation for all flows\n"
            "- Screen reader labels for security elements"
        ),
    ),
    (
        "05_dashboard_concept",
        "Dashboard UI Concept & Partner/Developer Interface",
        (
            "Design the LegacyGuard Dashboard and Partner/Developer interfaces.\n\n"
            "# Part 1: Main Dashboard Design\n\n"
            "## Dashboard Layout (Conceptual)\n"
            "Describe the visual layout using ASCII art or structured description.\n\n"
            "### Top Bar\n"
            "- Logo | Search | Notifications (bell with badge) | Profile avatar\n\n"
            "### Left Sidebar\n"
            "- Dashboard (home icon)\n"
            "- My Vaults (shield icon)\n"
            "- Inheritance Plans (file-check icon)\n"
            "- Heirs (users icon)\n"
            "- Activity (clock icon)\n"
            "- Settings (gear icon)\n"
            "- Security (lock icon)\n\n"
            "### Main Content Area\n\n"
            "#### Row 1: Status Overview (3 cards)\n"
            "- Security Score: Large circular gauge (0-100), color-coded\n"
            "- Active Plans: Count + status summary\n"
            "- Next Check-in: Countdown timer + 'Check in now' button\n\n"
            "#### Row 2: Vault Overview\n"
            "- Card grid showing each vault\n"
            "- Each card: Vault name, chain icon, total value, last activity, status badge\n"
            "- '+' card to add new vault\n\n"
            "#### Row 3: Inheritance Plans Summary\n"
            "- Table: Plan name, Heirs, Trigger type, Status, Last updated\n"
            "- Quick actions: Edit, Pause, View details\n\n"
            "#### Row 4: Recent Activity\n"
            "- Timeline view: Check-ins, plan changes, heir updates, security events\n"
            "- Each entry: Icon, description, timestamp, device\n\n"
            "#### Row 5: Security Alerts (if any)\n"
            "- Alert cards: severity icon, message, recommended action, dismiss\n\n"
            "## Information Hierarchy\n"
            "Explain the visual hierarchy: what draws attention first, second, third.\n"
            "Priority: Security status → Active plans → Next check-in → Recent activity.\n\n"
            "## Dashboard States\n"
            "- New user (empty state with setup wizard CTA)\n"
            "- Active user (normal dashboard)\n"
            "- Alert state (security warning prominently displayed)\n"
            "- Triggered state (plan has been activated — urgent banner)\n\n"
            "# Part 2: Partner Interface Design\n\n"
            "## Partner Dashboard Layout\n"
            "For wallet providers and custody platforms:\n\n"
            "### Overview Panel\n"
            "- Active integrations count\n"
            "- End users using inheritance through partner\n"
            "- API health status\n"
            "- Monthly API calls\n\n"
            "### Integration Management\n"
            "- Integration status per product/wallet\n"
            "- Configuration settings\n"
            "- Webhook management\n"
            "- Test mode toggle\n\n"
            "### Analytics\n"
            "- Adoption funnel (offered → started → completed)\n"
            "- User engagement metrics\n"
            "- Trigger event statistics\n\n"
            "### Support & Docs\n"
            "- Integration guide links\n"
            "- Support ticket system\n"
            "- Change log\n\n"
            "# Part 3: Developer Portal Design\n\n"
            "## Developer Portal Structure\n"
            "- Getting Started (5-minute quickstart)\n"
            "- Authentication (API keys, OAuth)\n"
            "- Core API Reference (REST endpoints with examples)\n"
            "- SDK Documentation (JavaScript, Python, Rust)\n"
            "- Webhooks (events, payloads, verification)\n"
            "- Sandbox (test environment with mock data)\n"
            "- Examples & Tutorials\n"
            "- Changelog\n\n"
            "## API Explorer\n"
            "- Interactive endpoint tester (like Swagger UI but branded)\n"
            "- Request builder with live response\n"
            "- Code generation (curl, JS, Python)\n\n"
            "## Sandbox Environment\n"
            "- Test API key generation\n"
            "- Mock wallet connections\n"
            "- Simulated trigger events\n"
            "- Test heir claim flow\n"
            "- Pre-populated test data\n\n"
            "## Developer Onboarding Flow\n"
            "Step 1: Create account → Step 2: Get API key → Step 3: Run quickstart → "
            "Step 4: Test in sandbox → Step 5: Go live checklist"
        ),
    ),
    (
        "06_mvp_ui_scope",
        "MVP UI Scope & Implementation Guide",
        (
            "Define the exact MVP UI scope for LegacyGuard.\n\n"
            "## MVP UI: What's IN\n\n"
            "### Screen 1: Landing / Onboarding\n"
            "- Value proposition (3 steps visual)\n"
            "- 'Protect Your Crypto Legacy' CTA\n"
            "- Trust signals (security badges, audit status)\n"
            "- Sign up / Sign in\n\n"
            "### Screen 2: Onboarding Wizard (4 steps)\n"
            "- Step 1: Welcome + security education (30 seconds)\n"
            "- Step 2: Connect wallet (WalletConnect / manual address)\n"
            "- Step 3: Create vault (name it, select chains)\n"
            "- Step 4: Invite first heir (email)\n\n"
            "### Screen 3: Dashboard (simplified)\n"
            "- Security score\n"
            "- Active plan summary\n"
            "- Next check-in countdown\n"
            "- Quick actions: Check in, Edit plan, View activity\n\n"
            "### Screen 4: Vault Setup\n"
            "- Vault name, connected wallets, chains covered\n"
            "- Encryption status indicator\n"
            "- Key shard distribution visual\n\n"
            "### Screen 5: Heir Configuration\n"
            "- Add heir: Name, email, relationship\n"
            "- Heir list with status (invited, verified, active)\n"
            "- Remove/edit heir (with confirmation flow)\n\n"
            "### Screen 6: Trigger Configuration\n"
            "- Inactivity period selector (slider: 30-365 days)\n"
            "- Check-in method selection (email, push, SMS)\n"
            "- Preview: 'If you don't check in for 90 days, your heirs will be notified'\n\n"
            "### Screen 7: Check-in Screen\n"
            "- Big 'I'm Here' button\n"
            "- Last check-in timestamp\n"
            "- Next check-in due date\n"
            "- Activity log\n\n"
            "### Screen 8: Notifications\n"
            "- Check-in reminders\n"
            "- Security alerts\n"
            "- Heir activity updates\n\n"
            "### Screen 9: Settings\n"
            "- Profile, Security (2FA), Notifications preferences\n\n"
            "## MVP UI: What's EXPLICITLY OUT\n"
            "- Multi-vault management (v2)\n"
            "- Advanced trigger logic (multi-condition, oracle-based)\n"
            "- Partner dashboard (v2)\n"
            "- Developer portal (v2)\n"
            "- Multi-chain automatic detection\n"
            "- Video verification for heirs\n"
            "- Mobile native app (web-first)\n"
            "- Social recovery module\n"
            "- Token-based governance\n"
            "- On-chain smart contract triggers\n\n"
            "## Tech Stack for MVP UI\n"
            "- Framework: Next.js 14+ (App Router)\n"
            "- Styling: Tailwind CSS + shadcn/ui components\n"
            "- State: Zustand\n"
            "- Auth: Supabase Auth or Clerk\n"
            "- Wallet: WalletConnect v2 + wagmi\n"
            "- Animations: Framer Motion\n"
            "- Icons: Lucide\n"
            "- Deployment: Vercel\n\n"
            "## Implementation Priority Order\n"
            "| Priority | Screen | Effort | Why First |\n"
            "| 1 | Landing + Auth | 2 days | First impression, trust |\n"
            "| 2 | Onboarding Wizard | 3 days | Core conversion flow |\n"
            "| 3 | Dashboard | 2 days | Daily touchpoint |\n"
            "| 4 | Vault Setup | 3 days | Core product value |\n"
            "| 5 | Heir Configuration | 2 days | Key feature |\n"
            "| 6 | Trigger Configuration | 2 days | Dead man's switch |\n"
            "| 7 | Check-in | 1 day | Engagement loop |\n"
            "| 8 | Notifications | 1 day | Retention |\n"
            "| 9 | Settings | 1 day | Expected feature |\n\n"
            "## Total MVP UI Effort: ~17 development days (1 senior frontend engineer)\n\n"
            "## Component Mapping to shadcn/ui\n"
            "Map each MVP screen to specific shadcn components:\n"
            "| Screen | Components Used |\n"
            "Example: Dashboard → Card, Badge, Progress, Button, Avatar, DropdownMenu\n\n"
            "## Design Deliverables Needed Before Build\n"
            "1. Figma wireframes (low-fidelity, 2 days)\n"
            "2. Design system in Figma (1 day)\n"
            "3. High-fidelity mockups for key flows (3 days)\n"
            "4. Prototype for onboarding + heir claim flow (1 day)\n"
            "5. Icon and illustration set (1 day)\n\n"
            "## What Differentiates LegacyGuard UX\n"
            "- Emotional intelligence: The product handles death and loss — every word matters\n"
            "- Progressive security: Complex crypto concepts revealed gradually\n"
            "- Trust-first design: Security status always visible, never hidden\n"
            "- Non-custodial transparency: Users always know where their keys are\n"
            "- Check-in as engagement: The dead man's switch creates a healthy usage loop"
        ),
    ),
]


async def main() -> None:
    design_dir = Path("design")
    design_dir.mkdir(exist_ok=True)
    start = time.monotonic()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    for slug, title, prompt in DOCS:
        logger.info("Generating: %s", title)
        try:
            content = await call_gemini(prompt)
            path = design_dir / f"{slug}.md"
            header = f"# {title}\n*LegacyGuard Product Design — Generated {now}*\n\n---\n\n"
            path.write_text(header + content, encoding="utf-8")
            logger.info("  ✓ %s: %d chars", slug, len(content))
        except Exception as exc:
            logger.error("  ✗ %s: %s", slug, exc)
        await asyncio.sleep(10)

    elapsed = time.monotonic() - start
    logger.info("All design docs generated in %.1fs", elapsed)

    # List results
    for p in sorted(design_dir.glob("*.md")):
        print(f"  {p.name}: {p.stat().st_size:,} chars")


if __name__ == "__main__":
    asyncio.run(main())
