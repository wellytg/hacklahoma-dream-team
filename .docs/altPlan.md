# Project Sensei: Strategic Architecture Plan

**Status:** Proposed for Team Verification
**Context:** Hacklahoma 2026
**Core Philosophy:** "Neutral Wireframe" — Psychological Profiling over Gamification.

---

## 1. Executive Summary & The Pivot

**Project Sensei** has evolved from a gamified "Ninja" app into a **psychologically aware personal assistant**.
* **What we dropped:** The "Zen/Ninja" visual toggles, Solana blockchain integration, and aggressive gamification mechanics.
* **What we kept:** The "Agent" architecture and the core goal of bridging intention to action.
* **The New Vision:** A neutral, low-friction interface that uses a deep understanding of the user's "Student State" (e.g., overwhelmed, energetic, perfectionist) to guide them toward concrete, scheduled actions.

---

## 2. System Architecture: The "Golden Thread"

The app is built around a continuous feedback loop rather than a linear checklist.

### A. The Agent Ecosystem
We utilize a **Hub-and-Spoke** model where three distinct Agents handle specific phases of the user journey.

1.  **Agent 1: The Gatekeeper (Intake)**
    * **Role:** The Profiler.
    * **Interface:** A structured, low-friction wizard (not a chat).
    * **Goal:** Build the `StudentStateModel`—a psychological map of the user's friction points, motivation style, and energy rhythms.
    * **Output:** A static profile stored in the database.

2.  **Agent 2: The Sensei (Planner)**
    * **Role:** The Mentor.
    * **Interface:** A "Hybrid Chat" (Text + Interactive UI Chips).
    * **Goal:** Identify *one* meaningful improvement area and schedule *one* concrete action.
    * **Behavior:** It does not chat endlessly. It explores the problem, converges on a solution, and executes a calendar write.

3.  **Agent 3: The Mirror (Reflection)**
    * **Role:** The Feedback Loop.
    * **Interface:** Triggered chat session.
    * **Goal:** Capture what *actually* happened after the scheduled event passed.
    * **Trigger:** A "Magic Link" inside the user's Google Calendar event.

### B. The "Golden Thread" Data Flow
`User` -> `Intake` -> `Profile` -> `Sensei Conversation` -> `Calendar Event` -> **Real World Action** -> `Calendar Link` -> `Reflection Agent` -> `Updated History` -> `Sensei` (Loop).

---

## 3. Technology Stack Strategy

We have selected a stack optimized for **Speed** (Edge computing) and **Simplicity** (Hackathon constraints).

| Component | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | Industry standard. Uses the App Router for server-side Agent logic. |
| **Database** | **Cloudflare D1** | SQLite at the Edge. Faster than Firebase for relational data (User <-> Events). |
| **Auth** | **Better-Auth** | Lightweight, runs natively on Cloudflare Workers. Handles Google Calendar scopes without bloat. |
| **AI Engine** | **OpenAI (GPT-4o)** | Via Vercel AI SDK. Chosen for its reasoning capability in "Psychological Profiling." |
| **State** | **TanStack Query** | Manages the "Loading..." states of AI responses instantly. |

---

## 4. User Experience (UX) Philosophy

### The "Neutral Wireframe" Aesthetic
* **Visuals:** Clean, grayscale/monochrome, high whitespace. No cartoon avatars or 8-bit graphics.
* **Tone:** The interface is the "canvas"; the AI provides the personality (which adapts based on the profile).
* **Interaction:**
    * **Intake:** "Skip" is always an option. No shame.
    * **Sensei:** Uses "Suggestion Chips" (e.g., "I'm tired," "I'm anxious") to reduce typing friction.

---

## 5. Development Roadmap

### Phase 1: The Foundation (Current Priority)
* **Goal:** User can sign in via Google and complete the Intake Flow.
* **Deliverables:**
    * Next.js App Skeleton.
    * Database Schema (User, Profile tables).
    * Google Auth integration with Calendar Permission scope.
    * Wiring the existing Frontend Intake to the Backend Database.

### Phase 2: The Sensei Agent
* **Goal:** User can have a conversation that results in a "Draft Event."
* **Deliverables:**
    * Hybrid Chat Interface (UI).
    * System Prompt engineering (feeding the Profile into the AI).
    * Mock "Calendar Write" (console log the event).

### Phase 3: The Integration
* **Goal:** The app actually modifies the Google Calendar.
* **Deliverables:**
    * Google Calendar API integration.
    * "Reflection Link" generation logic.

---

## 6. Team Verification Checklist

Before we proceed to code, the team must align on these points:

* [ ] **Design:** Do we agree on the "Neutral Wireframe" look (dropping the Ninja theme)?
* [ ] **UI:** Are we comfortable building the "Hybrid Chat" (Text + Chips) for Agent 2, or should it be a simple text box?
* [ ] **Calendar:** Do we accept the risk of Google's "Unverified App" warning screen during the demo? (Required for writing to calendar).
* [ ] **Stack:** Is everyone comfortable with the Cloudflare D1 / Better-Auth choice?
