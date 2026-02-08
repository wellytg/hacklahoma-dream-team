# Hacklahoma Workshop — Vibe Engineering

**Context**: A workshop presented at Hacklahoma on AI-assisted software engineering ("vibe engineering"). The main presenter is a professional software engineer walking attendees through best practices for using AI coding tools (primarily Claude Code). An Anthropic employee is also present, demonstrating advanced features including "fast mode." Various hackathon participants ask questions and participate throughout.

---

## I. Introduction & Giveaways

- Presenter created the workshop intro video entirely using Claude Code — gave it the Hacklahoma logo and theme
- Giveaways announced:
  - **3 Claude Code passes** (to be raffled to participants)
  - **2 free books** on building AI agents from a startup called Mastra (an AI agent framework based in San Francisco)

---

## II. The State of the Industry for New Grads

### A. The Job Market Reality
- Massive layoffs across tech; very few companies hiring new grads
- Universities are producing more CS grads than ever, but hiring hasn't kept pace
- CS program sizes have roughly doubled since the presenter's college days

### B. What's Changed
- University classes are primarily theoretical — real coding skills come from **side projects and internships**
- In the past: Stack Overflow, GeeksforGeeks, Google, and asking friends for help
- Now: AI tools at your fingertips — you can ask anything, anytime
- **The barrier to entry for building software is extremely low now**
- The differentiator will be **building good software with taste**, not just building software at all

### C. Advice for Students
- Attend classes and learn the theory (networking, software architecture, etc.) — you still need to understand fundamentals
- But also: **build more side projects** — practice constantly
- Use Claude Code, Cursor, Open Code, Antigravity — whatever tool works for you
- **"Always ship and learn"** — the goal is continuous shipping and continuous learning
- Be a lifelong learner — the presenter still grinds after work hours to upskill
- "The industry is closing down on you fast. No one is safe anymore."

---

## III. Vibe Coding vs. Vibe Engineering

### A. The Core Distinction (Andre Karpathy Reference)
- **Vibe coding**: "Like a casino" — you throw a prompt at AI, hope it works, and pray
  - "Yo, build this for me" → hope for the best
  - No planning, no understanding, no verification
  - "We are NOT vibe coding"
- **Vibe engineering**: You take the wheel — strategic, commanding, intentional
  - You give context, plan ahead, review the plan, understand it, then have AI execute
  - You are the architect; AI is the builder

### B. Three Archetypes of AI Users
1. **The Pedant** (beta archetype): Obsesses over syntax, nitpicks tabbing and linting
   - All of this should be handled by automated tooling now
   - AI-generated code is "good enough" — stop nitpicking every line
2. **The Gambler**: Generates tons of code, never reads it, doesn't understand the business logic, doesn't write tests
   - Dangerous — you lose understanding of what you're building
3. **The Vibe Engineer** (the goal): Architects the system, understands AI mechanics, but **keeps the thinking to yourself**
   - References **Jack Nations** (staff engineer at Netflix, now at an open-source LLM project): "Don't outsource the thinking. Never do that."

### C. "The Reviewing IS the Coding"
- If AI writes all the code, your job is **reviewing** — and that's where the learning happens
- Review: API design, software architecture, frontend components, database design, code patterns
- "It's still a human endeavor. The hard part isn't coding anymore. The hard part is knowing what to build."

---

## IV. Context Engineering — The Three Phases

### A. Phase 1: Research
- Research what you're going to build and how
- For existing codebases: understand what needs to change, what columns to add, what components to build
- Gather all necessary context before planning

### B. Phase 2: Plan
- Map all research into a structured plan
- Create a `plan.md` file in your repo — a markdown spec of everything you're going to do
- Plan should include: function signatures, API calls, type definitions, database schema, error handling strategy, testing approach
- **Step-by-step instructions** for the AI to follow
- "This is probably the most important part of what you're gonna be doing during the hackathon"
- "Building it will become easy once you know what you're gonna do"

### C. Phase 3: Implement
- Hand the plan to the AI agent with everything it needs
- Monitor execution — if something goes wrong, **pause and revise the plan**
- "Change of plans" is normal and expected — don't let the AI run wild

### D. Verification (Critical Step)
- **Human verification**: You read and review what the AI produced
- **Test verification**: Unit tests, integration tests
- **Linting**: Formatting, error handling, security checks (ESLint for JS, Ruff for Python)
- **Type checking**: TypeScript compiler catches type mismatches early
- "Verification is the most important part"

---

## V. What Judges Want to See at Hacklahoma

### A. Differentiators
- Last year: barely any teams implemented a database
- This year, with AI tools available, judges expect more:
  - **Deployments** — "I want to see a URL"
  - **Databases** — real data persistence
  - **System design** — architecture thinking, scalability considerations
- "Everybody can build now. The people who score highest will be those who showed thinking."

### B. Brownie Points
- Edge case handling and retries
- Scalability considerations ("under load, we're gonna be good")
- Evidence of thoughtful system design
- The presenter will be judging and looking at system designs specifically

---

## VI. Tools & Workflow Demonstration

### A. Voice-to-Code with Whisper Flow
- Presenter uses **Whisper Flow** to speak thoughts directly into Claude Code
- Modern equivalent of "rubber duck debugging" — talk through your logic out loud
- "You're going to talk to Claude... typically logic out, read the plan"
- Less typing, more auditing

### B. Claude Code Skills
- **Skills** = expert-crafted prompts that tell AI how to do something specific
- Demonstrated: **front-end design skill** — tells AI how to build aesthetically pleasing UIs
  - Without it, AI defaults to "purple gradient-y" designs that look obviously AI-generated
  - The skill provides golden rules, CSS guidelines, what to do and what not to do
- Skills are stored as markdown files in a `.claude/skills/` folder
- Presenter "stole" the front-end design skill from GitHub — encourages reusing community-built skills

### C. MCP (Model Context Protocol)
- **MCP** = a protocol for connecting AI agents to external tools and services
- Example: connecting to Google Calendar so an AI agent can read/write calendar events
- **Context7 MCP**: A documentation search tool that lets Claude Code look up docs for frameworks, libraries, etc.
  - How Claude Code knows about Cloudflare, TanStack Start, etc. — it fetches their documentation via Context7
  - "Very similar to a human just going and reading the docs"
- **Security warning**: Be very careful installing MCPs — they can have vulnerabilities
  - Only use well-known, trusted MCPs (Context7 has a gold rating)
  - "Don't install random ones"

### D. Plan Mode
- Always start with `plan mode` enabled — forces Claude to plan before executing
- Presenter's folder structure:
  - `.docs/plans/` — markdown files with plans and checkboxes
  - `.docs/implements/` — implementation specs
- Plans should be broken down **feature by feature**, not one massive spec

---

## VII. Live Demo: Building a Social App

### A. The Idea (Audience-Sourced)
- **Concept**: A social media app to help friends find time to meet up
- Core feature: **Smart scheduling** — pulls everyone's Google Calendar availability, finds best overlap times

### B. Planning Session with Claude Code (Interactive)
The presenter walks through Claude Code's planning interview, letting the audience vote on each decision:

1. **Core feature**: Event planning — create events, invite friends, RSVP, add details
2. **Platform**: Web app first, but **keep mobile design in mind** for responsive layout
3. **Expected users**: ~2 (realistic), but **design for scalability** ("keep scalability in mind — judges will love that")
4. **Authentication**: Google sign-in (3rd party, minimal implementation effort)
5. **Event flow**: Smart scheduling — get everyone's availability and suggest optimal times; integrate with Google Calendar
6. **Social feed**: Activity feed with comments
7. **Group structure**: Invite-only groups (no random people showing up)
8. **Real-time features**: Start with **polling and refresh**, add real-time (WebSockets) later
   - Anthropic employee explains: real-time notifications on mobile require Apple/Google developer accounts, permissions, complex infrastructure
   - WebSockets require stateful servers — much more complex infrastructure
   - "It's okay if you get it in 5 seconds instead of 5 milliseconds"

### C. Technology Decisions

| Layer | Choice | Reasoning |
|---|---|---|
| **Frontend** | React | AI is very good at generating React code |
| **Full-stack framework** | **TanStack Start** (not Next.js) | Next.js only deploys well on Vercel; TanStack Start deploys anywhere |
| **Runtime** | Cloudflare Workers | Free tier, serverless, globally distributed |
| **Database** | **Cloudflare D1** (SQLite-based) | Free tier, serverless, no management overhead |
| **ORM** | **Drizzle ORM** | Lightweight TypeScript ORM with type safety |
| **Auth** | Google OAuth | Simple, no custom auth needed |
| **Deployment** | Cloudflare (Wrangler CLI) | Free, everything in one platform |
| **CSS** | Tailwind (presenter's preference) | AI generates better Tailwind; keeps styling in-component; no separate CSS files |

### D. Key Lesson: Firebase vs. Superbase vs. Cloudflare
- **Firebase**: NoSQL, "no one uses it anymore," has issues
- **Superbase**: PostgreSQL, open source, has auth — solid option
- **Cloudflare D1**: Presenter's recommendation — keeps everything on one platform (database, deployment, auth, workers)
- Decision: **use Cloudflare for everything** to keep it simple

### E. Teaching Moments During the Demo
The presenter pauses to explain concepts the audience doesn't know:
- **ORM (Object-Relational Mapping)**: Using code objects to interact with databases instead of raw SQL; provides type safety
- **Primary keys**: Unique identifiers for database rows — no two rows share the same value
- **Type safety**: Compiled languages catch type errors before runtime; auto-complete, self-documenting, easier refactoring
- **Monorepo vs. microservices**: AI works better with monorepos (all code in one repository = more context for the AI); microservices are "dying off" in the AI era
- **Three layers of a web app**: Frontend (React), Backend (TypeScript/TanStack Start server functions), Database (D1)
- Encourages students to **ask the AI to explain anything they don't understand** — "What's the issue with asking?"

---

## VIII. Fast Mode Demo (Anthropic Employee)

### A. What is Fast Mode?
- An advanced Claude Code feature — **faster than Haiku but using Opus 4.6**
- Approximately **6x more expensive** than standard mode
- Anthropic had been using it internally for months before public release
- Activated via `/fast` command in Claude Code
- May require Max plan or API access (not available on basic $20 plan)

### B. Speed Demonstration
- The presenter builds the MVP frontend in fast mode
- Generates the entire UI in approximately **3 minutes** (3,000 tokens)
- Build succeeds cleanly — automatic verification passes with no errors
- Presenter: "This would have taken 20 minutes without fast mode"
- Anthropic employee confirms: "What we have internally is gonna be even faster"

### C. Practical Advice on Fast Mode
- Great for rapid prototyping and demos
- Very expensive — not for learning or exploration
- Use standard mode for understanding and learning; fast mode for execution

---

## IX. Common Mistakes & Best Practices

### A. Planning Mistakes Demonstrated
- **Mistake**: Planning everything in one massive spec instead of feature-by-feature
  - Better approach: Create the overall architecture plan, then plan each feature individually
  - "Build feature by feature. Landing page first → verify → calendar integration → verify → auth → verify"
- **Mistake**: Not telling the AI where to put files — it creates its own structure
  - Always specify directory structure and file locations
- **Mistake**: Spending 47K tokens on research when the repo is empty
  - "I'm not going to let it waste tokens for no reason"
- **Mistake**: Letting AI run for 20+ minutes without verification
  - "It doesn't work well after 20 minutes. Always put checkpoints."
  - Feature-by-feature approach prevents long, unverified runs

### B. Interacting with AI Effectively
- Don't yell at it — performance degrades when you're aggressive
- Don't be overly deferential either — "don't become deep beta with it"
- Best tone: **matter-of-fact, respectful, clear** — "there's a very specific tone that works best"
- If it makes mistakes: "Change of plans" — calmly redirect
- Use "explain it like I'm a new grad" for learning
- Anthropic employee: "If you say 'hurry up, I really need the answer,' it does go a little faster" (internally, at least)

### C. What NOT to Do
- Don't outsource the thinking — you lose your engineering instincts
- Don't skip verification — "the danger is you skip the thinking"
- Don't trust AI blindly — always verify, especially with unfamiliar MCPs or skills
- Don't install random MCPs or skills — security risk (references an incident "yesterday")
- Don't try to build everything at once — feature by feature, verify each step

---

## X. Practical Hackathon Advice

### A. Free/Cheap Tools for Broke College Students
- **Open Code**: Free models available (Kilo, Gemini 4.5 — "nerfed" but functional)
- **Antigravity**: Has Opus 3 available for free
- **Cloudflare**: Free tier is generous — database, deployment, workers
- **Vercel**: Free up to a certain usage threshold (but only good for Next.js)
- **Superbase**: Free tier available
- Links to be shared in the Hacklahoma Discord

### B. Git & Version Control
- **"If you don't know what Git is, ask me"** — emphasized as one of the most important skills
- Use checkpoints: commit frequently as you build feature by feature
- Essential for team collaboration during the hackathon

### C. Multi-Agent Development
- Presenter advises against multi-agent workflows for beginners
- "Do one task at a time, learn from it, learn the mistakes"
- Advanced users: spin up 5 terminals (using tmux) with separate agents working on different features
- Anthropic employee confirms they use multi-agent workflows internally

---

## XI. Closing

- Raffle winners announced for 3 Claude Code passes and 2 books
- Presenter encourages everyone to keep learning and asking questions
- Final emphasis: **"Don't outsource the thinking"**

---

## Key Takeaways for the Dream Team

| Principle | Application |
|---|---|
| **Plan before building** | Create plan.md files; define architecture, database schema, API structure upfront |
| **Feature-by-feature** | Don't build everything at once; implement one feature, verify, then move to next |
| **Verification is critical** | Human review + linting + type checking + tests after every feature |
| **Don't outsource thinking** | Understand what AI generates; review is where learning happens |
| **System design matters** | Judges look for architecture thinking, scalability, database design |
| **Use skills/prompts** | Front-end design skill prevents ugly AI-generated UIs |
| **Keep it deployable** | Judges want to see a live URL, not just code |
| **Use free tiers** | Cloudflare (D1, Workers), TanStack Start for flexible deployment |
| **Context7 MCP** | Gives AI access to framework documentation for better code generation |
| **Monorepo preferred** | AI works better with everything in one repo for maximum context |
