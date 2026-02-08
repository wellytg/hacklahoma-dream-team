# Project Sensei: Architectural Specification & MVP Plan

**Author:** Wellington  
**Date:** February 7, 2026  
**Context:** Hacklahoma 2026  
**Status:** Proposal for Immediate Implementation  

---

## 1. Executive Summary
**"Sensei"** is an AI-powered personal assistant that helps students bridge the gap between "Where I am" and "Where I want to be." 

Unlike standard productivity tools that force one style of working, **Sensei adapts to the user's psychology**. It uses an intelligent "Sorting Hat" agent to classify users and serve them the interface that motivates *them* best—whether that's a calm, mindfulness-based planner or a high-stakes, gamified RPG.

---

## 2. The Core Innovation: "Dual-Mode" Philosophy
To solve our team's debate regarding **Gamification (Wellington)** vs. **Ethical Engagement (Dallas)**, the app will feature two distinct UI/UX modes. The backend logic remains the same, but the frontend presentation changes entirely based on the user's profile.

### Mode A: "Zen Garden" (Intrinsic Motivation)
* **Target Persona:** Users like Dallas/Zia who want focus, clarity, and "no dopamine traps."
* **Visual Style:** Minimalist, nature-inspired, "Garden" aesthetic.
* **Feedback Loop:** Reflective. "You focused for 4 hours today. How do you feel?"
* **Failure State:** Supportive. "You missed a task. Let's adjust the schedule to reduce stress."
* **Rewards:** Unlocks mindfulness quotes, journal prompts, or ambient soundscapes.

### Mode B: "Super Ninja" (Extrinsic Motivation)
* **Target Persona:** Users like Wellington who thrive on competition, streaks, and rewards.
* **Visual Style:** 8-Bit "Dojo" RPG aesthetic. Tasks are enemies; completion is a sword slash.
* **Feedback Loop:** Competitive. "New High Score! Top 5% of students today."
* **Failure State:** Punitive (Optional). "You missed a task. Your Avatar took damage. Streak reset."
* **Rewards:** XP, Leaderboards, and **Solana-based NFT Badges** for verified skill milestones.

---

## 3. System Architecture: Hub-and-Spoke Agents
We will use Dallas's proposed **Agent-Based Architecture**, orchestrated by a central "Gatekeeper."

### Agent 1: The Gatekeeper (Onboarding & Routing)
* **Role:** The "Sorting Hat."
* **Function:** Runs the 5-Question Onboarding Quiz (Stress, Motivation Style, Goals).
* **Output:** Determines if the user belongs in **Zen Mode** or **Super Ninja Mode** and routes them there.

### Agent 2: The Sensei (Time & Focus Manager)
* **Role:** The Executive Assistant.
* **Function:**
    * Ingests the user's "Life Pie" constraints (e.g., "Max 4 hours coding/day").
    * **Integration:** Reads/Writes to **Google Calendar**.
    * **Logic:** Finds empty slots and injects "Focus Blocks" based on the user's energy levels.

### Agent 3: The Pathfinder (Career & Skills)
* **Role:** The Career Counselor.
* **Function:**
    * **Input:** "I want to be a [Job Title]."
    * **Logic:** Uses LLM + **O*NET Data** to backward-engineer a "Skill Tree."
    * **Output:** Breaks massive goals (e.g., "Learn Python") into 30-minute "Micro-Quests" for Agent 2 to schedule.

---

## 4. Technical Stack (Hackathon MVP)
* **Frontend:** Next.js (React) + Tailwind CSS.
    * *Dynamic Theming:* CSS variables switch based on `user.mode` (e.g., Font: 'Inter' vs. 'Press Start 2P').
* **Backend / DB:** Firebase (Firestore).
    * Stores User Profile, Mode Preference, and Active Quests.
* **AI Engine:** OpenAI API (GPT-4o) via Vercel SDK.
    * System Prompts defined for each Agent role.
* **Integrations:**
    * **Google Calendar API:** Source of truth for time.
    * **Solana (Devnet):** *Only active in Super Ninja Mode.* Mints "Proof of Skill" tokens to Phantom Wallet.

---

## 5. The "Hackathon MVP" User Flow
This is the single flow we need to build to win.

1.  **Login:** User signs in with Google.
2.  **The Sort:** Agent 1 asks: *"What motivates you more: Inner peace or crushing the competition?"*
    * User selects: **"Competition."** -> App loads **Super Ninja Mode**.
3.  **The Goal:** User types: *"I want to learn Solana development."*
4.  **The Plan:** Agent 3 (Pathfinder) generates a 5-step "Scroll" of tasks.
5.  **The Schedule:** Agent 2 (Sensei) auto-books "Step 1: Install Rust" into the Google Calendar for 2:00 PM today.
6.  **The Win:** User clicks "Task Complete."
    * **Visual:** 8-bit Sword Slash animation.
    * **Backend:** XP increases, and a transaction is sent to Solana Devnet.

---

## 6. Implementation Strategy: "Sketch-to-Code"
Consistent with Dallas's workflow, we will not write UI code from scratch.
1.  **Define:** We map the "Zen" vs "Dojo" screens on the whiteboard.
2.  **Generate:** We feed the descriptions to AI (Claude/Cursor) to generate the React components.
3.  **Wire:** We connect the components to the Firebase/Agent backend.

Let's build **Sensei**.
