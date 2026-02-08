Prerequisites (Manual Steps)

 Before starting implementation:
 1. Google Cloud Console: Create project, enable Calendar API, configure OAuth consent screen,
 create OAuth client ID, set redirect URI
 2. Cloudflare: Create account, create D1 database, note database ID
 3. Anthropic: Get Claude API key
 4. Environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI,
 ANTHROPIC_API_KEY, SESSION_SECRET, CLOUDFLARE_D1_DATABASE_ID
 
 Risks
  Risk: TanStack Start + Cloudflare Workers compatibility
  Mitigation: Research adapter early; Hono fallback if needed
  ────────────────────────────────────────
  Risk: Cloudflare Workers CPU limits on streaming
  Mitigation: Streaming extends worker lifetime; test early
  ────────────────────────────────────────
  Risk: Intake data loss during OAuth redirect
  Mitigation: Store in sessionStorage before redirect
  ────────────────────────────────────────
  Risk: Google token security in D1
  Mitigation: Encrypt tokens using Worker secrets


<!-- Credentials stored in src/.env.local (gitignored) — see .env.example for required keys -->
