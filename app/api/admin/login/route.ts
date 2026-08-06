import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminConfig,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Same limiter as the lead form: 5 attempts per IP per 10 minutes. A single
  // operator will never hit it; a password guesser will.
  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`admin-login:${ip}`);
  if (!limit.ok) {
    return NextResponse.redirect(
      new URL("/admin/login?error=throttled", request.url),
      { status: 303 },
    );
  }

  const config = getAdminConfig();
  if (!config.ok) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unconfigured", request.url),
      { status: 303 },
    );
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!verifyPassword(password)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid", request.url),
      { status: 303 },
    );
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unconfigured", request.url),
      { status: 303 },
    );
  }

  const response = NextResponse.redirect(new URL("/admin/leads", request.url), {
    status: 303,
  });
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
  return response;
}
