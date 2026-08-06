import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "./routes";

/**
 * The site is live. Nothing a student reads should sound like a note we left
 * ourselves, and nothing under /public should be an internal document.
 *
 * These are deliberately worded as a blocklist rather than a review checklist,
 * because "we'll remember to take that out before launch" is exactly what did
 * not happen last time.
 */

/** Phrases that mean the page is talking to us, not to a student. */
const INTERNAL_PHRASES = [
  "placeholder",
  "pending legal review",
  "to be confirmed",
  "before launch",
  "next release",
  "until it ships",
  "coming soon",
  "lorem ipsum",
  "TODO",
  "FIXME",
  "TBD",
  "dummy",
  "sample data",
  "replace this",
  "not yet implemented",
  // Configuration language — a student has no idea what these mean.
  "env var",
  "environment variable",
  "corresponding configuration",
  "if analytics is enabled",
  "DATABASE_URL",
  "API key",
  "localhost",
  "vercel.app",
];

test.describe("no internal language on public pages", () => {
  for (const route of PAGE_ROUTES) {
    test(`${route} reads as finished`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const text = (await page.locator("body").innerText()).toLowerCase();

      const found = INTERNAL_PHRASES.filter((phrase) =>
        text.includes(phrase.toLowerCase()),
      );

      expect(
        found,
        `${route} contains operator-facing text: ${found.join(", ")}`,
      ).toEqual([]);
    });
  }
});

test.describe("nothing internal is exposed", () => {
  test("no internal docs are served from /public", async ({ request }) => {
    // docs/photo-credits.md used to live at this path and was world-readable.
    const paths = [
      "/destinations/CREDITS.md",
      "/destinations/credits.md",
      "/README.md",
      "/docs/photo-credits.md",
      "/.env",
      "/.env.local",
      "/.env.example",
      "/package.json",
      "/pnpm-lock.yaml",
      "/drizzle.config.ts",
      "/db/schema.ts",
    ];

    const exposed: string[] = [];
    for (const path of paths) {
      const response = await request.get(path, { failOnStatusCode: false });
      if (response.status() === 200) exposed.push(path);
    }

    expect(exposed, "these should not be publicly readable").toEqual([]);
  });

  test("the login page does not name its configuration", async ({ page }) => {
    await page.goto("/admin/login");
    const text = await page.locator("body").innerText();
    expect(text).not.toContain("ADMIN_PASSWORD");
    expect(text).not.toContain("ADMIN_SESSION_SECRET");
  });

  test("no stack traces or framework errors are rendered", async ({ page }) => {
    for (const route of ["/", "/contact", "/study/uk"]) {
      await page.goto(route);
      const text = await page.locator("body").innerText();
      expect(text).not.toContain("Application error");
      expect(text).not.toContain("Unhandled Runtime Error");
      expect(text).not.toMatch(/at \w+ \(.*\.tsx?:\d+/);
    }
  });
});
