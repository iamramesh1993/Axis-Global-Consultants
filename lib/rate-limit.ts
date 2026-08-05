/**
 * Minimal in-memory IP rate limiter.
 *
 * Deliberately simple for Phase 1. Caveat worth knowing: serverless instances
 * don't share memory, so the effective limit is per-instance rather than
 * global. That is enough to stop a single script hammering the form, and it
 * costs nothing. Move to Upstash Redis when lead volume justifies it.
 */

type Entry = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, Entry>();

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
  // Hard cap so a spoofed-header flood can't grow the map without bound.
  if (hits.size > MAX_TRACKED_IPS) hits.clear();
}

export function checkRateLimit(ip: string): {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  sweep(now);

  const existing = hits.get(ip);

  if (!existing || existing.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    ok: true,
    remaining: MAX_REQUESTS - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP. Vercel sets x-forwarded-for; take the first hop. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
