# MVP Scoping Analysis

## The Core Tension

The team identified two pillars — (1) Time/Life Management and (2) Path Discovery/Skill Building — plus gamification, personalization, focus support, calendar integrations, LMS integrations, and an agent-based architecture with 5+ agents. That's months of work compressed into 24 hours.

## Recommendation: Pick ONE Pillar, ONE Agent

The most impactful demo is a single, polished conversational agent that does one thing well, rather than a fragmented system that does five things poorly.

**Recommended focus: Onboarding + Time Management agent.**

Rationale:
- It's the problem all three team members personally resonate with most
- It's the most demo-able — a judge can sit down, talk to the agent, and immediately see value
- Career pathfinding requires curating large datasets of career paths, certifications, etc. — that's a content problem, not a coding problem, and 24 hours isn't enough
- Skill building has the same content-dependency issue
- Time management is self-contained: the user brings their own schedule and goals

## Proposed MVP Scope

| Include | Exclude (for now) |
|---|---|
| Short onboarding flow (3-5 questions) | Career/skill pathfinding agents |
| Single conversational agent (time management focus) | Gamification system |
| Google Calendar integration (read/write) | LMS integration |
| Firebase for user data | Multi-agent routing |
| Simple chat UI | Personalization/learning style assessment |
| Pre-session focus reminders (if time allows) | Leaderboards, badges, social features |

## Suggested 24-Hour Build Sequence

1. **Hours 0-2**: Finalize the onboarding question flow and agent prompt on paper
2. **Hours 2-6**: Firebase setup + Google Calendar OAuth + basic chat UI scaffold (parallelize across team)
3. **Hours 6-14**: Agent logic — wire up the LLM with calendar tools, build the conversational flow
4. **Hours 14-20**: Polish, edge cases, end-to-end testing
5. **Hours 20-24**: Demo prep, presentation slides

## Open Question

Does narrowing to "Sensei: an AI time management assistant that talks to you like a mentor and manages your Google Calendar" feel like enough for the demo? Or is the career pathfinding piece essential to differentiate?
