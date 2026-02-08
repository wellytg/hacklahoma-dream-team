/**
 * Cookie-based session management for Cloudflare Workers.
 *
 * Sessions are signed cookies containing the user ID.
 * Format: `<base64url(userId)>.<base64url(hmac)>`
 *
 * Uses the Web Crypto API (crypto.subtle) -- no Node.js modules.
 */

const SESSION_COOKIE_NAME = 'sensei_session';
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Import an HMAC-SHA256 signing key from a raw secret string. */
async function getSigningKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/** Encode bytes to a URL-safe base64 string (no padding). */
function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decode a URL-safe base64 string back to an ArrayBuffer. */
function fromBase64Url(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a signed session cookie value for the given user ID.
 *
 * @returns `<base64url(userId)>.<base64url(hmac)>`
 */
export async function createSession(
  userId: string,
  secret: string,
): Promise<string> {
  const key = await getSigningKey(secret);
  const enc = new TextEncoder();
  const data = enc.encode(userId);

  const signature = await crypto.subtle.sign('HMAC', key, data);
  const encodedId = toBase64Url(data.buffer);
  const encodedSig = toBase64Url(signature);

  return `${encodedId}.${encodedSig}`;
}

/**
 * Validate a signed session cookie value.
 *
 * @returns The user ID if valid, or `null` if the signature check fails.
 */
export async function validateSession(
  cookieValue: string,
  secret: string,
): Promise<string | null> {
  const dotIndex = cookieValue.indexOf('.');
  if (dotIndex === -1) return null;

  const encodedId = cookieValue.slice(0, dotIndex);
  const encodedSig = cookieValue.slice(dotIndex + 1);

  try {
    const key = await getSigningKey(secret);
    const data = fromBase64Url(encodedId);
    const signature = fromBase64Url(encodedSig);

    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return null;

    const dec = new TextDecoder();
    return dec.decode(data);
  } catch {
    return null;
  }
}

/**
 * Build a `Set-Cookie` header value that establishes the session.
 *
 * Flags: HttpOnly, Secure, SameSite=Lax, Path=/
 */
export function getSessionCookie(
  value: string,
  maxAge: number = DEFAULT_MAX_AGE,
): string {
  return [
    `${SESSION_COOKIE_NAME}=${value}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ].join('; ');
}

/**
 * Build a `Set-Cookie` header value that clears the session.
 */
export function getClearSessionCookie(): string {
  return [
    `${SESSION_COOKIE_NAME}=`,
    'Max-Age=0',
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ].join('; ');
}

/**
 * Extract the session cookie value from a `Cookie` header string.
 *
 * @returns The raw cookie value, or `null` if not found.
 */
export function parseSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const prefix = `${SESSION_COOKIE_NAME}=`;
  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }

  return null;
}
