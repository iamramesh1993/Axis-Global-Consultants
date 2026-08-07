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

test.describe("social links", () => {
  /**
   * The footer shipped guessed handles (instagram.com/axisglobalpk and friends)
   * that did not exist. A dead social link costs more trust than an absent one,
   * so accounts that are not live now render muted and labelled instead.
   */
  test("only real profiles are linked, the rest are labelled", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.locator("footer");

    // Live: real, working URLs.
    await expect(
      footer.getByRole("link", { name: "Instagram" }),
    ).toHaveAttribute("href", "https://instagram.com/axisglobalpk.agp01");
    await expect(
      footer.getByRole("link", { name: "Facebook" }),
    ).toHaveAttribute("href", /facebook\.com\/profile\.php\?id=\d+/);

    await expect(footer.getByRole("link", { name: "TikTok" })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@axisglobalpk",
    );

    // Not live: present and explained, but not a link.
    await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveCount(0);
    await expect(footer.getByLabel("LinkedIn — coming soon")).toBeVisible();
  });

  test("no guessed handles survive anywhere", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    // These were the placeholders. The real Instagram handle ends .agp01, so a
    // bare instagram.com/axisglobalpk" would mean the guess came back.
    expect(html).not.toContain('instagram.com/axisglobalpk"');
    expect(html).not.toContain("linkedin.com/company/axisglobalpk");
  });

  test("structured data lists only live profiles", async ({ page }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const org = blocks
      .map((b) => JSON.parse(b))
      .find((d) => d["@type"] === "EducationalOrganization");

    expect(org.sameAs).toHaveLength(3);
    expect(org.sameAs.join(" ")).toContain("tiktok.com/@axisglobalpk");
    // Still not on LinkedIn, so it must not be advertised as a profile.
    expect(org.sameAs.join(" ")).not.toContain("linkedin");
    // The corrected city, not the old placeholder.
    expect(org.address.addressLocality).toBe("Islamabad");
  });

  test("the site no longer claims to be in Karachi", async ({ page }) => {
    for (const path of ["/", "/contact"]) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text).not.toContain("Karachi");
      expect(text).toContain("Islamabad");
    }
  });
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
