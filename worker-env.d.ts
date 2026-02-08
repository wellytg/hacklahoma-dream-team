// Augment the Cloudflare.Env interface with project-specific bindings and secrets.
// See: https://developers.cloudflare.com/workers/languages/typescript/#bindings
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    ANTHROPIC_API_KEY: string;
    SESSION_SECRET: string;
    ENVIRONMENT: string;
  }
}
