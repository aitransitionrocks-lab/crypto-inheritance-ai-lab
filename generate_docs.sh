#!/bin/bash
set -e

source "$(dirname "$0")/.env" 2>/dev/null
API_KEY="${GEMINI_API_KEY}"
BASE_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}"
REPORTS_DIR="/Users/petermarggraff/AI-projekte/crypto_inheritance_ai_lab/reports"
DATE="2026-03-17"

declare -a FILENAMES=(
  "gtm_entry_strategy.md"
  "acquisition_channels.md"
  "content_engine.md"
  "landing_conversion.md"
  "pricing_strategy.md"
  "first_100_users.md"
)

declare -a PROMPTS=()

PROMPTS+=("Define the go-to-market entry strategy for LegacyGuard.

# GTM Entry Strategy

## Chosen Wedge: Crypto Twitter Self-Custody Users
WHY this wedge:
- Largest reachable audience (millions follow crypto Twitter)
- Highest pain awareness (they've seen 'lost crypto' stories)
- Fastest feedback loop (crypto Twitter reacts in hours)
- Zero acquisition cost (organic content)
- Self-selecting: only people with crypto engage

## Where They Hang Out
- Twitter/X: #Bitcoin, #crypto, #selfcustody, #HODL
- Reddit: r/cryptocurrency, r/Bitcoin, r/ethereum, r/CryptoTechnology
- YouTube: crypto channels (Coin Bureau, Anthony Pompliano)
- Discord: crypto communities, DAO servers
- Telegram: crypto groups
- Podcasts: What Bitcoin Did, Unchained, Bankless

## How to Reach Them
1. Organic content (viral potential with emotional stories)
2. Community engagement (Reddit AMA, Discord presence)
3. Influencer seeding (send to 20 crypto influencers)
4. SEO content (target 'crypto inheritance', 'what happens to bitcoin when you die')

## Entry Metrics
| Metric | Target (30 days) | Target (90 days) |
| Twitter followers | 1,000 | 5,000 |
| Website visitors | 5,000 | 25,000 |
| Signups | 100 | 500 |
| Completed setups | 50 | 200 |
| Paid conversions | 5 | 50 |

Generate a comprehensive, detailed go-to-market entry strategy document in markdown format. Expand on all sections with actionable details. Include the date ${DATE} in the header.")

PROMPTS+=("Define the 3 acquisition channels for LegacyGuard.

# Acquisition Channels

## Channel 1: Organic Content (Twitter/X + LinkedIn)
### Strategy
- Post 2x/day on Twitter: alternating between education, fear/urgency, social proof
- Post 3x/week on LinkedIn: targeting crypto professionals, family office managers
- Engage in every 'lost crypto' thread on Twitter

### Messaging Angles
- Fear: 'Your family can't access your Bitcoin. Not now, not ever.'
- Education: 'Here's what happens to your crypto when you die'
- Social proof: 'X BTC are permanently lost because owners died without a plan'
- Solution: 'There's now a non-custodial way to protect your crypto legacy'

### Expected Conversion
- Impressions to Profile: 3-5%
- Profile to Website: 10-15%
- Website to Signup: 5-8%
- Signup to Setup: 40-60%

## Channel 2: Community Engagement (Reddit + Discord)
### Strategy
- Post weekly in r/cryptocurrency, r/Bitcoin
- Host monthly Reddit AMA
- Join 10 crypto Discord servers, become known expert
- Answer every 'what happens when I die' question

### Messaging
- Be helpful, not salesy
- Share educational content first
- Mention LegacyGuard only when directly relevant

### Expected Conversion
- Reddit post views: 5,000-50,000 per viral post
- Conversion to website: 1-3%
- Website to signup: 5-8%

## Channel 3: Strategic Partnerships (Influencers + Wallet Providers)
### Strategy
- Seed product to 20 crypto influencers (free premium account)
- Partner with 1-2 hardware wallet communities
- Speak at 2-3 crypto conferences (ETHDenver, Bitcoin Amsterdam)

### Messaging
- 'We built what every crypto holder needs but nobody talks about'
- Demo the product live, show the simplicity

### Expected Conversion
- Influencer mention: 500-5,000 signups per mention
- Conference demo: 50-200 signups per event

## Channel Priority
| Channel | Cost | Speed | Scale | Quality | Priority |
| Organic content | \$0 | Fast | High | Medium | #1 |
| Community | \$0 | Medium | Medium | High | #2 |
| Partnerships | \$500-5K | Slow | Very High | High | #3 |

Generate a comprehensive acquisition channels document in markdown format. Expand on all sections with actionable details. Include the date ${DATE} in the header.")

PROMPTS+=("Create a complete content engine for LegacyGuard marketing.

# Content Engine

## Content Pillars
1. FEAR: Lost crypto stories, statistics, urgency
2. EDUCATION: How inheritance works, dead man's switch explained
3. TRUST: Non-custodial proof, security architecture, transparency
4. SOLUTION: Product demos, user stories, simplicity

## 10 TikTok/Reels Scripts (30-60 seconds each)

### Script 1: 'The \$250 Million Mistake'
Hook: 'A man died with \$250 million in Bitcoin. His family got zero.'
Body: 'He had no inheritance plan. No seed phrase backup. No dead man's switch. His crypto is gone forever.'
CTA: 'Don't let this happen to your family. Link in bio.'

### Script 2: 'What Happens to Your Crypto When You Die?'
Hook: 'If you die tomorrow, can your family access your Bitcoin?'
Body: 'Your exchange account? Maybe. Your hardware wallet? Probably not. Your DeFi positions? Definitely not. Unless you set up LegacyGuard.'
CTA: 'Protect your crypto legacy in 5 minutes.'

### Script 3: 'The Dead Man's Switch Explained'
Hook: 'There is a mechanism that protects your crypto after death. It is called a dead man's switch.'
Body: 'You check in periodically. If you stop checking in, your trusted heirs get access. No one else. Not even us.'
CTA: 'Set up your switch today.'

### Script 4: 'Your Seed Phrase in a Safe is NOT Enough'
Hook: 'You think your seed phrase in a safe deposit box protects your family?'
Body: 'What if they don't know it exists? What if they can't access the safe? What if they don't know what to do with 24 words?'
CTA: 'There is a better way.'

### Script 5: '\$140 Billion in Lost Bitcoin'
Hook: '\$140 billion in Bitcoin is permanently lost.'
Body: 'Much of it belongs to people who died or became incapacitated. Their families had no way to access it.'
CTA: 'Don't add to that number.'

### Script 6-10: Generate 5 more with similar structure covering: 'I almost lost my crypto', 'Why your estate lawyer can't help with Bitcoin', 'The 3 things every crypto holder must do', 'Non-custodial inheritance in 60 seconds', 'What Ledger users should know about inheritance'

## 5 LinkedIn Posts

### Post 1: Professional/Thought Leadership
Title: 'The \$140B Problem No One in Crypto is Solving'
(500 words about the inheritance problem, positioning LegacyGuard as infrastructure)

### Post 2: Data-Driven
Title: 'We analyzed 500,000 inactive wallets. Here is what we found.'
(Statistics-driven post about dormant wallets and likely deaths)

### Post 3-5: Generate covering: 'Why Fireblocks and BitGo need inheritance features', 'The legal nightmare of inheriting crypto', 'Building trust in a trustless system'

## 3 Long-Form Articles (Blog/Medium)

### Article 1: 'The Complete Guide to Crypto Inheritance Planning' (2000 words)
SEO target: 'crypto inheritance' (1,900 monthly searches)

### Article 2: 'Dead Man's Switch for Crypto: How It Works' (1500 words)
SEO target: 'dead man switch crypto' (880 monthly searches)

### Article 3: 'Non-Custodial Inheritance: Why You Don't Need to Trust Anyone' (1500 words)
SEO target: 'non custodial crypto inheritance' (320 monthly searches)

## Content Calendar (First 30 Days)
| Day | Platform | Content Type | Topic |
(Fill in 30 days of content)

Generate a comprehensive content engine document in markdown format. Expand ALL sections fully - write out all 10 scripts, all 5 LinkedIn posts, all 3 articles in full, and the complete 30-day calendar. Include the date ${DATE} in the header.")

PROMPTS+=("Design the landing page conversion strategy for LegacyGuard.

# Landing Page Conversion Strategy

## Headline Options (A/B test)
A: 'Your Family Can't Access Your Crypto. Fix It in 5 Minutes.'
B: 'Protect Your Crypto Legacy — Without Trusting Anyone'
C: 'If You Die Tomorrow, Your Bitcoin Dies With You'

## Landing Page Structure

### Section 1: Hero
- Headline (one of above)
- Subheadline: 'Non-custodial inheritance for self-custody crypto holders'
- CTA: 'Protect Your Legacy — Free Setup'
- Trust badges: 'Non-custodial | Open source | Audited'

### Section 2: The Problem (emotional)
- '\$140B in crypto is permanently lost'
- 'Your seed phrase in a safe is not enough'
- 'Your family doesn't know what 24 words mean'

### Section 3: How It Works (3 steps)
Step 1: Create your vault (connect wallets, store instructions)
Step 2: Designate your heirs (they verify identity)
Step 3: Set your switch (check in periodically, or heirs get access)

### Section 4: Trust Section
- 'We never see your keys'
- 'Your key is split into 3 pieces — we hold only 1'
- 'Open source | Security audited | Non-custodial'
- Shard visualization diagram

### Section 5: Pricing
- Free tier: 1 vault, 1 heir
- Pro (\$9.99/mo): Multiple vaults, multiple heirs, priority support
- Enterprise: Custom, API access

### Section 6: FAQ
- 'Is this safe?' - non-custodial explanation
- 'What if LegacyGuard disappears?' - open source, distributed shards
- 'How is this different from writing down my seed phrase?' - automation, verification, reliability

### Section 7: CTA
- Email capture: 'Enter your email to get started'
- Social proof: 'Join 500+ crypto holders protecting their legacy'

## Waitlist/Email Capture
- Simple form: email + 'How much crypto do you hold?' dropdown
- Auto-response email with next steps
- Weekly newsletter with crypto inheritance tips

## Conversion Optimization
| Element | Test | Metric |
| Headline | A/B/C test | Click-through rate |
| CTA color | Gold vs Green | Conversion rate |
| Trust badges | With vs without | Signup rate |
| Pricing display | Show vs hide | Signup rate |

Generate a comprehensive landing page conversion strategy document in markdown format. Expand on all sections with actionable details. Include the date ${DATE} in the header.")

PROMPTS+=("Define pricing strategy for LegacyGuard.

# Pricing Strategy

## Model 1: Freemium + Subscription
### Free Tier
- 1 vault, 1 heir, basic trigger (90-day minimum)
- Email check-in only
- Community support

### Pro (\$9.99/month or \$99/year)
- Unlimited vaults and heirs
- Custom trigger intervals (30-365 days)
- Multiple check-in methods (email, SMS, app push)
- Priority support
- Advanced security dashboard

### Enterprise (\$499/month)
- API access
- White-label integration
- Custom SLA
- Dedicated support
- Compliance reports

### Expected Conversion
- Free to Pro: 5-10% within 90 days
- Pro to Enterprise: 1-2% of Pro users

## Model 2: One-Time Setup Fee
### Basic (\$49 one-time)
- 1 vault, 1 heir, 1 year of service
- Renewal: \$29/year

### Premium (\$149 one-time)
- Unlimited vaults/heirs, 1 year
- Renewal: \$99/year

### Family (\$299 one-time)
- Multiple family members, shared dashboard
- Renewal: \$199/year

## Model 3: Pay-Per-Activation
- Free setup and maintenance
- \$99 fee when inheritance is actually triggered
- Higher fee for institutional: \$999

## Pricing Comparison
| Model | User Friction | Revenue Predictability | LTV | Best For |
| Freemium | Low | High (recurring) | \$300-500 | Scale |
| One-time | Medium | Low | \$49-299 | Trust-skeptical |
| Per-activation | Very Low | Very Low | \$99-999 | Partnerships |

## Recommendation
Start with Freemium + Subscription (Model 1):
- Low barrier to entry (free tier builds trust)
- Recurring revenue (investor-friendly)
- Natural upgrade path
- Can always add one-time options later

## Willingness-to-Pay Analysis
- Self-custody retail: \$5-15/month
- HNWIs: \$50-200/month
- Family offices: \$500-2000/month
- Wallet partners (API): \$5K-50K/year

Generate a comprehensive pricing strategy document in markdown format. Expand on all sections with actionable details. Include the date ${DATE} in the header.")

PROMPTS+=("Create a step-by-step plan to acquire first 100 users for LegacyGuard.

# First 100 Users Plan

## Pre-Launch (Day -7 to 0)
- Set up Twitter account, write bio, pin tweet about mission
- Set up Reddit account, build karma in r/cryptocurrency
- Create LegacyGuard landing page with waitlist
- Record 3 TikTok/Reels videos
- Write 2 LinkedIn posts
- Identify 20 crypto influencers to contact
- Join 10 crypto Discord servers
- Prepare 50 personalized DMs

## Week 1 (Day 1-7): Launch Push — Target: 20 users
### Day 1: Launch Day
- Post launch thread on Twitter (10-tweet thread about the problem)
- Post on Reddit r/cryptocurrency
- Post on Hacker News (Show HN)
- Send to 5 crypto influencers

### Day 2-3: Engagement
- Respond to EVERY comment
- DM 20 people who engaged with launch post
- Post TikTok #1

### Day 4-5: Community
- Host Twitter Space: 'What happens to your crypto when you die?'
- Post in 5 Discord servers
- Post LinkedIn #1

### Day 6-7: Iterate
- Analyze first user feedback
- Fix top friction points
- Post TikTok #2

## Week 2 (Day 8-14): Community — Target: +30 users (total: 50)
- Reddit AMA in r/cryptocurrency
- 3 more TikToks
- LinkedIn post #2
- DM 30 more engaged users
- Send to 10 more influencers
- Guest on 1 crypto podcast (pitch 10, land 1)

## Week 3 (Day 15-21): Partnerships — Target: +25 users (total: 75)
- Reach out to 3 hardware wallet communities
- Speak in 2 crypto Discord AMAs
- Post long-form article #1 (SEO play)
- Run Twitter poll about crypto inheritance
- Collect and publish 3 user testimonials

## Week 4 (Day 22-30): Scale — Target: +25 users (total: 100)
- Post remaining TikToks
- LinkedIn post #3-5
- Reddit engagement (answer inheritance questions)
- Contact crypto newsletter for feature
- Launch referral program (free Pro for referrals)
- Publish case study: 'How 100 crypto holders protected their legacy'

## Daily Routine (Founder)
| Time | Action |
| 8:00 | Check analytics, respond to DMs |
| 9:00 | Create 1 piece of content |
| 10:00 | Engage in 3 crypto communities |
| 11:00 | Send 10 outreach DMs |
| 14:00 | 1 user interview |
| 16:00 | Post content |
| 20:00 | Engage on Twitter |

## Budget: \$0-500
- \$0: Organic content, community engagement
- \$200: Small Twitter ad budget for testing
- \$300: Tools (scheduling, analytics)

## Risk Mitigation
| Risk | Mitigation |
| No engagement | Pivot content angle (more emotional, more data) |
| Trust concerns | Add security audit badge, open source code |
| Low conversion | Simplify onboarding, add video walkthrough |
| Competition | Emphasize non-custodial, emphasize simplicity |

Generate a comprehensive first 100 users acquisition plan in markdown format. Expand on all sections with actionable details, specific tactics, and timelines. Include the date ${DATE} in the header.")

for i in 0 1 2 3 4 5; do
  echo "===== Generating document $((i+1))/6: ${FILENAMES[$i]} ====="
  
  # Escape the prompt for JSON
  ESCAPED_PROMPT=$(echo "${PROMPTS[$i]}" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))")
  
  PAYLOAD=$(cat <<JSONEOF
{
  "contents": [{
    "parts": [{
      "text": ${ESCAPED_PROMPT}
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 65536
  }
}
JSONEOF
)

  RESPONSE=$(curl -s -X POST "${BASE_URL}" \
    -H "Content-Type: application/json" \
    -d "${PAYLOAD}")
  
  # Check for errors
  ERROR=$(echo "$RESPONSE" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r.get('error',{}).get('message',''))" 2>/dev/null)
  if [ -n "$ERROR" ] && [ "$ERROR" != "" ]; then
    echo "ERROR for ${FILENAMES[$i]}: $ERROR"
  else
    # Extract text content
    TEXT=$(echo "$RESPONSE" | python3 -c "
import sys, json
r = json.load(sys.stdin)
parts = r['candidates'][0]['content']['parts']
print(parts[0]['text'])
" 2>/dev/null)
    
    if [ -n "$TEXT" ]; then
      echo "$TEXT" > "${REPORTS_DIR}/${FILENAMES[$i]}"
      echo "Saved: ${REPORTS_DIR}/${FILENAMES[$i]}"
      echo "Length: $(wc -c < "${REPORTS_DIR}/${FILENAMES[$i]}") bytes"
    else
      echo "FAILED to extract text for ${FILENAMES[$i]}"
      echo "$RESPONSE" | head -200
    fi
  fi
  
  if [ $i -lt 5 ]; then
    echo "Waiting 10 seconds..."
    sleep 10
  fi
done

echo "===== All done ====="
