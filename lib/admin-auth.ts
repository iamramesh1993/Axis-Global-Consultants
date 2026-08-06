import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-operator auth for /admin.
 *
 * Not a user system — there is one password, held in an env var, and a signed
 * session cookie. That is proportionate for one advisor reading their own
 * leads. If Axis Global ever needs per-staff accounts, roles or an audit trail,
 * this should be replaced with a real auth provider rather than extended.
 *
 * Properties worth preserving if you touch this:
 *   - The cookie is HMAC-signed, so it cannot be forged without the secret.
 *   - Password and signature comparisons are timing-safe.
 *   - It fails closed: missing config means nobody gets in, not everybody.
 */

export const ADMIN_COOKIE = "axis_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

type Configured = { ok: true; password: string; secret: string };
type NotConfigured = { ok: false; missing: string[] };

/** Both values must be present, or /admin refuses to authenticate anyone. */
export function getAdminConfig(): Configured | NotConfigured {
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  const missing: string[] = [];
  if (!password) missing.push("ADMIN_PASSWORD");
  if (!secret) missing.push("ADMIN_SESSION_SECRET");

  if (missing.length > 0) {
    // Logged, not rendered: the login page is public, so naming the missing
    // variables there would tell a stranger how the deployment is configured.
    console.warn(`[admin] not configured — missing: ${missing.join(", ")}`);
    return { ok: false, missing };
  }
  return { ok: true, password: password!, secret: secret! };
}

/** Constant-time string compare that tolerates length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  // timingSafeEqual throws on length mismatch, so hash first to equalise length.
  const hashA = createHmac("sha256", "cmp").update(bufA).digest();
  const hashB = createHmac("sha256", "cmp").update(bufB).digest();
  return timingSafeEqual(hashA, hashB);
}

export function verifyPassword(candidate: string): boolean {
  const config = getAdminConfig();
  if (!config.ok) return false;
  return safeEqual(candidate, config.password);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Token shape: `<expiryMs>.<nonce>.<hmac>` */
export function createSessionToken(): string | null {
  const config = getAdminConfig();
  if (!config.ok) return null;

  const expiry = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(12).toString("base64url");
  const payload = `${expiry}.${nonce}`;
  return `${payload}.${sign(payload, config.secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const config = getAdminConfig();
  if (!config.ok) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiryRaw, nonce, signature] = parts as [string, string, string];
  const payload = `${expiryRaw}.${nonce}`;

  if (!safeEqual(signature, sign(payload, config.secret))) return false;

  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  return true;
}

/**
 * Cookie options, with `secure` derived from the actual request scheme rather
 * than from NODE_ENV.
 *
 * NODE_ENV is "production" for any `next start`, including a local one served
 * over http — and a browser silently discards a Secure cookie on an http origin.
 * That made sign-in look broken with no error anywhere: the redirect fired, the
 * cookie was dropped, and /admin/leads bounced straight back to the login page.
 *
 * Reading the scheme means production over TLS still gets Secure, and a local
 * http build is testable, without a test-only escape hatch that could be left
 * switched on by accident.
 */
export function sessionCookieOptions(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const scheme = forwardedProto
    ? // A proxy may send a comma-separated list; the client-facing hop is first.
      (forwardedProto.split(",")[0]?.trim() ?? "")
    : new URL(request.url).protocol.replace(":", "");

  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: scheme === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** True when the current request carries a valid admin session. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
