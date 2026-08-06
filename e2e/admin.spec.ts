import { test, expect } from "@playwright/test";

/**
 * The admin dashboard is not configured in CI (no ADMIN_PASSWORD), which is the
 * important case to pin down: an unconfigured deployment must lock everyone out
 * rather than let everyone in.
 */
test.describe("admin access control", () => {
  test("/admin/leads redirects to the login page when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /leads dashboard/i,
    );
  });

  test("login page states it is unconfigured and disables the form", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await expect(page.getByText(/not configured yet/i)).toBeVisible();
    await expect(page.getByLabel("Password")).toBeDisabled();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  test("a guessed password cannot get in while unconfigured", async ({
    request,
  }) => {
    const response = await request.post("/api/admin/login", {
      form: { password: "" },
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(303);
    expect(response.headers()["location"]).toContain("error=unconfigured");
    // No session cookie may be issued.
    expect(response.headers()["set-cookie"] ?? "").not.toContain("axis_admin=");
  });

  test("the CSV export 404s for anonymous callers", async ({ request }) => {
    const response = await request.get("/api/admin/leads.csv", {
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(404);
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
