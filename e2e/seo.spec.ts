import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "./routes";

test.describe("metadata", () => {
  for (const route of PAGE_ROUTES) {
    test(`${route} has canonical, description and OG image`, async ({
      page,
    }) => {
      await page.goto(route);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical, `${route} needs a canonical`).toBeTruthy();
      // Canonical must point at this route, not at the home page.
      const expected = route === "/" ? "" : route;
      expect(canonical).toMatch(new RegExp(`${expected}$`));

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
      expect(description?.length ?? 0).toBeLessThanOrEqual(200);

      const ogImage = await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute("content");
      expect(ogImage, `${route} needs an og:image`).toContain("/api/og");
    });
  }
});

test("the OG image endpoint returns a real PNG", async ({ request }) => {
  const response = await request.get("/api/og?title=Test&subtitle=Subtitle");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  const body = await response.body();
  expect(body.length).toBeGreaterThan(5000);
});

test("pre-launch indexing guard is active", async ({ page, request }) => {
  // While SITE_INDEXABLE is unset, nothing should invite a crawler in.
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");

  await page.goto("/");
  const meta = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  expect(meta).toContain("noindex");
});

test("sitemap lists every page route", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();
  for (const route of PAGE_ROUTES) {
    const expected = route === "/" ? "/</loc>" : `${route}</loc>`;
    expect(xml, `sitemap missing ${route}`).toContain(expected);
  }
});

test("llms.txt exists for answer engines", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
});

test.describe("structured data", () => {
  test("home page carries valid Organization and WebSite JSON-LD", async ({
    page,
  }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(2);

    const parsed = blocks.map((block) => JSON.parse(block));
    const types = parsed.map((item) => item["@type"]);
    expect(types).toContain("EducationalOrganization");
    expect(types).toContain("WebSite");
  });

  test("country pages carry FAQPage and BreadcrumbList", async ({ page }) => {
    await page.goto("/study/uk");
    const parsed = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((block) => JSON.parse(block));

    const types = parsed.map((item) => item["@type"]);
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");

    const faq = parsed.find((item) => item["@type"] === "FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThan(2);
    // Answers must be real prose, not stubs — this is what answer engines quote.
    for (const entity of faq.mainEntity) {
      expect(entity.acceptedAnswer.text.length).toBeGreaterThan(80);
    }
  });

  test("guide pages carry Article JSON-LD with dates", async ({ page }) => {
    await page.goto("/guides/uk-graduate-route-deadline-2027");
    const parsed = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((block) => JSON.parse(block));

    const article = parsed.find((item) => item["@type"] === "Article");
    expect(article).toBeTruthy();
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.headline.length).toBeGreaterThan(10);
  });
});

test("security headers are present", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("geolocation=()");
  // Next's version banner should not be advertised.
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("no analytics requests fire without env vars", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (
      url.includes("google-analytics") ||
      url.includes("googletagmanager") ||
      url.includes("facebook.net")
    ) {
      thirdParty.push(url);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  expect(thirdParty, "tracking must stay off until IDs are configured").toEqual(
    [],
  );
});
