# Sensei

An AI-powered personal accountability coach that helps students identify meaningful areas for self-improvement, schedule concrete actions, and reflect on progress.

## Overview

**Sensei** is a Hacklahoma competition entry that pairs users with a conversational AI mentor (powered by Claude) to set goals, create calendar commitments, and build lasting habits through guided reflection.

### How It Works

1. **Intake** -- An 11-step questionnaire captures the user's challenges, goals, learning style, and preferences to build a personalized coaching profile.
2. **Sensei Session** -- A conversational agent asks "What's the one thing you'd like to do better?" and collaboratively identifies actionable next steps, scheduling them as Google Calendar events.
3. **Reflection** -- After completing an action, users follow a calendar link to reflect on the experience with a dedicated reflection agent.
4. **Follow-Up** -- A cron job checks for missed reflections and sends profile-aware reminders based on the user's notification preferences.

## Features

- **Personalized Onboarding** -- Multi-step intake wizard that resolves a persona profile (Coach, Ignition, Pacer, Stabilizer, Adaptive)
- **Conversational Goal-Setting** -- Claude-powered exploration without pressure or lectures
- **Google Calendar Integration** -- Seamless event creation with embedded reflection links
- **Automated Follow-Ups** -- Profile-respecting reminders for missed reflections
- **Context Preservation** -- Full interaction history available to agents for continuity across sessions
- **Dark Mode** -- Theme toggle with persistent preference

## Tech Stack

- **Frontend**: React 19, TanStack Start/Router, Tailwind CSS, Framer Motion
- **Backend**: Cloudflare Workers, Cloudflare D1 (SQLite), Drizzle ORM
- **AI**: Anthropic Claude (Sonnet 4.5)
- **Auth**: Google OAuth 2.0 with HMAC-signed session cookies
- **Calendar**: Google Calendar API
- **Language**: TypeScript (strict mode), validated with Biome

## Project Structure

```
hacklahoma-dream-team/
├── app/                      # Frontend (React + TanStack Start)
│   ├── components/           # UI components
│   ├── contexts/             # Auth & intake state
│   └── routes/               # Page routes (/, /chat, /dashboard, /intake, /profile)
├── server/                   # Backend (Cloudflare Workers)
│   ├── agents/               # Sensei & Reflection AI agents
│   ├── auth/                 # Google OAuth flow
│   ├── calendar/             # Google Calendar integration
│   ├── cron/                 # Automated follow-up checks
│   ├── db/                   # Drizzle schema & migrations
│   └── routes/               # API endpoints
├── shared/                   # Shared types & resolution logic
├── config/                   # Configuration files
├── scripts/                  # Utility and automation scripts
└── tests/                    # Test suites
```

## Quick Start

### Prerequisites

- Node.js 18+
- Wrangler CLI (for Cloudflare Workers)
- Google Cloud project with OAuth 2.0 and Calendar API enabled
- Anthropic API key

### Installation

```bash
npm install
```

### Development

```bash
npx wrangler dev
```

## License

See repository for license details.
