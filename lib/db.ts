import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

/**
 * Lazily constructed so the marketing pages build and render without a database.
 * Only /api/leads touches this, and it degrades gracefully if DATABASE_URL is unset.
 */
let cached: ReturnType<typeof buildDb> | null = null;

function buildDb(url: string) {
  return drizzle(neon(url), { schema });
}

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!cached) cached = buildDb(url);
  return cached;
}

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL);
