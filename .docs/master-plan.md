# Sensei App - Master Implementation Plan

## Context

The Sensei app is a hackathon project (Hacklahoma) that guides students through personalized self-improvement via AI-powered conversation. The product has 4 phases: Intake, Sensei Conversation, Reflection, and Follow-Up Evaluation. Currently, only the frontend intake flow exists (React 19 + Vite, 11-step wizard). Everything else -- backend, database, auth, LLM integration, calendar integration, and deployment -- needs to be built.

This plan migrates the app to TanStack Start + Cloudflare Workers + D1 + Drizzle, adds Google OAuth, Anthropic Claude for LLM agents, and real Google Calendar integration.

---

## Target Stack

| Layer | Tool |
|-------|------|
| Framework | TanStack Start (full-stack React) |
| Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| Auth | Google OAuth (shared tokens for Calendar API) |
| LLM | Anthropic Claude API |
| Calendar | Google Calendar API |
| CSS | Tailwind CSS v4 |
| Deployment | Cloudflare via Wrangler CLI |

---

## Build Phases

### Phase 1: Foundation (3 parallel workstreams)
- WS-A: Framework Migration (Vite → TanStack Start + Cloudflare)
- WS-B: Database Schema + ORM (Drizzle + D1)
- WS-C: Google OAuth + Sessions

### Phase 2: Core Services (2 parallel workstreams)
- WS-D: LLM Agent System (Sensei + Reflection)
- WS-E: Google Calendar Integration

### Phase 3: Integration Wiring (sequential)
- WS-F: Intake-to-Backend Wiring
- WS-G: End-to-End Flow Wiring

### Phase 4: Polish (2 parallel workstreams)
- WS-H: Dashboard + UI Polish
- WS-I: Error Handling + Deployment

---

## Database Schema

7 tables defined in `server/db/schema.ts`:
- users, user_profiles, interactions, messages, scheduled_actions, reflection_records, follow_up_checks

## API Routes

Auth, Profile, Chat, Calendar, Reflection, Follow-Up endpoints as defined in the approved plan.

## Key References

- `.docs/sensei-app-flow-and-prompts.md` — Canonical agent prompts
- `.docs/sensei-intake-flow.md` — Intake flow spec
