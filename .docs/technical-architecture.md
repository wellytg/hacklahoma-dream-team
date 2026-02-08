# Sensei App: Technical Architecture Document

## 1. Executive Summary

Sensei is an AI-powered personal accountability coach that guides users through goal identification, schedules concrete actions on Google Calendar, and follows up with reflective check-ins. It runs as a serverless application on Cloudflare Workers with a React 19 frontend, using Claude as the conversational backbone.

**Production URL:** `https://sensei-app.team-deetsuite.workers.dev`

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.0 |
| **Routing** | TanStack Router | 1.158+ |
| **Meta-Framework** | TanStack Start | 1.159+ |
| **Build Tool** | Vite | 7.3+ |
| **Styling** | Tailwind CSS | 4.1+ |
| **Animation** | Framer Motion | 12.33+ |
| **Icons** | Lucide React | 0.463+ |
| **Markdown** | react-markdown | 10.1+ |
| **Date Utilities** | date-fns | 4.1+ |
| **Validation** | Zod | 3.24+ |
| **Runtime** | Cloudflare Workers | (nodejs_compat) |
| **Database** | Cloudflare D1 (SQLite) | - |
| **ORM** | Drizzle | 0.38+ |
| **AI** | Anthropic Claude (Sonnet 4.5) | SDK 0.39+ |
| **Auth** | Google OAuth 2.0 + HMAC cookies | - |
| **Linting** | Biome | 2.3.14 |
| **Language** | TypeScript | 5.7+ (strict) |
| **Deployment** | Wrangler | 4.0+ |

---

## 3. Project Structure

```
hacklahoma-dream-team/
├── app/                            # Frontend (TanStack Start)
│   ├── client.tsx                  # Client entry
│   ├── server.ts                   # Custom CF Workers entry (fetch + scheduled)
│   ├── routeTree.gen.ts            # Auto-generated route tree
│   ├── routes/
│   │   ├── __root.tsx              # Root layout + shell component
│   │   ├── index.tsx               # Landing page (/)
│   │   ├── _authenticated.tsx      # Auth guard layout
│   │   ├── _authenticated/
│   │   │   ├── chat.tsx            # Chat interface (/chat)
│   │   │   ├── dashboard.tsx       # Action dashboard (/dashboard)
│   │   │   ├── intake.tsx          # Onboarding flow (/intake)
│   │   │   └── profile.tsx         # User profile (/profile)
│   │   └── auth/
│   │       ├── callback.tsx        # OAuth callback (/auth/callback)
│   │       └── login.tsx           # Login redirect (/auth/login)
│   ├── components/
│   │   ├── ActionCardSkeleton.tsx  # Loading placeholder
│   │   ├── ErrorBoundary.tsx       # Root error boundary
│   │   ├── IntakeFlow.tsx          # 11-step intake form
│   │   ├── ProgressBar.tsx         # Animated progress bar
│   │   ├── QuestionStep.tsx        # Intake question renderer
│   │   ├── ThemeToggle.tsx         # Dark mode toggle
│   │   └── TypingIndicator.tsx     # Chat typing dots
│   ├── context/
│   │   ├── AuthContext.tsx          # Authentication state
│   │   └── IntakeContext.tsx        # Intake form state
│   └── styles/
│       └── globals.css             # Tailwind + custom fonts
├── server/                         # Backend
│   ├── agents/
│   │   ├── sensei.ts               # Sensei agent (goal-setting)
│   │   ├── reflection.ts           # Reflection agent (check-in)
│   │   ├── context.ts              # Context builders
│   │   └── tools.ts                # Tool schemas + executors
│   ├── auth/
│   │   ├── google.ts               # Google OAuth helpers
│   │   └── session.ts              # HMAC cookie sessions
│   ├── calendar/
│   │   └── google.ts               # Google Calendar API
│   ├── cron/
│   │   ├── index.ts                # Cron entry (handleScheduled)
│   │   ├── follow-up-handler.ts    # Missed reflection processor
│   │   └── message-composer.ts     # Claude follow-up messages
│   ├── db/
│   │   ├── index.ts                # Drizzle client init
│   │   ├── schema.ts               # Table definitions
│   │   └── migrations/             # SQL migrations
│   └── routes/
│       ├── auth.ts                 # Auth server functions
│       ├── chat.ts                 # Chat + action server functions
│       └── profile.ts              # Profile server functions
├── shared/
│   └── types.ts                    # Shared TypeScript types
├── biome.json                      # Linter config
├── package.json                    # Dependencies + scripts
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Build config
└── wrangler.toml                   # Cloudflare config
```

---

## 4. Architecture Overview

```
                    ┌────────────────────────────────────────────────┐
                    │             Client (React 19)                  │
                    │  ┌──────────┐ ┌─────────┐ ┌───────────────┐   │
                    │  │ AuthCtx  │ │IntakeCtx│ │  TanStack     │   │
                    │  │ Provider │ │Provider │ │  Router       │   │
                    │  └────┬─────┘ └────┬────┘ └───────┬───────┘   │
                    │       │            │              │            │
                    │  ┌────┴────────────┴──────────────┴────────┐  │
                    │  │        Server Function Calls (RPC)      │  │
                    │  └─────────────────┬───────────────────────┘  │
                    └────────────────────┼──────────────────────────┘
                                         │
                    ┌────────────────────┼──────────────────────────┐
                    │  Cloudflare Worker │ (app/server.ts)          │
                    │                    ▼                          │
                    │  ┌─────────────────────────────────────────┐  │
                    │  │       TanStack Start Fetch Handler      │  │
                    │  └──────────────────┬──────────────────────┘  │
                    │                     │                         │
                    │  ┌──────────────────┴──────────────────────┐  │
                    │  │          Server Routes (RPC)            │  │
                    │  │  auth.ts │ chat.ts │ profile.ts         │  │
                    │  └──┬───────────┬──────────┬──────────────┘  │
                    │     │           │          │                  │
                    │     ▼           ▼          ▼                  │
                    │  ┌──────┐  ┌────────┐  ┌───────┐             │
                    │  │ Auth │  │ Agent  │  │  D1   │             │
                    │  │System│  │ System │  │(Drizzle│             │
                    │  └──┬───┘  └──┬─────┘  └───┬───┘             │
                    └─────┼─────────┼────────────┼─────────────────┘
                          │         │            │
              ┌───────────┼─────────┼────────────┘
              │           │         │
              ▼           ▼         ▼
        ┌──────────┐ ┌────────┐ ┌────────────┐
        │  Google  │ │ Claude │ │ Cloudflare │
        │  OAuth + │ │  API   │ │   D1 DB    │
        │ Calendar │ └────────┘ │  (SQLite)  │
        └──────────┘            └────────────┘

                    ┌────────────────────────────────────────┐
                    │  Cron (every 15 min)                   │
                    │  handleScheduled() → processFollowUps  │
                    │    → Compose Claude message             │
                    │    → Mark missed actions                │
                    └────────────────────────────────────────┘
```

---

## 5. Route Map

| Route | File | Auth | Purpose |
|-------|------|------|---------|
| `/` | `index.tsx` | Public | Landing page; redirects to `/dashboard` if logged in |
| `/auth/login` | `auth/login.tsx` | Public | Redirects to Google OAuth |
| `/auth/callback` | `auth/callback.tsx` | Public | OAuth callback; sets session cookie |
| `/dashboard` | `_authenticated/dashboard.tsx` | Required | Action stats, list, management |
| `/chat` | `_authenticated/chat.tsx` | Required | Conversational interface (sensei or reflection) |
| `/intake` | `_authenticated/intake.tsx` | Required | 11-step onboarding questionnaire |
| `/profile` | `_authenticated/profile.tsx` | Required | Read-only resolved profile view |

---

## 6. Authentication System

### 6.1 OAuth Flow

```
User clicks Login
      │
      ▼
getLoginUrl() → Google Authorization URL
      │         (scopes: openid, email, profile, calendar.events)
      ▼
Google Consent Screen → /auth/callback?code=...
      │
      ▼
handleAuthCallback(code)
      ├─ Exchange code for tokens (access, refresh, ID)
      ├─ Fetch user profile from Google UserInfo
      ├─ Upsert user in DB (store tokens)
      └─ Create HMAC-SHA256 signed session cookie
            │
            ▼
      Cookie: <base64url(userId)>.<base64url(hmac)>
      Flags: HttpOnly, Secure, SameSite=Lax, Max-Age=7d
```

### 6.2 Session Validation

Every authenticated server function:
1. Reads `sensei_session` cookie
2. Splits into `encodedId.signature`
3. Recomputes HMAC-SHA256 with `SESSION_SECRET`
4. Compares signatures (timing-safe via Web Crypto)
5. Returns `userId` if valid; `null` if tampered

### 6.3 Token Refresh

Google access tokens are short-lived (~1 hour). `getValidAccessToken()`:
- Checks `users.googleTokenExpiry` against `Date.now()` (with 60s buffer)
- If expired: uses `googleRefreshToken` to obtain fresh `accessToken`
- Writes new token + expiry back to DB

---

## 7. Database Schema

### 7.1 Entity-Relationship Diagram

```
users (root)
  │
  ├──1:1── user_profiles
  │          (intake answers, preferences, resolved state)
  │
  ├──1:N── interactions
  │          │  (conversation sessions)
  │          │
  │          └──1:N── messages
  │                    (user/assistant/system messages)
  │
  └──1:N── scheduled_actions
              │  (calendar commitments)
              │
              ├──1:N── reflection_records
              │          (post-action feedback)
              │
              └──1:N── follow_up_checks
                         (cron-triggered evaluations)
```

### 7.2 Table Definitions

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| email | TEXT | UNIQUE, NOT NULL |
| name | TEXT | - |
| googleId | TEXT | UNIQUE, NOT NULL |
| googleAccessToken | TEXT | - |
| googleRefreshToken | TEXT | - |
| googleTokenExpiry | INTEGER | Unix ms |
| createdAt | TEXT | DEFAULT datetime('now') |
| updatedAt | TEXT | DEFAULT datetime('now') |

#### `user_profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| userId | TEXT | FK users, UNIQUE |
| intent | TEXT | JSON array |
| mode | TEXT | COACH/IGNITION/PACER/STABILIZER/ADAPTIVE |
| drains | TEXT | Free text |
| capabilities | TEXT | Free text |
| avoidanceRoot | TEXT | Free text |
| structurePref | TEXT | Free text |
| valueAlignment | TEXT | Free text |
| focusTime | TEXT | Optional |
| workBurst | TEXT | Optional |
| recovery | TEXT | Optional |
| learnStyle | TEXT | Optional |
| feedbackPref | TEXT | Optional |
| reminderPref | TEXT | Optional |
| accessNeeds | TEXT | JSON array |
| resolvedState | TEXT | JSON blob (ResolvedStateModel) |
| notificationTolerance | TEXT | high/medium/low |
| preferredOutreach | TEXT | JSON array |
| nudgePreference | TEXT | active/passive/escalating |
| intakeCompletedAt | TEXT | - |
| updatedAt | TEXT | DEFAULT datetime('now') |

#### `interactions`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| userId | TEXT | FK users, indexed |
| type | TEXT | sensei_session / reflection |
| status | TEXT | active / completed / abandoned |
| summary | TEXT | Auto-generated on completion |
| createdAt | TEXT | DEFAULT datetime('now') |
| completedAt | TEXT | - |

#### `messages`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| interactionId | TEXT | FK interactions, indexed |
| role | TEXT | user / assistant / system |
| content | TEXT | NOT NULL |
| createdAt | TEXT | DEFAULT datetime('now') |

#### `scheduled_actions`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| userId | TEXT | FK users, indexed |
| interactionId | TEXT | FK interactions |
| calendarEventId | TEXT | Google Calendar event ID |
| calendarHtmlLink | TEXT | Calendar link (with authuser) |
| reflectionEventId | TEXT | Reflection calendar event ID |
| title | TEXT | NOT NULL |
| description | TEXT | - |
| scheduledAt | TEXT | NOT NULL, ISO 8601 |
| durationMinutes | INTEGER | DEFAULT 30 |
| goalArea | TEXT | sleep/fitness/learning/etc. |
| goalContext | TEXT | Why it matters |
| reflectionScheduledAt | TEXT | Typically +12h after action end |
| followUpScheduledAt | TEXT | Typically +2h after reflection |
| status | TEXT | pending/completed/missed/cancelled, indexed |
| createdAt | TEXT | DEFAULT datetime('now') |

#### `reflection_records`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| userId | TEXT | FK users, indexed |
| actionId | TEXT | FK scheduled_actions, indexed |
| interactionId | TEXT | FK interactions |
| completed | TEXT | yes / no / partial |
| userSummary | TEXT | User's own words |
| barriers | TEXT | JSON array |
| emotionalTone | TEXT | positive/neutral/negative/mixed |
| wantsToRepeat | TEXT | yes/no/unsure |
| agentNotes | TEXT | Agent observations |
| createdAt | TEXT | DEFAULT datetime('now') |

#### `follow_up_checks`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK |
| userId | TEXT | FK users, indexed |
| actionId | TEXT | FK scheduled_actions, indexed |
| reflectionFound | INTEGER | Boolean (0/1) |
| strategyApplied | TEXT | active_outreach/passive_record/custom/none |
| outreachChannel | TEXT | Future: email/SMS/in-app |
| outreachTone | TEXT | gentle/warm/direct |
| outreachContent | TEXT | Generated message |
| scheduledAt | TEXT | NOT NULL |
| executedAt | TEXT | NULL until cron runs |
| createdAt | TEXT | DEFAULT datetime('now') |

### 7.3 Action Timeline

```
t0                  scheduledAt (action occurs)
                    └── Google Calendar: action event

t0 + duration       action ends

t0 + duration       reflectionScheduledAt (default +12h)
+ 12h               └── Google Calendar: reflection event (15 min)

t0 + duration       followUpScheduledAt (+2h after reflection)
+ 14h               └── Cron: check for reflection record
```

---

## 8. Server Functions (RPC API)

All endpoints are TanStack Start `createServerFn()` calls, authenticated via session cookie.

### 8.1 Auth Routes (`server/routes/auth.ts`)

| Function | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `getLoginUrl` | GET | - | `{ url }` | Google OAuth authorization URL |
| `handleAuthCallback` | POST | `{ code }` | `{ userId }` | Exchange code, upsert user, set cookie |
| `logout` | POST | - | `{ success }` | Delete session cookie |
| `getMe` | GET | - | `{ user \| null }` | Validate session, return user |

### 8.2 Chat Routes (`server/routes/chat.ts`)

| Function | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `startSession` | POST | `{ mode, actionId? }` | `{ interactionId, greeting }` | Create interaction, get agent greeting |
| `sendMessage` | POST | `{ interactionId, content, actionId? }` | `{ message, actions[] }` | Send message, get agent response |
| `getMessages` | GET | `{ interactionId }` | `{ messages[] }` | Load conversation history |
| `getActiveSession` | GET | - | `{ session \| null }` | Most recent active interaction |
| `getScheduledActions` | GET | - | `{ actions[] }` | 10 most recent actions for dashboard |
| `updateScheduledAction` | POST | `{ actionId, scheduledAt }` | `{ success, times }` | Reschedule (pending only) |
| `deleteScheduledAction` | POST | `{ actionId }` | `{ success }` | Delete action + calendar events |

### 8.3 Profile Routes (`server/routes/profile.ts`)

| Function | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `saveProfile` | POST | `{ answers, resolvedState? }` | `{ success }` | Upsert intake profile |
| `getProfile` | GET | - | `{ profile \| null }` | Fetch parsed profile |

---

## 9. AI Agent System

### 9.1 Dual-Agent Architecture

The system uses two specialized agents, each with distinct personas and tools:

| Agent | File | Model | Tools | Purpose |
|-------|------|-------|-------|---------|
| **Sensei** | `server/agents/sensei.ts` | claude-sonnet-4-5-20250929 | `schedule_action` | Goal identification and action scheduling |
| **Reflection** | `server/agents/reflection.ts` | claude-sonnet-4-5-20250929 | `complete_reflection` | Post-action reflective check-in |

### 9.2 Tool-Use Loop

Both agents implement a 3-iteration tool-use loop:

```
for i in 0..2:
    response = Claude.messages.create(system, tools, messages)

    if no tool_use blocks:
        return text response + collected actions

    for each tool_use block:
        execute tool → get result
        append tool_result to messages

    continue loop with augmented messages

return fallback text + collected actions
```

### 9.3 Tool Definitions

#### `schedule_action` (Sensei)
```
Input:  title*, startDateTime*, description, durationMinutes (30),
        goalArea, goalContext, reflectionDelayHours (12)
Effect: Creates 2 Google Calendar events (action + reflection),
        inserts scheduled_actions + follow_up_checks rows
Output: { actionId, calendarEventId, calendarHtmlLink }
```

#### `complete_reflection` (Reflection)
```
Input:  completed* (yes/no/partial), userSummary, barriers,
        emotionalTone, wantsToRepeat, agentNotes
Effect: Inserts reflection_records row,
        updates scheduled_actions.status
Output: { reflectionId }
```

### 9.4 Context System

Before each Claude API call, the agent system builds a rich context block injected into the system prompt:

**Sensei Context** (`buildSenseiContext`):
- Current timestamp (for relative scheduling)
- User name and full profile (mode, preferences, patterns)
- Last 5 interactions (type, summary)
- Last 5 scheduled actions (title, status, time)
- Last 5 reflections (completed, tone, repeat intent)
- Missed follow-ups (actions without reflections)
- Upcoming Google Calendar events (7 days, for conflict detection)

**Reflection Context** (`buildReflectionContext`):
- User profile (mode, feedback preference, avoidance root)
- The specific action being reflected on (title, time, goal, context)
- Original conversation that created the action (up to 20 messages)
- Patterns from recent reflections

### 9.5 Agent Personas

**Sensei:** Warm, patient, perceptive mentor. Opens with "What's the one thing you'd like to do better?" Explores barriers and past attempts. Guides toward specific, small, achievable actions. Never diagnoses, pressures, or lectures. Invisible goal: create a calendar event.

**Reflection:** Thoughtful, encouraging, nonjudgmental mirror. Opens by referencing the specific action. Asks how it went, what surprised them, whether they'd repeat it. Normalizes incomplete attempts. Never guilts or suggests new actions.

---

## 10. Cron System (Follow-Up Evaluation)

**Trigger:** Cloudflare Workers cron, every 15 minutes (`*/15 * * * *`)

**Entry:** `app/server.ts` exports `scheduled()` handler

### Processing Flow

```
processFollowUpChecks(env):
  1. Query follow_up_checks WHERE scheduledAt <= NOW AND executedAt IS NULL
  2. For each pending check:
     a. Check for existing reflection_records with same actionId
     b. If reflection exists:
        → Mark check: executedAt=NOW, reflectionFound=1, strategy='none'
     c. If no reflection:
        → Skip if action scheduledAt is still in the future
        → Load user profile (notification tolerance, nudge preference)
        → Compose follow-up message via Claude (max_tokens: 256)
        → Update scheduled_actions.status = 'missed'
        → Record outreach message/tone in follow_up_checks
        → Mark executedAt=NOW, reflectionFound=0
  3. Errors caught per-check (don't halt entire run)
```

**Message Composition:** Uses Claude (Sonnet 4.5) with a short prompt that adapts tone based on `notificationTolerance` (high=direct, medium=warm, low=gentle) and never guilts or shames.

**Current Scope:** MVP records messages but does not send them (future: email/SMS/in-app push).

---

## 11. Frontend Architecture

### 11.1 State Management

**AuthContext** — Global, wraps entire app at root:
- State: `user: User | null`, `loading: boolean`
- Methods: `login()`, `logout()`, `getMe()` (session hydration on mount)

**IntakeContext** — Wraps `/intake` route only:
- State: `currentStep`, `state: StudentStateModel`, `totalSteps: 11`
- Methods: `nextStep()`, `prevStep()`, `updateState()`, `getResolvedState()`
- Auto-behavior: Setting `intent` auto-resolves `mode` (persona)

### 11.2 Design System

- **Fonts:** Inter (body, sans-serif), Crimson Pro (headings, serif)
- **Colors:** Stone palette (neutrals), Emerald (primary/CTA), Amber (warnings), Red (errors)
- **Dark Mode:** `.dark` class on `<html>`, persisted in `localStorage.theme`, custom Tailwind variant
- **Animations:** Framer Motion for page transitions, typing indicator, mount/unmount
- **Responsive:** Mobile-first, breakpoints at `sm:` (640px) and `md:` (768px)

### 11.3 Key UI Patterns

- **Chat:** Auto-scrolling message list, markdown rendering, typing indicator, action confirmation cards with calendar links
- **Dashboard:** Stat cards (clickable to filter by status), action list with inline editing (reschedule) and deletion
- **Intake:** 11-step progressive form with animated transitions and summary confirmation
- **Error Handling:** Root-level React ErrorBoundary with refresh button

---

## 12. Data Flow Diagrams

### 12.1 Chat Session Flow

```
User clicks "Start New Session"
      │
      ▼
startSession({ mode: 'sensei_session' })
      │
      ├── INSERT interactions (status: active)
      ├── Call runSenseiTurn([{ role: 'user', content: '[Session started]' }])
      │     └── Build context → Claude API → greeting text
      ├── INSERT messages (role: assistant, content: greeting)
      └── Return { interactionId, greeting }
      │
      ▼
User types message → sendMessage({ interactionId, content })
      │
      ├── INSERT messages (role: user)
      ├── SELECT all messages for interaction (conversation replay)
      ├── Call runSenseiTurn(fullHistory, { allowScheduling: true })
      │     ├── Build context (profile, history, calendar)
      │     ├── Claude API with tools enabled
      │     ├── If tool_use(schedule_action):
      │     │     ├── Create Google Calendar events
      │     │     ├── INSERT scheduled_actions
      │     │     ├── INSERT follow_up_checks
      │     │     └── Return actionId + calendarHtmlLink
      │     └── Extract final text response
      ├── INSERT messages (role: assistant)
      ├── If actions: UPDATE interactions (status: completed, summary)
      └── Return { message, actions[] }
```

### 12.2 Reflection Flow

```
User clicks "Reflect" on action card
      │
      ▼
startSession({ mode: 'reflection', actionId })
      │
      ├── INSERT interactions (type: reflection)
      ├── Call runReflectionTurn(db, userId, interactionId, actionId, ...)
      │     └── Load action context → Claude API → greeting
      └── Return greeting
      │
      ▼
User shares reflection → sendMessage(...)
      │
      ├── Claude asks follow-ups (1-2 rounds)
      └── Claude calls complete_reflection tool
            ├── INSERT reflection_records
            ├── UPDATE scheduled_actions.status → completed/missed
            └── UPDATE interactions.status → completed
```

### 12.3 Action Lifecycle

```
pending ────────────────────────────────────────────────┐
   │                                                     │
   ├── User reflects (complete_reflection tool)          │
   │     ├── completed='yes'/'partial' → status=completed│
   │     └── completed='no' → status=missed              │
   │                                                     │
   ├── Cron follow-up (no reflection found)              │
   │     └── status=missed                               │
   │                                                     │
   ├── User reschedules (updateScheduledAction)          │
   │     └── status stays pending, times updated         │
   │                                                     │
   └── User deletes (deleteScheduledAction)              │
         └── Calendar events deleted, DB rows removed    │
                                                         │
cancelled ◄─── (not currently used in code) ─────────────┘
```

---

## 13. Build & Deployment

### 13.1 Vite Plugin Chain

```typescript
plugins: [
  tailwindcss(),           // 1. Tailwind CSS v4 processing
  tsConfigPaths(),         // 2. ~/*, ~/server/* path aliases
  cloudflare({ ssr }),     // 3. Workers runtime integration
  tanstackStart({ app/ }), // 4. Route tree gen, SSR/CSR split
  viteReact(),             // 5. React JSX transformation
]
```

### 13.2 Build Pipeline

```
npm run build
  └── vite build         (bundles client + server)
  └── tsc --noEmit       (type checking only)

npm run deploy
  └── npm run build
  └── wrangler deploy    (deploys to Workers)
```

### 13.3 Cloudflare Configuration

- **Entry:** `app/server.ts` (custom: re-exports TanStack fetch + adds `scheduled()`)
- **D1 Binding:** `DB` → `sensei-db`
- **Cron:** `*/15 * * * *`
- **Compat Flags:** `nodejs_compat`
- **Observability:** Enabled

### 13.4 Secrets

Managed via `wrangler secret put`:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` (`https://sensei-app.team-deetsuite.workers.dev/auth/callback`)
- `ANTHROPIC_API_KEY`
- `SESSION_SECRET`

### 13.5 Database Migrations

```bash
npm run db:generate      # Generate migration from schema changes
npm run db:migrate       # Apply locally
npm run db:migrate:prod  # Apply to production D1
```

---

## 14. External Service Integrations

### 14.1 Google OAuth 2.0

- **Scopes:** `openid`, `email`, `profile`, `calendar.events`
- **Access type:** `offline` (provides refresh token)
- **Prompt:** `consent` (forces consent screen each time)
- **Redirect URI:** `https://sensei-app.team-deetsuite.workers.dev/auth/callback`

### 14.2 Google Calendar API

- **Base URL:** `https://www.googleapis.com/calendar/v3`
- **Operations:** Create, update (PATCH), delete, list events
- **Calendar:** `primary` (user's default)
- **Timezone:** UTC
- **Error handling:** 404/410 on delete treated as success

### 14.3 Anthropic Claude API

- **Model:** `claude-sonnet-4-5-20250929`
- **Max tokens:** 1024 (agents), 256 (cron message composer)
- **Pattern:** Non-streaming JSON responses with tool-use loop (max 3 iterations)
- **SDK:** `@anthropic-ai/sdk` v0.39+

---

## 15. Error Handling Strategy

| Layer | Pattern | Fallback |
|-------|---------|----------|
| **Agent turn** | try/catch around entire agent call | "I'm having trouble responding right now." |
| **Tool execution** | try/catch per tool; error returned as `is_error` tool_result | Claude sees error, can retry or pivot |
| **Calendar API** | Best-effort; failures logged, not fatal | Action created in DB without calendar link |
| **Token refresh** | Throws on failure | Agent error → fallback message |
| **Cron check** | try/catch per check | Individual failures logged; other checks continue |
| **Frontend** | Root ErrorBoundary | Error message + refresh button |

---

## 16. Security Model

- **Session cookies:** HMAC-SHA256 signed, HttpOnly, Secure, SameSite=Lax
- **Data isolation:** All DB queries filtered by authenticated `userId`
- **Interaction ownership:** Verified before message load/send
- **Action ownership:** Verified before update/delete
- **Token storage:** Google OAuth tokens stored in DB, never exposed to client
- **Secrets:** Managed via Wrangler (not in source code or environment files)
