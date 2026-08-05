import { test, expect, type ConsoleMessage } from "@playwright/test";
import { PAGE_ROUTES, NON_PAGE_ROUTES, REDIRECTS } from "./routes";

test.describe("every page loads cleanly", () => {
  for (const route of PAGE_ROUTES) {
    test(`${route} renders with no console errors`, async ({ page }) => {
      const errors: string[] = [];
      const onConsole = (msg: ConsoleMessage) => {
        if (msg.type() === "error") errors.push(msg.text());
      };
      page.on("console", onConsole);
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

      const response = await page.goto(route, { waitUntil: "networkidle" });

      expect(response?.status(), `${route} should return 200`).toBe(200);

      // Exactly one h1 — matters for both SEO and screen-reader navigation.
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).not.toBeEmpty();

      // A real, page-specific title.
      const title = await page.title();
      expect(title.length, `${route} needs a title`).toBeGreaterThan(10);
      expect(title).not.toContain("Create Next App");

      expect(errors, `${route} logged console errors`).toEqual([]);
    });
  }
});

test.describe("non-page routes", () => {
  for (const route of NON_PAGE_ROUTES) {
    test(`${route} responds 200`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);
      expect((await response.text()).length).toBeGreaterThan(0);
    });
  }
});

test.describe("redirects", () => {
  for (const { from, to } of REDIRECTS) {
    test(`${from} → ${to}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, "\\/")}$`));
    });
  }
});

test("unknown routes render the custom 404, not a crash", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /doesn't exist/i,
  );
  // The 404 must still offer a way forward.
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});

test("no internal link on the site 404s", async ({ page, request }) => {
  const seen = new Set<string>();

  for (const route of PAGE_ROUTES) {
    await page.goto(route);
    const hrefs = await page
      .locator('a[href^="/"]:not([href^="//"])')
      .evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    for (const href of hrefs) {
      // Ignore in-page anchors; they can't 404.
      const path = href.split("#")[0];
      if (path) seen.add(path);
    }
  }

  const broken: string[] = [];
  for (const path of seen) {
    const response = await request.get(path, { maxRedirects: 5 });
    if (response.status() >= 400) broken.push(`${path} → ${response.status()}`);
  }

  expect(broken, "internal links that do not resolve").toEqual([]);
});
