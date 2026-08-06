import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminConfig,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin-auth";
import {
  checkRateLimit,
  getClientIp,
  SIGN_IN_MAX_ATTEMPTS,
} from "@/lib/rate-limit";
import { redirectTo } from "@/lib/redirect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 10 attempts per IP per 10 minutes — see SIGN_IN_MAX_ATTEMPTS for why this
  // is looser than the lead form's.
  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`admin-login:${ip}`, SIGN_IN_MAX_ATTEMPTS);
  if (!limit.ok) {
    return redirectTo("/admin/login?error=throttled");
  }

  const config = getAdminConfig();
  if (!config.ok) {
    return redirectTo("/admin/login?error=unconfigured");
  }

  const form = await request.formData();
  /**
   * Trimmed on purpose. A trailing space or newline — from a paste, or from the
   * value stored in the hosting dashboard — is the most common reason a correct
   * password reads as wrong, and it is invisible to the person typing it.
   * The configured value is trimmed the same way in getAdminConfig().
   */
  const password = String(form.get("password") ?? "").trim();

  if (!verifyPassword(password)) {
    // Lengths only, never the values: enough to spot a whitespace or encoding
    // mismatch from the logs without putting either password in them.
    console.warn(
      `[admin] failed sign-in — submitted length ${password.length}, expected length ${config.password.length}`,
    );
    return redirectTo("/admin/login?error=invalid");
  }

  const token = createSessionToken();
  if (!token) {
    return redirectTo("/admin/login?error=unconfigured");
  }

  const response = redirectTo("/admin/leads");
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions(request));
  return response;
}
