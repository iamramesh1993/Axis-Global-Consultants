import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

/** Second server, deliberately left without admin credentials. */
const UNCONFIGURED_PORT = 3101;
export const UNCONFIGURED_BASE = `http://127.0.0.1:${UNCONFIGURED_PORT}`;

/**
 * Admin credentials for the configured server.
 *
 * Test-only values, and the whole point of having them: without a password in
 * the environment the suite could only ever prove that nobody gets in. The
 * successful sign-in, the dashboard, and sign-out were untested until this
 * existed — a real gap, found the hard way when a live password would not work
 * and there was no test covering that path.
 */
export const TEST_ADMIN_PASSWORD = "playwright-admin-pw-9f2c41";
const TEST_ADMIN_SECRET = "playwright-session-secret-3b81de77c4a9";

/**
 * Tests run against a real production build, not the dev server — dev-only
 * warnings and unoptimised bundles would make the console-error and
 * static-rendering assertions meaningless.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone", use: { ...devices["iPhone 14"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
  ],

  /**
   * Two servers off one build:
   *   3100 — admin configured, so the sign-in happy path is testable
   *   3101 — admin unconfigured, so fail-closed stays proven
   * Only the first runs `pnpm build`; the second reuses the output.
   */
  webServer: [
    {
      command: `pnpm build && pnpm start --port ${PORT}`,
      url: baseURL,
      // Never reuse: a server already listening on this port was started without
      // these credentials, and reusing it silently made the sign-in tests fail
      // while the application itself was fine. The build runs anyway, so reuse
      // was buying almost nothing.
      reuseExistingServer: false,
      timeout: 240_000,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ADMIN_PASSWORD: TEST_ADMIN_PASSWORD,
        ADMIN_SESSION_SECRET: TEST_ADMIN_SECRET,
      },
    },
    {
      command: `pnpm start --port ${UNCONFIGURED_PORT}`,
      url: UNCONFIGURED_BASE,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ADMIN_PASSWORD: "",
        ADMIN_SESSION_SECRET: "",
      },
    },
  ],
});
