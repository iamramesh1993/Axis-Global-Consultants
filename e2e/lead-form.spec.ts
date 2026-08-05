import { test, expect, type Page } from "@playwright/test";

const VALID = {
  fullName: "Ayesha Khan",
  email: "ayesha@example.com",
  phone: "0313 5155868",
  qualification: "FSc / A-Level / Intermediate",
  targetCountry: "UK",
  intake: "September 2027",
};

async function fillValidForm(page: Page) {
  await page.getByLabel("Full name").fill(VALID.fullName);
  await page.getByLabel("Email", { exact: true }).fill(VALID.email);
  await page.getByLabel("Phone / WhatsApp").fill(VALID.phone);
  await page
    .getByLabel("Highest qualification")
    .selectOption(VALID.qualification);
  await page
    .getByLabel("Where do you want to study?")
    .selectOption(VALID.targetCountry);
  await page.getByLabel("Intended intake").selectOption(VALID.intake);
  await page.getByRole("checkbox").check();
}

test.describe("lead form — client behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("blocks submission and shows field errors when empty", async ({
    page,
  }) => {
    let apiCalled = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/leads")) apiCalled = true;
    });

    await page
      .getByRole("button", { name: /book my free assessment/i })
      .click();

    await expect(page.getByText("Please enter your full name")).toBeVisible();
    await expect(page.getByText("Please enter your email")).toBeVisible();
    await expect(
      page.getByText("We need your consent to get in touch"),
    ).toBeVisible();

    expect(apiCalled, "must not hit the API with an invalid form").toBe(false);
  });

  test("rejects a non-Pakistani phone number", async ({ page }) => {
    await page.getByLabel("Phone / WhatsApp").fill("+1 415 555 0100");
    await page.getByLabel("Email", { exact: true }).click(); // trigger blur
    await expect(page.getByText(/Enter a Pakistani mobile/i)).toBeVisible();
  });

  test("rejects a malformed email", async ({ page }) => {
    await page.getByLabel("Email", { exact: true }).fill("not-an-email");
    await page.getByLabel("Full name").click();
    await expect(page.getByText(/doesn't look right/i)).toBeVisible();
  });

  test("accepts several real Pakistani phone formats", async ({ page }) => {
    for (const phone of [
      "03135155868",
      "0313-515-5868",
      "+92 313 5155868",
      "923135155868",
    ]) {
      await page.getByLabel("Phone / WhatsApp").fill(phone);
      await page.getByLabel("Full name").click();
      await expect(page.getByText(/Enter a Pakistani mobile/i)).toBeHidden();
    }
  });

  test("shows the warm confirmation state on success", async ({ page }) => {
    // Stub the endpoint so the UI path is tested without a database.
    await page.route("**/api/leads", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, stored: true }),
      });
    });

    await fillValidForm(page);
    await page
      .getByRole("button", { name: /book my free assessment/i })
      .click();

    // Scoped to the success panel — the surrounding page copy repeats some of
    // the same promises, so a page-wide text match would pass spuriously.
    const success = page.getByTestId("lead-success");
    await expect(success).toBeVisible();
    await expect(
      success.getByRole("heading", { name: /we'll be in touch/i }),
    ).toBeVisible();
    await expect(success).toContainText(/not an autoresponder/i);
    // The success state must offer a next step, not be a dead end.
    await expect(
      success.getByRole("link", { name: /message us now instead/i }),
    ).toBeVisible();
    // The form itself must be gone, so nobody submits twice.
    await expect(page.getByLabel("Full name")).toBeHidden();
  });

  test("surfaces a recovery route when the server fails", async ({ page }) => {
    await page.route("**/api/leads", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: "delivery_failed",
          message:
            "We couldn't submit that. Please WhatsApp us on +92 313 5155868 and we'll pick it up straight away.",
        }),
      });
    });

    await fillValidForm(page);
    await page
      .getByRole("button", { name: /book my free assessment/i })
      .click();

    const alert = page.getByRole("alert").filter({ hasText: /WhatsApp us/i });
    await expect(alert).toBeVisible();
    // The form must still be there so nothing the student typed is lost.
    await expect(page.getByLabel("Full name")).toHaveValue(VALID.fullName);
  });

  test("submits the source field for attribution", async ({ page }) => {
    let body: Record<string, unknown> | null = null;
    await page.route("**/api/leads", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, stored: true }),
      });
    });

    await page.goto("/contact?utm_source=meta&utm_campaign=uk-sep");
    await fillValidForm(page);
    await page
      .getByRole("button", { name: /book my free assessment/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /we'll be in touch/i }),
    ).toBeVisible();

    expect(body).not.toBeNull();
    expect(String(body!.source)).toContain("utm_source=meta");
    expect(String(body!.source)).toContain("utm_campaign=uk-sep");
  });

  test("destination pages preselect their own country", async ({ page }) => {
    await page.goto("/study/canada");
    await expect(page.getByLabel("Where do you want to study?")).toHaveValue(
      "Canada",
    );
  });
});

test.describe("lead API — server behaviour", () => {
  /**
   * The endpoint rate-limits by client IP. Tests run in parallel from the same
   * loopback address, so each one presents its own x-forwarded-for — which also
   * exercises the header parsing the limiter depends on.
   */
  let ipCounter = 0;
  // The limiter's memory is shared across browser projects (one server), so the
  // project name has to be part of the key or the second project starts rate-limited.
  const octet = (name: string) =>
    (name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 200) + 1;

  const freshIp = (projectName: string) => ({
    "x-forwarded-for": `203.0.${octet(projectName)}.${(++ipCounter % 250) + 1}, 10.0.0.1`,
  });

  test("rejects GET with 405", async ({ request }) => {
    const response = await request.get("/api/leads");
    expect(response.status()).toBe(405);
    expect(response.headers()["allow"]).toBe("POST");
  });

  test("rejects an invalid payload with 422 and field errors", async ({
    request,
  }, testInfo) => {
    const response = await request.post("/api/leads", {
      headers: freshIp(testInfo.project.name),
      data: { fullName: "A", email: "nope", phone: "123", consent: false },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors).toBeTruthy();
    expect(Object.keys(body.fieldErrors).length).toBeGreaterThan(0);
  });

  test("rejects genuinely malformed JSON with 400", async ({
    request,
  }, testInfo) => {
    // Raw bytes, not `data:` — Playwright would JSON-encode a string and the
    // body would arrive as valid JSON, which is a different code path.
    const response = await request.post("/api/leads", {
      headers: {
        "Content-Type": "application/json",
        ...freshIp(testInfo.project.name),
      },
      data: Buffer.from("{not json", "utf8"),
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe("invalid_json");
  });

  test("silently accepts and discards honeypot submissions", async ({
    request,
  }, testInfo) => {
    const response = await request.post("/api/leads", {
      headers: freshIp(testInfo.project.name),
      data: {
        ...VALID,
        message: "buy cheap watches",
        consent: true,
        website: "http://spam.example.com",
      },
    });
    // 200 so a bot cannot tell it was caught, but nothing is stored.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.stored).toBe(false);
  });

  test("rejects an oversized message", async ({ request }, testInfo) => {
    const response = await request.post("/api/leads", {
      headers: freshIp(testInfo.project.name),
      data: { ...VALID, consent: true, message: "x".repeat(5000) },
    });
    expect(response.status()).toBe(422);
  });

  test("rate-limits a flood from one IP", async ({ request }, testInfo) => {
    const headers = {
      "x-forwarded-for": `198.51.100.${octet(testInfo.project.name)}`,
    };
    const statuses: number[] = [];

    // Limit is 5 per 10 minutes; the 6th must be turned away.
    for (let i = 0; i < 7; i++) {
      const response = await request.post("/api/leads", {
        headers,
        data: { fullName: "A", email: "nope", phone: "1", consent: false },
      });
      statuses.push(response.status());
    }

    expect(statuses.slice(0, 5).every((s) => s === 422)).toBe(true);
    expect(statuses).toContain(429);
  });
});
