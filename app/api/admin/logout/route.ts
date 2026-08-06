import { ADMIN_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";
import { redirectTo } from "@/lib/redirect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = redirectTo("/admin/login?signedout=1");

  // Must match the attributes the cookie was set with, or the browser keeps it.
  response.cookies.set(ADMIN_COOKIE, "", {
    ...sessionCookieOptions(request),
    maxAge: 0,
  });

  return response;
}
