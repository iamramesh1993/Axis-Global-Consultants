import { redirect } from "next/navigation";
import { Lock, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { getAdminConfig, isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "That password is not right. Try again.",
  throttled: "Too many attempts. Wait a few minutes and try again.",
  unconfigured:
    "Admin access is not configured yet. ADMIN_PASSWORD and ADMIN_SESSION_SECRET need to be set.",
  expired: "Your session expired. Please sign in again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; signedout?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin/leads");

  const { error, signedout } = await searchParams;
  const config = getAdminConfig();
  const message = error ? ERRORS[error] : undefined;

  return (
    <div className="bg-panel flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo showTagline={false} />
        </div>

        <div className="rounded-card-lg border-line bg-card mt-8 border p-7 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="rounded-control bg-brand-tint grid h-10 w-10 place-items-center"
            >
              <Lock className="text-brand h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-[-0.02em]">
                Leads dashboard
              </h1>
              <p className="text-ink-muted text-sm">Staff access only</p>
            </div>
          </div>

          {!config.ok && (
            <div className="rounded-control border-danger/30 bg-danger/5 mt-6 flex gap-3 border p-4">
              <ShieldAlert
                className="text-danger mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <div className="text-ink-muted text-sm leading-relaxed">
                <p className="text-ink font-semibold">Not configured yet.</p>
                <p className="mt-1">
                  Set{" "}
                  {config.missing.map((key, i) => (
                    <span key={key}>
                      {i > 0 && " and "}
                      <code className="bg-panel text-brand rounded px-1.5 py-0.5 font-mono text-[0.8em] font-semibold">
                        {key}
                      </code>
                    </span>
                  ))}{" "}
                  in the Vercel project, then redeploy.
                </p>
              </div>
            </div>
          )}

          {signedout && !message && (
            <p className="rounded-control border-line bg-panel text-ink-muted mt-6 border px-4 py-3 text-sm">
              You have been signed out.
            </p>
          )}

          {message && (
            <p
              role="alert"
              className="rounded-control border-danger/30 bg-danger/5 text-danger mt-6 border px-4 py-3 text-sm font-medium"
            >
              {message}
            </p>
          )}

          {/*
            A plain form POST, deliberately: no client JS, so the password never
            passes through fetch, application state, or an error boundary.
          */}
          <form
            action="/api/admin/login"
            method="POST"
            className="mt-6 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
                disabled={!config.ok}
                className="rounded-control border-line-strong bg-card text-ink focus:border-brand focus:ring-brand-light h-12 w-full border px-4 text-base transition-[border-color,box-shadow] duration-200 outline-none focus:ring-4 disabled:opacity-50 md:text-[0.9375rem]"
              />
            </div>

            <Button type="submit" size="lg" disabled={!config.ok}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-ink-subtle mt-6 text-center text-xs leading-relaxed">
          This page is excluded from search engines and from the sitemap.
        </p>
      </div>
    </div>
  );
}
