# Hacklahoma Dream Team — Third Conversation Outline

---

## I. Naming the App

### A. Initial Brainstorming
- Team discusses what to call the project — "pocket advisor," "pocket mentor," etc.
- Dallas admits he's biased toward "Evolver" (the name from his prior work) but is open to ideas

### B. Wellington Proposes "Sensei"
- Suggests the name **"Sensei"** — evokes a mentor/guide relationship
- Riffs on the metaphor: "entering the dojo," "choose your mastery level," "become a super ninja"
- Inspired by gaming imagery
- Dallas's reaction: initially needs to let it "roll around" in his head, but it grows on him quickly
- **Team agrees on "Sensei"** as the working name

---

## II. Reviewing the Conversation Outlines & Feature Areas

### A. Dallas Reviews the Prior Conversation Outline
- References the documented feature areas from previous conversations:
  1. Time management & scheduling
  2. Career exploration & guidance
  3. Skill building & tracking
  4. Academic support
  5. Multiplayer/social features
- Notes these are the main features to build on beyond the onboarding flow

### B. Scope Reminder
- Team reaffirms they just need an **MVP** (minimum viable product) right now
- Doesn't have to be 100% complete — just needs to demonstrate the concept
- They have API access, so they can "definitely do something cool"

---

## III. Agent-Based Architecture Design

### A. Dallas Proposes an LLM Agent Framework
- Key insight: LLMs need **structure/harness** — you can't just give them open-ended prompts
- Each phase of the app should have a **dedicated agent** with:
  - A defined role and purpose
  - Step-by-step process instructions
  - Available tools specific to that agent's function
- The agent keeps conversations on track within its assigned phase

### B. Proposed Agent Structure
1. **Onboarding Agent**
   - Guides user through initial questions (the 5-question flow discussed previously)
   - Moves user through defined phases sequentially
   - Interacts naturally but stays within the onboarding framework
2. **Time Management Agent**
   - Has tools to create/modify/delete calendar events
   - Helps users with scheduling and productivity
3. **Career Pathfinding Agent**
   - Helps users explore career directions
4. **Skill Building Agent**
   - Guides users through skill development paths
5. **Life Balance Agent**
   - Helps users manage across life domains

### C. Dallas's Professional Experience
- Built a similar agent system at his job (described later in detail)
- Used a relatively simple prompt structure: role description + interaction style + step-by-step process
- Found that agents do "a very good job of keeping the conversation on track" with this approach

---

## IV. External Integrations

### A. Calendar & Productivity Tool Integration
- Once agents need to take actions (e.g., create calendar events), they need API integrations
- Target platforms discussed:
  - **Google Calendar** (free, widely used)
  - **Apple Calendar** (default for iPhone users)
  - **Microsoft Outlook/Calendar** (common at universities like University of Tulsa)
- Each integration requires:
  - Authentication with the user's account
  - CRUD operations (Create, Read, Update, Delete) for calendar events
  - Agent instruction files describing how to interface with each API

### B. Internal Data Representation
- The app needs its own **internal copy of the user's schedule** — not just relying on external calendar queries every time
- Two-way sync: pull calendar data into the app, and push new events back out
- This allows the app to answer questions like "What am I doing this Friday?" without calling external APIs each time

### C. Learning Management System (LMS) Integration
- **Blackboard** (used at University of Tulsa) and **Canvas** (used at OU/Hacklahoma's university) identified as key LMS platforms
- Both have published APIs for developers
- Dallas has been exploring Blackboard's API for his own teaching needs (he teaches "Secure and Trustworthy AI" at University of Tulsa)
- Potential: automatically pull assignment deadlines, course schedules, etc. into the app

### D. Research-Backed Prioritization
- Based on prior survey research, the most commonly used student tools are:
  - Google Notes / Google Keep
  - Apple Notes
  - Google Calendar
  - Apple Calendar
  - Microsoft Calendar
- Team discusses starting with just **one integration** (the most commonly used calendar app) for the MVP

---

## V. Backend & Data Storage

### A. Technology Choice: Firebase/Firestore
- Dallas has **prepaid Google Cloud credits** available to the team
- Plans to use **Firebase** or **Firestore** for:
  - User data storage
  - Account creation and management
  - Backend data persistence

### B. Security Considerations
- Dallas emphasizes **security is critical**, even for a prototype
- Users will be sharing personal data (schedules, goals, career info)
- Need careful access rules to prevent data exposure
- Must think seriously about how integrations handle personal information

---

## VI. User Interface Design

### A. Discussion of Design Tools
- Dallas asks if anyone has experience with **Figma** or graphic/visual design
- No one on the team has significant Figma experience
- Alternatives discussed:
  - Figma AI (free tier may be available but feature limitations unknown)
  - **Stitch** — a prototyping tool Dallas mentions (someone on the team has tried it)
  - Drawing mockups by hand, photographing them, and feeding the images to AI (Claude, Gemini) to generate code

### B. AI-Assisted UI Development Approach
- Dallas's preferred workflow:
  1. Sketch or describe the desired interface
  2. Feed the sketch/description to an AI tool
  3. Have AI generate the frontend code
- This is validated by Dallas's professional experience (detailed in next section)

---

## VII. Dallas Demonstrates His Professional AI Workflow

### A. The FOIA App Demo
- Dallas shows the team an app he built at his job — an **AI-powered FOIA (Freedom of Information Act) request processor**
- The app helps government employees (e.g., Oklahoma Attorney General's Office) handle open records requests
- Traditional process is extremely labor-intensive: manually searching databases, reviewing records, redacting sensitive information, generating reports

### B. How the FOIA App Works (Agent Workflow)
1. **Request Validation Agent**: Analyzes incoming FOIA requests — checks if the request is specific enough, too broad, or poorly formed; may send clarification requests back to the requester
2. **Database Search Agent**: Creates SQL queries against a records database (demo uses the Enron email database as a mock dataset); iteratively refines queries to improve results
3. **Human-in-the-Loop Review**: A human expert reviews the retrieved records, approves/rejects specific items
4. **Report Generation**: Packages approved records into a final report for delivery

### C. The Development Process — Key Lesson for the Team
- Dallas **wrote no code himself** for this app
- Process:
  1. His boss provided a vague idea described as a **swim lane diagram**
  2. Dallas fed the diagram description to **Google Gemini** to generate a visual mockup
  3. He then fed the mockup image to **Claude** and said "I want to build this app — let's talk about it and make a plan"
  4. Through ~10 hours of iterative conversation with Claude, the entire app was built
- The demo includes: conversation history, workflow visualization, an AI assistant ("Daisy") that guides users, and multi-step agent workflows

### D. Implications for the Hackathon
- Dallas argues the team should follow the same approach:
  1. **Precisely define the ideas** they want to implement (in plain English, drawings, flow diagrams)
  2. **Hand off to AI agents** to generate code
  3. **Run multiple agents in parallel** — one on the database/backend, one on the UI, one on agent prompts, one on application state logic
- Emphasizes that using AI tools is **not against hackathon rules** — it's actively encouraged
- Dallas has significant experience with this workflow, so it should go faster than 10 hours
- Any artistic/design skills on the team would help, but the main bottleneck is **precise idea definition**

---

## VIII. Closing: Agreement on Next Steps

- Zia summarizes the consensus: **"Let's start working on the basic idea and define it"**
- The team aligns on the priority of clearly defining the app concept before jumping into code generation
- Implicit agreement on the development approach: define first, then leverage AI to build

---

## Key Decisions & Takeaways

| Topic | Decision |
|---|---|
| **App Name** | "Sensei" (working name) |
| **Architecture** | Agent-based: dedicated LLM agents for each app phase (onboarding, time management, career, skills, life balance) |
| **Integrations** | Start with one calendar API (likely Google Calendar); LMS integration (Canvas/Blackboard) as stretch goal |
| **Backend** | Firebase/Firestore using Dallas's prepaid Google Cloud credits |
| **UI Approach** | Sketch/describe designs → feed to AI → generate code |
| **Development Method** | Define ideas precisely in plain English/diagrams, then use AI (Claude) to generate code; parallelize with multiple agents |
| **Security** | Must be considered even for prototype — user data protection is non-negotiable |
| **Immediate Priority** | Define the app concept and features clearly before writing any code |
