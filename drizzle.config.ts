import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js reads .env.local, plain dotenv does not — load it explicitly so
// db:studio and db:migrate work with the same vars the app uses.
config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

/**
 * Prefer the unpooled connection for schema work. Migrations and Studio open
 * long-lived sessions, which the pooled endpoint handles poorly.
 */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "No DATABASE_URL found. Run `vercel env pull .env.local` or set it manually.",
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
