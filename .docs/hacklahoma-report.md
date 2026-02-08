# Sensei: Hacklahoma 2026 Project Report

## Our Story

Three of us traveled from Tulsa to Oklahoma to take part in Hacklahoma 2026. We arrived with an idea, energy, and one missing piece: a fourth teammate.

At the event, we met Mahaelani, who was also looking for a group. After just a few minutes of conversation, it was clear this would work. What started as a quick chat turned into instant alignment. We came from different backgrounds and different life paths, but we shared the same frustrations, the same curiosity, and the same drive. It honestly felt like we'd been working together for a long time.

## Inspiration

Our team didn't start with an app idea. We started with a shared frustration.

Students are overwhelmed. They have plenty of motivation, but no structure around it. Outside of work or class schedules, everything falls apart: missed deadlines, poor time allocation, constant context switching, planning systems that collapse after a few days. Universities tell students what classes to take, but offer little guidance on managing life. There's no real help balancing study, work, health, and family. No support for discovering paths when you don't even know where you're going. No personal coaching unless you're already doing well.

Meanwhile, executives have assistants and coaches. Students are expected to figure it out alone.

Most students who struggle with productivity are dealing with cognitive overload. Planning your life shouldn't feel like another full-time job.

We built **Sensei**, an AI-powered student assistant that acts like a mentor. Sensei talks to students like a human guide. It helps them organize time and reduce planning overhead. It integrates with calendars students already use and prepares them before focus sessions.

Sensei doesn't open with "What's your problem?" It asks about *you*, and adapts. The app conducts a structured intake to understand how each user thinks, what drains their energy, and what motivates them. It uses that profile to shape how it talks, what it suggests, and when it follows up.

Given the 24-hour constraint, we focused on one thing done well: an AI time-management mentor that helps students plan, focus, and follow through. No feature bloat. No fake productivity. Just something a judge, or a student, can sit down with and immediately feel helped by.

Every student deserves the kind of support only a few people get today. Sensei levels the playing field. And that idea was born and built in one long Hacklahoma day and night.

## How We Built It

### Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | TanStack Start 1.159 + Vite 7.3 | Full-stack, edge-native, type-safe server functions |
| UI | React 19, Tailwind CSS v4, Framer Motion | Industry standard, utility-first styling, smooth animations |
| Compute | Cloudflare Workers | Global edge deployment, serverless, generous free tier |
| Database | Cloudflare D1 (SQLite) + Drizzle ORM | Edge-native, zero warm-up, type-safe schema |
| AI | Claude Sonnet 4.5 (Anthropic SDK) | Strong instruction-following, native tool-use for scheduling |
| Auth | Google OAuth 2.0 + HMAC-signed sessions | Single flow grants identity + calendar access |
| Calendar | Google Calendar API v3 | Two-way: reads schedule to avoid conflicts, writes events for actions |
| Linting | Biome 2.3.14 | Single tool for linting + formatting, 10x faster than ESLint + Prettier |
| Deployment | Wrangler CLI | One command: `npm run deploy` |

### Development Methodology

The team followed a structured approach to AI-assisted development:

1. **Research**: Understand the problem deeply. Read all team members' conversation outlines, define personas, identify edge cases.
2. **Plan**: Write detailed specifications before coding, including file paths, function signatures, and conflict resolution logic.
3. **Implement**: Hand the plan to Claude with full context; monitor output quality.
4. **Verify**: Run Biome linting, TypeScript type checking, and manual testing after every feature.
5. **Commit and deploy**: Ship incrementally; iterate on real feedback.

We kept Claude in the role of builder. Humans owned the vision; AI executed with precision.

### Architecture

The app runs entirely on Cloudflare's edge. A custom server entry (`app/server.ts`) exports both a `fetch` handler for HTTP requests (TanStack Start SSR + server functions) and a `scheduled` handler for cron-triggered follow-ups every 15 minutes. The database is a 7-table SQLite schema (users, profiles, interactions, messages, scheduled actions, reflections, follow-up checks) managed through Drizzle ORM migrations.

Two specialized AI agents power the conversational experience:

- **Sensei Agent**: Conducts the main coaching conversation. Has one tool, `schedule_action`, which creates a Google Calendar event, a reflection reminder, and a follow-up check. Receives rich context including the user profile, recent interactions, upcoming calendar (7-day window), and missed reflections.
- **Reflection Agent**: Runs post-action conversations. Has one tool, `complete_reflection`, which records whether the user completed the action, their emotional state, barriers faced, and whether they want to repeat it.

Both agents use a tool-use loop capped at 3 iterations to prevent runaway behavior.

### Timeline

| Time | Milestone |
|------|-----------|
| Feb 7, 12:24 PM | Project initialized from template |
| Feb 7, 9:47 PM | First React app draft (Wellington's initial UI) |
| Feb 8, 5:04 AM | Phase 1: Full stack migration (TanStack Start, D1, OAuth, 7-table schema) |
| Feb 8, 5:24 AM | Phase 2: Agent system + Google Calendar integration |
| Feb 8, 5:51 AM | Phase 3: End-to-end wiring (auth guard, intake flow, protected routes) |
| Feb 8, 6:32 AM | Phases 4-6: Biome linting, cron follow-ups, error boundaries |
| Feb 8, 6:50 AM | Phase 7: UI polish (stat cards, skeletons, markdown, typing indicator) |
| Feb 8, 8:17 AM | Deployment complete + first post-deploy fixes |
| Feb 8, 10:13 AM | Six-feature release (dark mode, time awareness, editable actions, calendar context, bold opener, calendar cleanup) |

From first framework commit to final feature: **5 hours and 9 minutes** of implementation. From project creation to deployed product: **~22 hours**.

## Features

### 1. Personalized Intake Flow (10 Steps)

A structured onboarding questionnaire captures the user's goals, energy patterns, avoidance triggers, structure preferences, values, and accessibility needs. Answers feed into a resolution engine (`shared/resolve.ts`) that computes a persona mode (Coach, Ignition, Pacer, Stabilizer, or Adaptive) and detects contradictions. For example, if someone claims long focus sessions but also reports low energy, the system flags the conflict and adjusts.

This profile directly shapes how Sensei interacts with the user. The resolved intake data is injected into Sensei's context before every conversation, influencing its tone, the kinds of questions it asks, how much structure it offers, and how it frames suggestions. A user in Ignition mode gets quick, energizing prompts. A user in Pacer mode gets steadier, lower-pressure guidance. The intake acts as Sensei's understanding of who you are and how you work best.

Because people change, the intake can be retaken at any time from the profile page. If a user's energy levels shift, their challenges evolve, or they want a different interaction style, they can redo the questionnaire and Sensei's personality updates to reflect the new answers. This keeps the app useful over time rather than locking users into a static profile from day one.

*Rationale*: Generic advice fails. Understanding how someone thinks before coaching them makes every interaction more relevant, and letting users update that understanding keeps it accurate.

### 2. Conversational AI Agent (Sensei)

A 249-line system prompt defines Sensei as a curious, nonjudgmental mentor. It learns about the user first, then naturally guides toward scheduling one concrete action. The agent receives the user's full profile, recent history, and current calendar as context, but never explicitly references the profile data. Sensei uses the intake to inform its behavior quietly, so the conversation feels natural rather than formulaic.

*Rationale*: The invisible goal is a calendar event. If the conversation feels natural and the user *wants* to schedule something, the app has succeeded.

### 3. Google Calendar Integration

Sensei creates calendar events for scheduled actions and reflection reminders. The agent reads the user's upcoming 7-day calendar to avoid conflicts. Users can reschedule or delete actions from the dashboard, and changes propagate to Google Calendar.

*Rationale*: A commitment that doesn't exist on your calendar doesn't feel real. Integration makes Sensei's suggestions tangible.

### 4. Reflection System

12 hours after a scheduled action, the user receives a reflection prompt. A dedicated Reflection Agent asks how it went, captures completion status, emotional tone, barriers, and whether the user wants to repeat. This data feeds back into future Sensei conversations.

*Rationale*: Doing the thing is half the value. Reflecting on it honestly, without judgment, is the other half.

### 5. Automated Follow-Up (Cron)

A Cloudflare cron job runs every 15 minutes. If a user hasn't reflected after the scheduled window, the system uses Claude to compose a context-aware follow-up message tailored to the user's notification tolerance and persona mode.

*Rationale*: Users forget. A gentle, personalized nudge is better than silence.

### 6. Dashboard with Filtering

Stat cards (Total, Pending, Completed, Missed) are clickable filters. Action cards show title, description, scheduled time, goal area, and status badges. Pending actions have reschedule (pencil) and delete (trash) buttons. Completed actions link to their reflection.

*Rationale*: This is mission control. See everything at a glance, act on anything with one click.

### 7. Profile Transparency

A dedicated profile page shows users exactly how their intake answers were interpreted: persona mode, friction strategy, confidence loop, avoidance reframe, scaffolding approach, and value alignment. Conflict overrides are called out explicitly.

*Rationale*: Users should see how they're being understood. Transparency builds trust.

### 8. Dark Mode

Class-based dark mode with localStorage persistence and system preference fallback. Toggle in the header; an inline script prevents flash of wrong theme.

*Rationale*: Accessibility and user preference. Many students work late.

### 9. Editable Pending Actions

Inline datetime editing on dashboard cards. Save triggers `updateScheduledAction`, which updates both the database and Google Calendar events.

*Rationale*: Life changes. Rescheduling should be easier than deleting and recreating.

### 10. Time-Aware Scheduling

The agent receives the current timestamp in its context, enabling relative scheduling ("in 2 hours," "tomorrow morning") rather than requiring absolute times.

*Rationale*: Natural conversation requires temporal awareness.

### 11. Schedule-Aware Context

The agent receives the user's next 7 days of calendar events, preventing it from suggesting times that conflict with existing commitments.

*Rationale*: Scheduling over an existing class or meeting would immediately break trust.

## Challenges

### Scope Management

The initial vision included 5+ agents, gamification, career pathfinding, skill trees, LMS integrations, leaderboards, and Solana NFTs. The team was overwhelmed. The breakthrough came when Dallas asked for help narrowing down, and the decision crystallized: **one pillar (time management), one agent (Sensei), one demo-worthy flow**. That single scoping decision enabled a polished MVP instead of a fragmented prototype.

### Technology Stack Pivot

The team started with Firebase + Vite + React, then realized they needed tighter backend integration. Pivoting to TanStack Start + Cloudflare Workers + D1 + Drizzle mid-hackathon required learning four new technologies simultaneously. The payoff was a type-safe, edge-deployed, serverless architecture, but the learning curve was steep.

### Google Calendar API Subtleties

Calendar integration proved deceptively tricky:
- Initial implementation used Base64-encoded event URLs that broke; switching to Google's native `htmlLink` fixed it
- Multi-account users couldn't access events because token handling needed per-account awareness
- The `calendar` scope scared test users during consent; narrowing to `calendar.events` solved it
- Deleting actions from the dashboard left orphaned calendar events until cleanup logic was added

### Agent Behavior Tuning

Getting the AI agent to behave naturally required iterative prompt engineering:
- Without time awareness, the agent couldn't schedule "in 2 hours"
- Without calendar context, it double-booked users
- Without deduplication logic, follow-up messages in the same conversation created duplicate scheduled actions
- The agent had to be coached to ask before scheduling, rather than just scheduling immediately

### Authentication Edge Cases

The OAuth callback initially used TanStack's `navigate()`, which didn't trigger a full page reload. The session cookie was set, but the AuthProvider didn't pick it up until the page was manually refreshed. Switching to `window.location.href` forced a full reload and fixed the issue.

## What We Learned

**Simplicity wins at hackathons.** The final MVP has one agent, one intake flow, one calendar integration, and a clean UI. Every deferred feature would have diluted the demo without adding proportional value.

**AI pair programming requires active oversight.** The team specified exact file paths, function signatures, and edge cases in plans. We read every line of generated code before committing. When something broke, we debugged together with Claude, understanding root causes rather than patching symptoms.

**Transcript-driven development creates accountability.** Saving conversation transcripts meant the team could trace every decision, reproduce every bug, and avoid re-solving the same problems. Future developers can understand *why* the code looks the way it does.

**Type safety pays off under pressure.** TypeScript + Drizzle ORM caught schema mismatches at build time. Shared types between client and server prevented divergence. When moving fast, the compiler is your best reviewer.

**Edge deployment simplifies operations.** Cloudflare Workers + D1 meant no database management, no server provisioning, no cold start anxiety. One command (`npm run deploy`) put the app live. The team spent zero time on infrastructure and all their time on product.

## Production

**URL**: https://sensei-app.team-deetsuite.workers.dev

**Stats**: 30+ commits, 7 development phases, 8 post-deploy fix sessions, 100+ files, ~2,400 lines of core application code.

Built at Hacklahoma 2026 by the Dream Team: Dallas, Wellington, Mouzam, and Mahaelani.
