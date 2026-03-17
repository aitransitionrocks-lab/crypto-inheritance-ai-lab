#!/usr/bin/env python3
"""Generate 6 GTM documents via Gemini REST API."""

import httpx
import time
import os

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
API_KEY = os.environ.get("GEMINI_API_KEY", "")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
REPORTS_DIR = "/Users/petermarggraff/AI-projekte/crypto_inheritance_ai_lab/reports"
DATE = "2026-03-17"

DOCS = [
    {
        "file": "gtm_entry_strategy.md",
        "title": "GTM Entry Strategy",
        "system": "You are a growth strategist for LegacyGuard, a crypto inheritance protocol.",
        "prompt": "Define GTM entry strategy. Choose ONE wedge: Crypto Twitter self-custody users. Explain why this wedge, where they hang out (Twitter, Reddit, Discord, YouTube, podcasts — name specific accounts/subreddits), how to reach them (organic content, community, influencer seeding, SEO). Include entry metrics table with 30-day and 90-day targets for followers, visitors, signups, setups, paid conversions."
    },
    {
        "file": "acquisition_channels.md",
        "title": "Acquisition Channels",
        "system": "You are a user acquisition specialist for a crypto product.",
        "prompt": "Define 3 acquisition channels for LegacyGuard. Channel 1: Organic content (Twitter/LinkedIn) — post frequency, messaging angles (fear, education, social proof, solution), expected conversion funnel percentages. Channel 2: Community engagement (Reddit, Discord) — strategy, messaging, conversion expectations. Channel 3: Strategic partnerships (influencers, wallet communities, conferences) — specific targets, expected signup numbers. Include priority matrix table scoring cost, speed, scale, quality for each channel."
    },
    {
        "file": "content_engine.md",
        "title": "Content Engine",
        "system": "You are a viral content strategist for crypto products.",
        "prompt": "Create complete content engine for LegacyGuard. Include: 4 content pillars (fear, education, trust, solution). Write 10 TikTok/Reels scripts (30-60s each, with hook/body/CTA). Write 5 LinkedIn posts (each 300-500 words). Write 3 long-form article outlines (blog/Medium, 1500-2000 words each with SEO targets). Create a 30-day content calendar table (day, platform, content type, topic)."
    },
    {
        "file": "landing_conversion.md",
        "title": "Landing Page Conversion Strategy",
        "system": "You are a conversion rate optimization specialist.",
        "prompt": "Design landing page conversion strategy for LegacyGuard. Include: 3 headline options for A/B testing. Full landing page structure (7 sections: hero, problem, how it works, trust, pricing, FAQ, CTA). Waitlist/email capture design. Conversion optimization tests table (element, test, metric). Pricing display strategy (free tier, pro $9.99/mo, enterprise $499/mo)."
    },
    {
        "file": "pricing_strategy.md",
        "title": "Pricing Strategy",
        "system": "You are a SaaS pricing strategist.",
        "prompt": "Define pricing strategy for LegacyGuard. Model 1: Freemium + subscription (free/pro $9.99/mo/enterprise $499/mo with features per tier). Model 2: One-time setup fee ($49/$149/$299 tiers). Model 3: Pay-per-activation ($99 when inheritance triggers). Comparison table scoring user friction, revenue predictability, LTV for each. Recommendation with reasoning. Willingness-to-pay analysis per segment (retail, HNWI, family office, partners)."
    },
    {
        "file": "first_100_users.md",
        "title": "First 100 Users Plan",
        "system": "You are a startup growth hacker.",
        "prompt": "Create step-by-step plan to acquire first 100 LegacyGuard users. Pre-launch (day -7 to 0): setup accounts, create content, identify influencers. Week 1 (target 20 users): launch thread, Reddit post, HN Show, DMs, TikToks. Week 2 (target +30): Reddit AMA, more TikToks, podcast outreach. Week 3 (target +25): hardware wallet communities, Discord AMAs, SEO article. Week 4 (target +25): newsletter outreach, referral program, case study. Include daily founder routine table. Budget: $0-500. Risk mitigation table."
    },
]

def generate_doc(doc, index):
    print(f"\n[{index+1}/6] Generating {doc['file']}...")
    payload = {
        "system_instruction": {
            "parts": [{"text": doc["system"]}]
        },
        "contents": [
            {"parts": [{"text": doc["prompt"]}]}
        ],
        "generationConfig": {
            "maxOutputTokens": 8192,
            "temperature": 0.3
        }
    }

    with httpx.Client(timeout=180) as client:
        resp = client.post(URL, json=payload)

    if resp.status_code != 200:
        print(f"  ERROR: Status {resp.status_code}")
        print(f"  {resp.text[:500]}")
        return False

    data = resp.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]

    header = f"# {doc['title']}\n\n**Date:** {DATE}\n\n---\n\n"
    content = header + text

    filepath = os.path.join(REPORTS_DIR, doc["file"])
    with open(filepath, "w") as f:
        f.write(content)

    size = os.path.getsize(filepath)
    print(f"  Done: {filepath} ({size:,} bytes)")
    return True

if __name__ == "__main__":
    for i, doc in enumerate(DOCS):
        success = generate_doc(doc, i)
        if not success:
            print(f"  Failed to generate {doc['file']}, continuing...")
        if i < len(DOCS) - 1:
            print(f"  Waiting 10 seconds before next call...")
            time.sleep(10)

    print("\n=== Final File Sizes ===")
    for doc in DOCS:
        filepath = os.path.join(REPORTS_DIR, doc["file"])
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            print(f"  {doc['file']}: {size:,} bytes")
        else:
            print(f"  {doc['file']}: NOT GENERATED")
