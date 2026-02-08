/**
 * Auth helpers for TanStack Start server functions on Cloudflare Workers.
 *
 * These are used inside `createServerFn` handlers to identify the
 * currently-authenticated user from the session cookie.
 */

import { validateSession, parseSessionCookie } from '../auth/session';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthenticatedUser {
  userId: string;
}

interface EnvWithSecret {
  SESSION_SECRET: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract and validate the session cookie from a raw `Cookie` header.
 *
 * @returns `{ userId }` if the session is valid, otherwise `null`.
 */
export async function getAuthenticatedUser(
  cookieHeader: string | null,
  env: EnvWithSecret,
): Promise<AuthenticatedUser | null> {
  const sessionValue = parseSessionCookie(cookieHeader);
  if (!sessionValue) return null;

  const userId = await validateSession(sessionValue, env.SESSION_SECRET);
  if (!userId) return null;

  return { userId };
}

/**
 * Assert that a user is authenticated.
 *
 * Throws a 401 Response if `userId` is null, which TanStack Start will
 * propagate as an HTTP 401 to the client.
 */
export function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
