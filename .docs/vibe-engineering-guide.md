# Vibe Engineering Guide

**Vibe engineering** is strategic, intentional AI-assisted development. You are the architect; AI is the builder. Don't outsource the thinking.

---

# Part 1: Instructions for the Human

## Workflow

### 1. Research

Gather all context before writing any code.

- New projects: define what you're building, who it's for, what tech stack to use
- Existing codebases: understand what needs to change — columns, components, APIs
- Use AI to explain unfamiliar concepts — ask freely

### 2. Plan

Create a `plan.md` as a structured spec. This is the most important step.

- Plan **feature by feature**, not one massive spec
- Store plans in `.docs/plans/` as markdown with checkboxes
- Start with plan mode enabled — forces AI to plan before executing
- See Part 2 for what to include in the plan

### 3. Implement

Hand the plan to AI with full context, then monitor.

- Build one feature at a time: feature → verify → commit → next feature
- Don't let AI run 20+ minutes without a checkpoint — quality degrades
- If something goes wrong, say "change of plans" — calmly redirect
- Commit after each verified feature

### 4. Verify

Run after every feature. Three layers:

1. **Human review** — read what AI produced; check API design, architecture, components, database design, code patterns
2. **Automated checks** — linting (ESLint/Ruff), type checking (TypeScript compiler), unit tests, integration tests
3. **Runtime check** — does it actually work?

## How to Talk to the AI

- **Tone**: matter-of-fact, respectful, clear
- Don't be aggressive (degrades performance) or overly deferential
- To learn: "explain it like I'm a new grad"
- To redirect: "change of plans" — then provide new direction

## Common Mistakes

| Mistake | Fix |
|---|---|
| One massive plan for everything | Plan feature by feature |
| Not specifying file locations | Define directory structure in the plan |
| Letting AI research an empty repo | Skip research when there's nothing to analyze |
| Running AI 20+ minutes unchecked | Insert verification checkpoints between features |
| Trusting AI output without reading it | Review everything — that's where learning happens |
| Installing random MCPs/skills | Only use trusted, well-known tools |

## Tools to Set Up

### Skills
- Markdown files in `.claude/skills/` that give AI specialized instructions
- Example: a front-end design skill prevents generic AI-generated UIs
- Reuse community-built skills from GitHub

### MCP (Model Context Protocol)
- Connects AI to external tools and documentation
- **Context7 MCP**: lets AI look up framework docs (Cloudflare, TanStack, etc.)
- Only install well-known, trusted MCPs — unvetted ones are a security risk

### Voice Input (Whisper Flow)
- Speak thoughts directly into Claude Code — rubber duck debugging
- Less typing, more auditing

### Fast Mode
- Same model (Opus 4.6), faster output, ~6x more expensive
- Use for execution, not exploration
- Activate with `/fast` in Claude Code

---

# Part 2: Instructions for the LLM

What the AI should receive, and what it should do.

## Plan Format

Every plan you give the LLM should include:

- **Directory structure** — where every file goes (AI invents its own if you don't specify)
- **Function signatures** — names, parameters, return types
- **API endpoints** — routes, methods, request/response shapes
- **Type definitions** — interfaces, enums, shared types
- **Database schema** — tables, columns, relationships, primary keys
- **Error handling strategy** — how to handle failures, retries, edge cases
- **Testing approach** — what to test, what framework to use
- **Step-by-step build order** — which feature to implement first, second, etc.

## Context to Provide

- The plan file (`plan.md`)
- Relevant skills (`.claude/skills/`)
- Access to documentation via MCP (Context7)
- Any existing code the feature touches

## Constraints to Enforce

Tell the LLM:

- Follow the plan exactly — don't add unrequested features
- Build one feature at a time, then stop for verification
- Use the specified directory structure — don't create new directories without approval
- Run linting and type checking after each feature
- Keep code clean and well-documented
- Use Tailwind for styling (co-located, no separate CSS files)
- Prefer monorepo structure — all code in one repository for maximum context

## Verification Commands the LLM Should Run

After each feature:

1. **Lint**: `npx eslint .` or `ruff check .`
2. **Type check**: `npx tsc --noEmit`
3. **Test**: `npm test` or equivalent
4. **Build**: `npm run build` — confirm clean build with no errors

## Recommended Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React | AI generates strong React code |
| Framework | TanStack Start | Deploys anywhere (not locked to Vercel) |
| Runtime | Cloudflare Workers | Free, serverless, global |
| Database | Cloudflare D1 (SQLite) | Free, serverless, no management |
| ORM | Drizzle ORM | Lightweight, TypeScript type safety |
| Auth | Google OAuth | Simple, no custom auth needed |
| CSS | Tailwind | AI generates better Tailwind; co-located styling |
| Deployment | Cloudflare (Wrangler CLI) | Free, everything on one platform |

**Alternatives:** Supabase (PostgreSQL + auth), Open Code / Antigravity (free AI coding tools)

---

## Workflow Summary

```
Research → Plan (feature-by-feature) → Implement → Verify → Commit → Next Feature
```

Repeat per feature. Ship continuously.
