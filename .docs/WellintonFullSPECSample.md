# hacklahoma-dream-team - Full Specification: Project Sensei

## Executive Summary

**Project Sensei** is an intelligent personal assistant designed to bridge the gap between a student's current state and their desired career destination. Unlike traditional productivity tools that enforce a single workflow, Sensei utilizes a **Dual-Mode Psychological Engine**. It assesses the user's motivation style during onboarding and dynamically adapts the interface and feedback loops into one of two modes: **"Zen Garden"** (for intrinsic motivation and focus) or **"Super Ninja"** (for extrinsic motivation, gamification, and competition).

By combining **LLM-driven Agent Orchestration** with **Solana-based verification**, Sensei not only schedules time but creates immutable proof of skill acquisition.

## Architecture Overview

### System Design
The system follows a **Hub-and-Spoke Agent Architecture**.
The central "Hub" is the **Gatekeeper Agent**, which routes user intents to specialized "Spoke" agents. The frontend is a dynamic Next.js application that renders completely different themes (CSS/Components) based on the user's selected psychological mode. State management is handled via React Context for the UI and Firebase Firestore for persistence.

### Core Components
1.  **The Gatekeeper (Router):** Analyzes user inputs and psychological profile to route requests to the correct sub-agent.
2.  **The Pathfinder (Career Agent):** Uses O*NET data and LLMs to generate "Skill Trees" (backward-engineered roadmaps from a job goal).
3.  **The Sensei (Time Agent):** Manages the user's schedule, enforcing "Life Pie" constraints to prevent burnout.
4.  **The Verifier (Gamification Engine):** Manages XP, Streaks, and interacts with the Solana Blockchain (in Ninja Mode).

### Technology Stack
- **Backend**: Node.js (via Next.js API Routes), Firebase Cloud Functions
- **Frontend**: Next.js 14 (React), Tailwind CSS, Framer Motion (for animations)
- **AI Engine**: OpenAI API (GPT-4o/o1-mini) via Vercel AI SDK
- **Database**: Firebase Firestore (NoSQL)
- **Infrastructure**: Vercel (Hosting), Google Cloud Platform (Auth/Calendar API)
- **Blockchain**: Solana (Devnet) + Anchor Framework (for "Super Ninja" verification)

## Functional Requirements

### Core Features
1.  **Psychometric Onboarding:** A 5-question quiz to determine "Zen" vs. "Ninja" suitability.
2.  **Dynamic Theming:** Instant UI switching between "Garden" (Minimalist) and "Dojo" (8-Bit RPG).
3.  **AI Calendar Injection:** Auto-scheduling of study blocks that respect user-defined "Life Pie" limits.
4.  **Skill Tree Generation:** transforming a text goal (e.g., "Learn React") into a structured 4-week plan.
5.  **Proof of Progress:** Minting NFT badges on Solana upon completing major milestones (Ninja Mode only).

### User Stories
* **As "Dallas" (The Over-committer):** I want the app to refuse to schedule new tasks if my "Work" slice of the pie is full, so that I don't burn out.
* **As "Mouzam" (The Paralyzed Explorer):** I want the AI to tell me exactly what to study at 2:00 PM, so I don't waste time deciding what to do.
* **As "Wellington" (The Competitor):** I want to earn a "Black Belt" NFT when I finish my Python course, so I can prove my skills on-chain.

### Use Cases
1.  **The "Pre-Session" Prep:** User has a study block at 4 PM. Sensei sends a notification at 3:45 PM: "Clear your desk and put phone on DND. Session starts in 15."
2.  **The Career Pivot:** User types "I want to be a SOC Analyst." Pathfinder Agent generates a roadmap starting with "Network+ Certification" and schedules the first lesson.

## Technical Specifications

### API Design
RESTful API routes hosted within Next.js:
* `POST /api/gatekeeper/triage`: Analyzes user prompt.
* `POST /api/pathfinder/generate`: Accepts goal -> Returns JSON Skill Tree.
* `POST /api/sensei/schedule`: Accepts task list -> Writes to Google Calendar.
* `POST /api/verifier/mint`: (Ninja Mode) Triggers Solana smart contract.

### Data Models
* **User:** `{ uid, name, mode: 'zen'|'ninja', lifePie: { work: 40, study: 10 } }`
* **Quest:** `{ id, title, estimatedTime, xpReward, status: 'active'|'completed' }`
* **SkillTree:** `{ rootGoal, nodes: [ { step: 1, resourceUrl, questId } ] }`

### Security Considerations
* **OAuth 2.0:** Google Sign-In used for authentication and Calendar scope access.
* **Environment Variables:** OpenAI and Solana private keys stored in `.env.local` (never committed).
* **Rate Limiting:** Firebase App Check to prevent API abuse.

### Performance Requirements
* **AI Response Time:** "Streaming" responses enabled so users see the plan generating in real-time (target < 2s to first token).
* **Calendar Sync:** Two-way sync latency under 5 seconds.

## Implementation Details

### Directory Structure
/project-sensei /app /api # Next.js API Routes (The Agents) 
/dashboard # Main UI /onboarding # Psychometric Quiz 
/components /zen # Minimalist UI Components 
/ninja # 8-Bit UI Components 
/shared # Logic-only hooks 
/lib /agents # Prompts and Logic for Gatekeeper
/Sensei 
/firebase # DB Config 
/solana # Wallet Adapters 
/anchor # Solana Smart Contracts (Rust)

### Key Algorithms
1.  **The "Life Pie" Allocator:** A greedy algorithm that fills calendar slots based on priority (Health > Work > Study) until the daily quota is met.
2.  **The Mode Switcher:** A Context Provider that wraps the app, swapping Tailwind theme classes (`font-sans` vs `font-pixel`) based on global state.

### Integration Points
* **Google Calendar API:** Read (for conflicts) and Write (for scheduling).
* **Solana Devnet:** Via `solana/web3.js` for transaction signing.
* **O*NET API:** For retrieving accurate career skill requirements.

## Development Workflow

### Development Environment Setup
1.  `npm install`
2.  Set up Firebase Project & Enable Firestore.
3.  Create Google Cloud Console Project (Enable Calendar API).
4.  `solana-keygen new` (for local devnet wallet).

### Code Standards
* **"Sketch-to-Code":** Primary workflow involves describing UI in text/drawings and using AI to generate Component code.
* **Strict Typing:** TypeScript interfaces for all Agent responses to ensure JSON validity.

### Testing Strategy
* **Manual User Testing:** Team members act as different personas (Zen vs. Ninja) to test the "feel."
* **Agent Eval:** Manually verifying that the "Pathfinder" generates realistic career steps.

### Deployment Process
* **Frontend:** Auto-deploy to Vercel on git push.
* **Database:** Firestore rules deployed via Firebase CLI.

## Quality Assurance

### Testing Framework
* **Jest:** For unit testing the "Life Pie" calculation logic.
* **Console Logging:** Extensive logging in API routes to trace Agent decision-making during the hackathon.

### Code Review Process
* **PRs:** All code merged via Pull Request. One approval required (Dallas or Wellington).

### Monitoring and Logging
* **Vercel Analytics:** For frontend performance.
* **OpenAI Dashboard:** Monitoring token usage and prompt failures.

## Maintenance and Operations

### Maintenance Schedule
* **Hackathon Mode:** Ad-hoc fixes. Post-hackathon: Weekly dependency updates.

### Scaling Considerations
* **Firestore:** Auto-scales with user growth.
* **AI Costs:** Move from GPT-4o to GPT-4o-mini for production cost savings.

## Project Management

### Development Phases
1.  **Phase 1 (Hours 0-4):** Setup, Auth, and Onboarding Quiz (The "Gatekeeper").
2.  **Phase 2 (Hours 4-12):** The "Dual Mode" UI Shell (Zen/Ninja themes).
3.  **Phase 3 (Hours 12-18):** Agent Integration (Calendar & Career generation).
4.  **Phase 4 (Hours 18-24):** Gamification (Solana) & Final Polish.

### Resource Requirements
* **API Credits:** OpenAI ($20 budget), Google Cloud (Free Tier).
* **Dev Tools:** Cursor/VS Code, Replit (for quick prototyping).

### Risk Assessment
* **Risk:** AI Hallucination (generating fake career steps).
* **Mitigation:** Hardcode the prompt to strictly use O*NET data categories.

## Future Considerations

### Roadmap
* **LMS Integration:** Connect to Canvas/Blackboard to auto-import homework.
* **Mobile App:** React Native port for push notifications.
* **Mainnet Launch:** Move Solana features to mainnet for real-world value.

### Technical Debt
* **Hardcoded Prompts:** System prompts are currently hardcoded strings; should move to a CMS.
* **Calendar Sync:** Currently one-way (App -> Google); need robust two-way sync later.

## Appendices

### Glossary
* **Katas:** Daily tasks in "Ninja Mode."
* **Life Pie:** The visual representation of a user's time allocation limits.
* **SBT:** Soulbound Token (non-transferable NFT used for badges).

### References
* [NICE Cybersecurity Framework](https://niccs.cisa.gov/)
* [Solana Anchor Documentation](https://www.anchor-lang.com/)

