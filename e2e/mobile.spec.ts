import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "./routes";

/** Only meaningful on the touch/small-viewport projects. */
const isMobileProject = (name: string) =>
  name === "iphone" || name === "android";

test.describe("mobile layout", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      !isMobileProject(testInfo.project.name),
      "mobile-only assertions",
    );
  });

  for (const route of PAGE_ROUTES) {
    test(`${route} never scrolls horizontally`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
        };
      });

      // 1px of tolerance for sub-pixel rounding.
      expect(
        overflow.scrollWidth,
        `${route} overflows by ${overflow.scrollWidth - overflow.clientWidth}px`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }

  test("hamburger opens and closes the nav drawer", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();

    // Scoped to the drawer's own nav landmark — the same link text also appears
    // in the desktop nav and the footer.
    const drawer = page.getByRole("navigation", { name: "Mobile" });
    const drawerLink = drawer.getByRole("link", { name: "Study in Canada" });
    await expect(drawerLink).toBeHidden();

    await toggle.click();
    await expect(drawerLink).toBeVisible();

    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(drawerLink).toBeHidden();
  });

  test("drawer navigation works and closes itself", async ({ page }) => {
    await page.goto("/");
    const drawer = page.getByRole("navigation", { name: "Mobile" });

    await page.getByRole("button", { name: /open menu/i }).click();
    await drawer.getByRole("link", { name: "Study in Canada" }).click();

    await expect(page).toHaveURL(/\/study\/canada$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Canada/i,
    );
    // Route change must dismiss the drawer, not leave it covering the page.
    await expect(
      drawer.getByRole("link", { name: "Study in Australia" }),
    ).toBeHidden();
  });

  test("open drawer hides the sticky CTA instead of stacking two", async ({
    page,
  }) => {
    await page.goto("/");

    // Scroll far enough that the sticky bar is showing.
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(500);

    const stickyBar = page.locator(".mobile-cta");
    await expect(stickyBar).toBeVisible();

    await page.getByRole("button", { name: /open menu/i }).click();
    await page.waitForTimeout(300);

    // Otherwise the user sees "Book a free assessment" twice, once behind the
    // drawer — which is exactly what it looked like on a real phone.
    await expect(stickyBar).toBeHidden();

    await page.getByRole("button", { name: /close menu/i }).click();
    await page.waitForTimeout(400);
    await expect(stickyBar).toBeVisible();
  });

  test("drawer scrolls rather than running off the screen", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toBeVisible();

    const box = await drawer.boundingBox();
    const viewport = page.viewportSize()!;
    // The drawer must never extend past the bottom of the viewport.
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);

    // And its own content must be reachable by scrolling inside it.
    const scrollable = await drawer.evaluate(
      (el) => el.scrollHeight > el.clientHeight,
    );
    expect(scrollable).toBe(true);
  });

  test("drawer ends with contact, socials and legal links", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();

    const drawer = page.locator("#mobile-nav");

    await expect(
      drawer.getByRole("link", { name: /whatsapp \+92/i }),
    ).toBeVisible();
    await expect(
      drawer.getByRole("link", { name: /^call us$/i }),
    ).toBeVisible();
    await expect(
      drawer.getByRole("link", { name: /hello@axisglobalpk\.com/i }),
    ).toBeVisible();

    // Live accounts are links; the others are present but labelled, not linked.
    for (const label of ["Instagram", "TikTok", "Facebook"]) {
      await expect(drawer.getByRole("link", { name: label })).toBeVisible();
    }
    for (const label of ["LinkedIn"]) {
      await expect(drawer.getByRole("link", { name: label })).toHaveCount(0);
      await expect(drawer.getByLabel(`${label} — coming soon`)).toBeVisible();
    }

    for (const label of ["FAQs", "Privacy", "Terms"]) {
      await expect(drawer.getByRole("link", { name: label })).toBeVisible();
    }
  });
  test("sticky CTA appears after scrolling and is tappable", async ({
    page,
  }) => {
    await page.goto("/");

    const cta = page
      .getByRole("link", { name: /book a free assessment/i })
      .last();

    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(500);

    await expect(cta).toBeVisible();

    // Apple and Google both call for a ~44px minimum touch target.
    const box = await cta.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("sticky CTA stands down over the assessment form", async ({ page }) => {
    await page.goto("/");

    const stickyBar = page.locator(".mobile-cta");
    const submit = page.getByRole("button", {
      name: /book my free assessment/i,
    });

    // Mid-page: the bar should be up.
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(500);
    await expect(stickyBar).toBeVisible();

    // At the form: it must get out of the way of the submit button.
    // The bar slides off with translate-y-full rather than display:none, so
    // assert its position — toBeHidden() does not treat a transform as hidden.
    await submit.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    const viewportHeight = page.viewportSize()!.height;
    const barBox = await stickyBar.boundingBox();
    expect(barBox).not.toBeNull();
    expect(
      barBox!.y,
      "sticky bar is still overlapping the viewport",
    ).toBeGreaterThanOrEqual(viewportHeight - 1);

    // And the submit button must be genuinely reachable, not under the bar.
    const box = await submit.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight);
  });

  test("sticky CTA is suppressed on the contact page", async ({ page }) => {
    await page.goto("/contact");
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(400);

    // The form is already the whole page — a bar covering it would be noise.
    const bars = page.locator("div.fixed.inset-x-0.bottom-0");
    await expect(bars).toHaveCount(0);
  });

  test("form inputs are 16px+ so iOS does not zoom on focus", async ({
    page,
  }) => {
    await page.goto("/contact");

    for (const label of ["Full name", "Email", "Phone / WhatsApp"]) {
      const size = await page
        .getByLabel(label, { exact: true })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(size, `${label} is below 16px`).toBeGreaterThanOrEqual(16);
    }
  });

  test("primary tap targets meet the 44px minimum", async ({ page }) => {
    await page.goto("/contact");

    const submit = page.getByRole("button", {
      name: /book my free assessment/i,
    });
    const box = await submit.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("accessibility basics", () => {
  for (const route of PAGE_ROUTES) {
    test(`${route} has labelled controls and described images`, async ({
      page,
    }) => {
      await page.goto(route);

      // Every img needs alt text (empty alt is fine for decorative).
      const imagesMissingAlt = await page.locator("img:not([alt])").count();
      expect(imagesMissingAlt, `${route} has images without alt`).toBe(0);

      // Every interactive control needs an accessible name.
      const unnamed = await page
        .locator("button, a, input:not([type=hidden]), select, textarea")
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              const style = getComputedStyle(el);
              if (style.display === "none" || style.visibility === "hidden") {
                return false;
              }
              const label =
                el.getAttribute("aria-label") ??
                el.getAttribute("aria-labelledby") ??
                el.getAttribute("title") ??
                (el as HTMLElement).innerText?.trim();
              if (label) return false;
              // Named by an explicit <label for>.
              if (el.id && document.querySelector(`label[for="${el.id}"]`)) {
                return false;
              }
              // Named implicitly by being nested inside a <label>.
              if (el.closest("label")) return false;
              // A control inside an aria-hidden subtree isn't exposed at all.
              if (el.closest("[aria-hidden='true']")) return false;
              return true;
            })
            .map((el) => `${el.tagName}#${el.id || "(no id)"}`),
        );

      expect(unnamed, `${route} has unnamed controls`).toEqual([]);
    });
  }

  test("skip link is the first focusable element", async ({
    page,
  }, testInfo) => {
    test.skip(
      isMobileProject(testInfo.project.name),
      "keyboard nav is desktop",
    );

    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/skip to content/i);
  });

  test("respects prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Reveal wrappers must render content immediately, fully opaque.
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    const opacity = await heading.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(Number(opacity)).toBe(1);
  });
});
