import { test, expect } from "@playwright/test";

/**
 * Desktop layout invariants. Run once, not per device project — these are about
 * grid geometry, not touch behaviour.
 */
test.describe("desktop layout", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chrome",
      "geometry checks run once",
    );
  });

  /**
   * 1024 is the narrowest width at which the destination grid is four columns,
   * so it is where text is most likely to wrap to an extra line and knock the
   * meta rows out of alignment. 1440 is the common desktop case.
   */
  for (const width of [1024, 1280, 1440]) {
    test(`destination cards align at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page
        .locator("#destinations")
        .scrollIntoViewIfNeeded()
        .catch(() => {});
      // Let the scroll reveal settle so nothing is measured mid-transition.
      await page.waitForTimeout(900);

      const geometry = await page.evaluate(() => {
        const cards = [...document.querySelectorAll("#destinations a")];
        return cards.map((card) => {
          const labels = [...card.querySelectorAll("dt")];
          return {
            code: card.querySelector("h3")?.textContent ?? "?",
            height: Math.round(card.getBoundingClientRect().height),
            tuitionTop: Math.round(labels[0]!.getBoundingClientRect().top),
            intakesTop: Math.round(labels[1]!.getBoundingClientRect().top),
          };
        });
      });

      expect(geometry.length).toBe(4);

      const distinct = <K extends keyof (typeof geometry)[number]>(key: K) => [
        ...new Set(geometry.map((row) => row[key])),
      ];

      // Equal height, and both meta rows on a single shared baseline.
      expect(distinct("height"), "card heights differ").toHaveLength(1);
      expect(
        distinct("tuitionTop"),
        `Tuition labels are not on one baseline: ${JSON.stringify(geometry)}`,
      ).toHaveLength(1);
      expect(
        distinct("intakesTop"),
        `Intakes labels are not on one baseline: ${JSON.stringify(geometry)}`,
      ).toHaveLength(1);
    });
  }

  // One test per width: three navigations in a single test exceeded the default
  // 30s budget and reported as a timeout rather than a layout failure.
  for (const width of [1024, 1440, 1920]) {
    test(`hero graphic stays inside the viewport at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(
        overflow.scrollWidth,
        `page overflows horizontally at ${width}px by ${
          overflow.scrollWidth - overflow.clientWidth
        }px`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }
});
