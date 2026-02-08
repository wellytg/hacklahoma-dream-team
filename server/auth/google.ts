/**
 * Google OAuth2 helpers for Cloudflare Workers.
 *
 * Uses only the Fetch API and standard Web APIs (no Node.js modules).
 * Requires env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI.
 */

const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar',
].join(' ');

const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token: string;
  token_type: string;
  scope: string;
}

export interface GoogleUserInfo {
  sub: string; // Google user ID
  email: string;
  name: string;
  picture?: string;
}

export interface TokenEnv {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

// ---------------------------------------------------------------------------
// Authorization URL
// ---------------------------------------------------------------------------

/**
 * Build the Google OAuth2 authorization URL.
 *
 * Uses `access_type=offline` and `prompt=consent` so the authorization server
 * always returns a refresh token.
 */
export function getAuthorizationUrl(
  config: { clientId: string; redirectUri: string },
  state?: string,
): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
  });

  if (state) {
    params.set('state', state);
  }

  return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Token exchange
// ---------------------------------------------------------------------------

/**
 * Exchange an authorization code for an access token (and, on the first
 * authorization, a refresh token).
 */
export async function exchangeCodeForTokens(
  code: string,
  env: TokenEnv,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    code,
    client_id: env.clientId,
    client_secret: env.clientSecret,
    redirect_uri: env.redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<GoogleTokenResponse>;
}

// ---------------------------------------------------------------------------
// Refresh token
// ---------------------------------------------------------------------------

/**
 * Use a refresh token to obtain a new access token.
 */
export async function refreshAccessToken(
  refreshToken: string,
  config: { clientId: string; clientSecret: string },
): Promise<{ access_token: string; expires_in: number }> {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token refresh failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

// ---------------------------------------------------------------------------
// User info
// ---------------------------------------------------------------------------

/**
 * Fetch the authenticated user's profile from the Google UserInfo endpoint.
 */
export async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google userinfo request failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<GoogleUserInfo>;
}

// ---------------------------------------------------------------------------
// ID token parsing
// ---------------------------------------------------------------------------

/**
 * Decode the payload of a Google-issued JWT id_token.
 *
 * We skip cryptographic verification because the token was obtained directly
 * from Google's token endpoint over HTTPS in this same request flow.
 */
export function parseIdToken(idToken: string): {
  sub: string;
  email: string;
  name: string;
} {
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: expected 3 segments');
  }

  // Base64url -> Base64 -> decode
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(base64);
  const payload = JSON.parse(json);

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}
