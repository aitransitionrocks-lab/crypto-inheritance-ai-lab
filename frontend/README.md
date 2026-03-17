# LegacyGuard Frontend

Crypto inheritance planning frontend built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

| Route | Description |
|---|---|
| `/` | Landing page with value proposition |
| `/signup` | User registration |
| `/setup/vault` | Vault setup (step 1/3) - Key splitting |
| `/setup/plan` | Plan creation (step 2/3) - Heirs & triggers |
| `/setup/complete` | Setup complete (step 3/3) |
| `/dashboard` | Main dashboard with metrics & plans |
| `/checkin` | Check-in confirmation |
| `/security` | Security & trust information |
| `/partners` | Partner integration portal |
| `/developers` | Developer API documentation |

## Tech Stack

- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with LegacyGuard design system
- **Lucide React** - Icon library

## Design System

Colors follow the LegacyGuard design system:
- Primary: Deep Navy (#1a2332)
- Accent: Warm Gold (#c9a84c)
- Semantic: Success (#22c55e), Warning (#f59e0b), Error (#ef4444), Info (#3b82f6)

## API Configuration

Set the backend URL via environment variable:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```
