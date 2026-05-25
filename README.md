# NMAC — Never Miss A Call

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Convex-1.39-EE342F?logo=convex&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/ElevenLabs-AI-black" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Bun-1.2-F9F1E1?logo=bun" />
</p>

**NMAC** is a full-stack SaaS platform that lets businesses manage, configure, and sell access to conversational voice AI agents powered by [ElevenLabs](https://elevenlabs.io). Operators register with their ElevenLabs API key, create agents, provision phone numbers via Twilio, and subscribe clients to usage plans — all from a single dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Subscription & Credits System](#subscription--credits-system)
- [ElevenLabs Webhook](#elevenlabs-webhook)
- [Contributing](#contributing)

---

## Overview

NMAC provides a two-tier user model:

- **Operators** — Business owners or resellers who sign up with their ElevenLabs API key. They create and configure voice AI agents, manage client accounts, assign agents to clients, and handle subscriptions.
- **Clients** — End-users provisioned by an operator. Clients receive credentials, a set of assigned agents, and a credit-based subscription plan that determines how many ElevenLabs characters/minutes they can consume each billing period.

When a call ends, ElevenLabs fires a webhook to the Convex HTTP router, which automatically deducts the usage cost (plus a 20% platform markup) from the client's remaining credits.

---

## Features

### Operator Dashboard

- **Authentication** — Custom email/password auth with AES-encrypted password storage (no third-party auth provider required)
- **Agent Management** — Create, update, tag, and delete ElevenLabs conversational AI agents. Full agent configuration including prompt, voice, and webhook tools
- **Voice Configuration** — Browse available ElevenLabs voices and assign them to agents
- **Knowledge Base** — View and manage knowledge base documents linked to agents
- **Phone Numbers** — Add Twilio phone numbers via ElevenLabs and assign them to agents for inbound/outbound calling
- **Client Management** — Create client accounts, assign agents, update credentials, and manage subscriptions
- **Subscription Tiers** — Assign clients to `base`, `pro`, or `business` plans with configurable billing intervals (in months)
- **Analytics & History** — View conversation history, playback call recordings (WaveSurfer audio player), and analyze usage data with Recharts
- **Profile Settings** — Update profile info, change password, upload avatar image (stored in Convex file storage)

### Client Portal

- Clients log in and interact only with the agents assigned to them by their operator
- Per-agent conversation widget powered by `@11labs/react`

### Backend (Convex)

- **Real-time database** with live queries — UI updates instantly across sessions
- **Encrypted passwords** — AES encryption/decryption via `crypto-js` using a server-side `SECRET_KEY`
- **Webhook endpoint** — HTTP action at `/webhook` verifies ElevenLabs signatures and deducts usage credits automatically
- **Scheduled credit resets** — Monthly `ctx.scheduler` jobs reset client credits at each billing cycle and cancel the subscription when the interval expires
- **Daily cron job** — Cleans up orphaned scheduled functions every day at 17:30 UTC
- **Image storage** — Convex native file storage for profile avatars with automatic cleanup on update/delete

### Frontend

- **File-based routing** with TanStack Router (auto code-splitting)
- **Server-state caching** via TanStack Query with a custom `useQuery` cache layer over Convex
- **Dark/light theme** with `next-themes`
- **Form validation** with React Hook Form + Zod
- **Animated UI** with Framer Motion and `canvas-confetti`
- **Phone number input** with international formatting via `react-phone-number-input`

---

## Project Structure

```
nmac/
├── convex/                   # Convex backend (database, mutations, queries, HTTP)
│   ├── schema.ts             # Database schema (user, client, agent tables)
│   ├── user.ts               # User auth mutations & queries
│   ├── client.ts             # Client CRUD & agent assignment
│   ├── agents.ts             # Agent CRUD mutations & queries
│   ├── subscriptions.ts      # Subscription management (subscribe, update, cancel)
│   ├── internals.ts          # Internal mutations: credit deduction, reset, cleanup
│   ├── http.ts               # HTTP router — ElevenLabs webhook handler
│   ├── crons.ts              # Daily cron: clean orphaned scheduled functions
│   ├── image.ts              # File storage helpers (upload URL, get URL)
│   ├── utils.ts              # encrypt/decrypt, credit helpers, shared getters
│   └── _generated/           # Auto-generated Convex types (do not edit)
│
├── src/
│   ├── api/                  # ElevenLabs API queries (TanStack Query options)
│   ├── cache/                # Custom useQuery wrapper caching Convex queries
│   ├── components/           # Shared UI components (shadcn/ui + custom)
│   ├── context/              # Auth context provider
│   ├── hoc/                  # Higher-order components (auth guards etc.)
│   ├── hooks/                # Custom hooks (useAgents, useAddPhoneNo, etc.)
│   ├── lib/                  # Utility functions
│   └── routes/               # TanStack Router file-based routes
│       ├── (auth)/           # Sign in & register pages
│       ├── agents.$agentId   # Public-facing agent widget (client portal)
│       ├── dashboard/
│       │   ├── analytics     # Usage analytics & charts
│       │   ├── agents/       # Agent list & per-agent config (prompt, voice, preview)
│       │   ├── clients/      # Client management & subscription control
│       │   ├── history       # Conversation history & audio playback
│       │   ├── phone/        # Phone number management
│       │   ├── project-settings/ # Global agent settings
│       │   └── settings      # User profile & account settings
│       └── pricing           # Pricing page
│
├── vite.config.js            # Vite config with webhook proxy
├── biome.json                # Biome linter/formatter config
├── vercel.json               # Vercel deployment config
└── package.json
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- A [Convex](https://convex.dev) account
- An [ElevenLabs](https://elevenlabs.io) account with Conversational AI access

### Installation

```bash
# Clone the repository
git clone https://github.com/ihtesham510/nmac.git
cd nmac

# Install dependencies
bun install
```

### Convex Setup

```bash
# Log in to Convex and initialise the project
npx convex dev
```

This will prompt you to link or create a Convex project and will generate `convex/_generated/`. Copy the deployment URL shown and add it to your `.env` file as `VITE_CONVEX_URL`.

Set the required backend environment variable:

```bash
npx convex env set SECRET_KEY "your-secret-key"
```

### Run Locally

```bash
# Start Vite dev server + Convex dev server concurrently
bun dev
```

The app will be available at `http://localhost:3000`.

### Other Scripts

| Command      | Description                                |
| ------------ | ------------------------------------------ |
| `bun dev`    | Start both Vite and Convex dev servers     |
| `bun start`  | Start Vite only (port 3000)                |
| `bun db:dev` | Start Convex dev server only               |
| `bun build`  | Production build (Vite + TypeScript check) |
| `bun lint`   | Run Biome checks + tsc                     |
| `bun check`  | Run Biome formatter/linter                 |
| `bun test`   | Run Vitest test suite                      |

---

## Subscription & Credits System

Subscriptions are stored inline on the `client` document. Three tiers are available:

| Tier       | Credits / Month |
| ---------- | --------------- |
| `base`     | 30,000          |
| `pro`      | 60,000          |
| `business` | 120,000         |

Credits map to ElevenLabs character usage. When a subscription is created, Convex scheduled functions are queued for each billing month using `ctx.scheduler.runAt`. On each trigger, `internals.resetCredits` either resets credits to the tier amount or cancels the subscription if the billing interval has elapsed.

Credit deduction is triggered by the ElevenLabs webhook: each call's `cost` (plus a 20% platform markup) is subtracted from the client's `remaining_credits` in real time.

---

## ElevenLabs Webhook

NMAC exposes a Convex HTTP action at `POST /webhook` (accessible at your `*.convex.site` URL).

Configure this URL in your ElevenLabs dashboard under **Conversational AI → Webhooks**. The handler:

1. Validates the `ElevenLabs-Signature` header (timestamp + `v0=` signature)
2. Reads `agent_id` and `metadata.cost` from the event body
3. Finds the client(s) assigned to that agent and deducts from their remaining credits

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is private. All rights reserved.
