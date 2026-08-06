import { test, expect } from "@playwright/test";
import { TEST_ADMIN_PASSWORD, UNCONFIGURED_BASE } from "../playwright.config";

/**
 * The admin dashboard, both halves of it.
 *
 * The suite used to only cover the locked state — no password existed in the
 * test environment, so it could prove nobody gets in and nothing else. The
 * successful sign-in, the dashboard render and sign-out were never exercised.
 * That gap surfaced in production: a correct password appeared not to work and
 * there was no test to say whether the happy path had ever functioned.
 *
 * The default server now has admin credentials so the whole flow is covered.
 * A second server on UNCONFIGURED_BASE has none, so fail-closed stays proven.
 */

/**
 * Every test gets its own rate-limit bucket, keyed on project *and* describe.
 *
 * Sign-in is limited per IP. From 127.0.0.1 the whole file shares one bucket,
 * and with three browser projects running the same specs it took 3x the
 * requests — later tests got throttled instead of tested. Keying on the project
 * too keeps each under the limit.
 *
 * In production Vercel overwrites x-forwarded-for at the edge, so this isolates
 * tests without offering a way around the limiter.
 */
function bucketIp(titlePath: string[], project: string): string {
  const seed = `${project}|${titlePath[0] ?? ""}`;
  const octet =
    (seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 200) + 20;
  return `198.51.100.${octet}`;
}
test.beforeEach(async ({ page }, testInfo) => {
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": bucketIp(testInfo.titlePath, testInfo.project.name),
  });
});

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Password", { exact: true }).fill(TEST_ADMIN_PASSWORD);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/\/admin\/leads/);
}

test.describe("admin sign-in", () => {
  test("the form is usable and reveals the password on request", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    const field = page.getByLabel("Password", { exact: true });
    await expect(field).toBeEnabled();
    await expect(field).toHaveAttribute("type", "password");

    await field.fill("something-secret");
    await page.getByRole("button", { name: /show password/i }).click();
    // Without this a typo is invisible and the only feedback is a failed login.
    await expect(field).toHaveAttribute("type", "text");
    await expect(field).toHaveValue("something-secret");

    await page.getByRole("button", { name: /hide password/i }).click();
    await expect(field).toHaveAttribute("type", "password");
  });

  test("the correct password signs you in", async ({ page }) => {
    await signIn(page);

    await expect(page).toHaveURL(/\/admin\/leads/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/leads/i);
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });

  test("a surrounding space does not break a correct password", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    // A trailing space from a paste is the classic cause of a "wrong" password.
    await page
      .getByLabel("Password", { exact: true })
      .fill(`  ${TEST_ADMIN_PASSWORD} `);
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/admin\/leads/);
  });

  test("a wrong password is refused and issues no session", async ({
    request,
  }, testInfo) => {
    const response = await request.post("/api/admin/login", {
      headers: {
        "x-forwarded-for": bucketIp(testInfo.titlePath, testInfo.project.name),
      },
      form: { password: "not-the-password" },
      maxRedirects: 0,
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(303);
    expect(response.headers()["location"]).toContain("error=invalid");
    expect(response.headers()["set-cookie"] ?? "").not.toContain("axis_admin=");
  });

  test("signing out ends the session", async ({ page }) => {
    await signIn(page);

    await page.getByRole("button", { name: /sign out/i }).click();
    await page.waitForURL(/\/admin\/login/);

    // The session must really be gone, not just navigated away from.
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("admin chrome", () => {
  /**
   * Admin pages had the marketing header stacked above the admin bar: two
   * headers, a public nav and a "Book a free assessment" CTA on a staff-only
   * page. The chrome now lives in the (marketing) route group, since a nested
   * layout cannot remove a parent's.
   */
  for (const path of ["/admin/login", "/admin/leads"]) {
    test(`${path} carries no marketing chrome`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator("header")).toHaveCount(0);
      await expect(page.locator('nav[aria-label="Main"]')).toHaveCount(0);
      await expect(page.locator("footer")).toHaveCount(0);
      await expect(page.locator(".mobile-cta")).toHaveCount(0);
      // Exactly one main landmark, so the skip link still has a target.
      await expect(page.locator("#main")).toHaveCount(1);
    });
  }

  test("the public site keeps its chrome", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Main"]')).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("#main")).toHaveCount(1);
  });

  test("the 404 keeps its chrome", async ({ page }) => {
    // It renders in the root layout, outside the marketing group, so it has to
    // bring the header and footer itself.
    await page.goto("/no-such-page-anywhere");
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("#main")).toHaveCount(1);
  });
});

test.describe("admin dashboard", () => {
  test("renders its controls and an honest empty state", async ({ page }) => {
    await signIn(page);

    await expect(
      page.getByPlaceholder(/search name, email or phone/i),
    ).toBeVisible();
    await expect(page.getByLabel("Destination")).toBeVisible();
    await expect(page.getByLabel("Intake")).toBeVisible();

    // With no DATABASE_URL in the test environment it must say so plainly
    // rather than implying there are simply no leads.
    await expect(
      page.getByRole("heading", { name: /database not connected|no leads/i }),
    ).toBeVisible();
  });

  test("the CSV export is reachable once signed in", async ({ page }) => {
    await signIn(page);

    const response = await page.request.get("/api/admin/leads.csv");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/csv");
    // Header row is always present, even with no rows.
    expect(await response.text()).toContain("Name");
  });

  test("filters survive as shareable URLs", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/leads?country=UK&q=ayesha");

    await expect(page.getByPlaceholder(/search name/i)).toHaveValue("ayesha");
    await expect(page.getByLabel("Destination")).toHaveValue("UK");
  });
});

test.describe("admin access control", () => {
  test("/admin/leads redirects when unauthenticated", async ({ page }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the CSV export 404s for anonymous callers", async ({ request }) => {
    const response = await request.get("/api/admin/leads.csv", {
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(404);
  });

  test("a forged session cookie is rejected", async ({ context, page }) => {
    await context.addCookies([
      {
        name: "axis_admin",
        // Plausible shape, wrong signature.
        value: `${Date.now() + 60_000}.abcdefghijkl.not-a-valid-hmac`,
        domain: "127.0.0.1",
        path: "/",
      },
    ]);

    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin pages are noindex", async ({ page }) => {
    await page.goto("/admin/login");
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robots).toContain("noindex");
  });

  test("admin is not in the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("/admin");
  });
});

test.describe("admin fails closed when unconfigured", () => {
  // Second server, started without ADMIN_PASSWORD or ADMIN_SESSION_SECRET.
  test("the login form refuses generically and stays disabled", async ({
    page,
  }) => {
    await page.goto(`${UNCONFIGURED_BASE}/admin/login`);

    await expect(page.getByText(/sign-in is unavailable/i)).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeDisabled();
    await expect(
      page.getByRole("button", { name: /^sign in$/i }),
    ).toBeDisabled();

    // It must not disclose which variables are missing — this page is public.
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("ADMIN_PASSWORD");
    expect(body).not.toContain("ADMIN_SESSION_SECRET");
  });

  test("no password can get in", async ({ request }, testInfo) => {
    const response = await request.post(
      `${UNCONFIGURED_BASE}/api/admin/login`,
      {
        headers: {
          "x-forwarded-for": bucketIp(
            testInfo.titlePath,
            testInfo.project.name,
          ),
        },
        form: { password: TEST_ADMIN_PASSWORD },
        maxRedirects: 0,
        failOnStatusCode: false,
      },
    );

    expect(response.status()).toBe(303);
    expect(response.headers()["location"]).toContain("error=unconfigured");
    expect(response.headers()["set-cookie"] ?? "").not.toContain("axis_admin=");
  });
});
