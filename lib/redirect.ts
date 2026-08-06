import { NextResponse } from "next/server";

/**
 * A 303 redirect with a *relative* Location.
 *
 * `NextResponse.redirect()` needs an absolute URL, and the obvious way to build
 * one — `new URL(path, request.url)` — uses the host the server received, not
 * the host the browser asked for. Those differ constantly:
 *
 *   - locally, `request.url` says `localhost` while the browser is on `127.0.0.1`
 *   - on Vercel, it can be the internal deployment host while the browser is on
 *     the custom domain
 *
 * That makes the redirect cross-origin, and `form-action 'self'` in our CSP then
 * blocks the browser from following it after a form POST. The symptom is brutal
 * to debug: the request succeeds, the session cookie is set, and the user is
 * still staring at the login page with no error.
 *
 * A relative Location is valid per RFC 7231 and every browser resolves it
 * against the address bar, so origin always matches and the CSP stays strict.
 */
export function redirectTo(path: string, status: 303 | 307 = 303) {
  if (!path.startsWith("/")) {
    throw new Error(`redirectTo expects a root-relative path, got "${path}"`);
  }

  return new NextResponse(null, {
    status,
    headers: { Location: path },
  });
}
