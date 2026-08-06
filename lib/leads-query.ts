import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, type Lead } from "@/db/schema";
import { INTAKES, TARGET_COUNTRIES } from "@/lib/validation";

export type LeadFilters = {
  country?: string;
  intake?: string;
  /** Matches name, email or phone. */
  q?: string;
  limit?: number;
  offset?: number;
};

export type LeadsResult = {
  rows: Lead[];
  total: number;
  /** Distinct values present in the data, for populating the filter dropdowns. */
  countries: string[];
  intakes: string[];
  configured: boolean;
};

/**
 * Filter options come from the canonical lists the form can produce, unioned
 * with whatever is actually in the table.
 *
 * Deriving them from the data alone looked reasonable and was wrong twice over:
 * a fresh deployment showed empty dropdowns, and a shared filter URL silently
 * reset its control when no lead currently matched — so the URL said "UK" while
 * the select said "All destinations" and the rows were filtered anyway. The
 * union also keeps any legacy value that is no longer offered by the form.
 */
function optionsFor(canonical: readonly string[], found: string[]): string[] {
  const seen = new Set<string>(canonical);
  const extras = found.filter((value) => value && !seen.has(value)).sort();
  return [...canonical, ...extras];
}

const EMPTY: LeadsResult = {
  rows: [],
  total: 0,
  countries: [...TARGET_COUNTRIES],
  intakes: [...INTAKES],
  configured: false,
};

function buildWhere(filters: LeadFilters): SQL | undefined {
  const clauses: SQL[] = [];

  if (filters.country) clauses.push(eq(leads.targetCountry, filters.country));
  if (filters.intake) clauses.push(eq(leads.intake, filters.intake));

  if (filters.q) {
    const term = `%${filters.q}%`;
    const search = or(
      ilike(leads.fullName, term),
      ilike(leads.email, term),
      ilike(leads.phone, term),
    );
    if (search) clauses.push(search);
  }

  if (clauses.length === 0) return undefined;
  return and(...clauses);
}

export async function getLeads(
  filters: LeadFilters = {},
): Promise<LeadsResult> {
  const db = getDb();
  if (!db) return EMPTY;

  const limit = Math.min(Math.max(filters.limit ?? 100, 1), 500);
  const offset = Math.max(filters.offset ?? 0, 0);
  const where = buildWhere(filters);

  const [rows, totalRows, countryRows, intakeRows] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(where),
    // Filter options come from the whole table, not the filtered set — otherwise
    // selecting a country would remove every other country from the dropdown.
    db
      .selectDistinct({ value: leads.targetCountry })
      .from(leads)
      .orderBy(leads.targetCountry),
    db
      .selectDistinct({ value: leads.intake })
      .from(leads)
      .orderBy(leads.intake),
  ]);

  return {
    rows,
    total: totalRows[0]?.count ?? 0,
    countries: optionsFor(
      TARGET_COUNTRIES,
      countryRows.map((r) => r.value),
    ),
    intakes: optionsFor(
      INTAKES,
      intakeRows.map((r) => r.value),
    ),
    configured: true,
  };
}

/** Every matching row, for CSV export — no pagination. */
export async function getAllLeadsForExport(
  filters: LeadFilters = {},
): Promise<Lead[]> {
  const db = getDb();
  if (!db) return [];

  return db
    .select()
    .from(leads)
    .where(buildWhere(filters))
    .orderBy(desc(leads.createdAt));
}

/**
 * RFC 4180 CSV. Values are quoted and inner quotes doubled.
 *
 * The leading apostrophe guard on =, +, -, @ matters: Excel and Sheets treat a
 * cell starting with those as a formula, so a lead who types `=cmd|...` into the
 * message box becomes a CSV injection against whoever opens the export.
 */
export function leadsToCsv(rows: Lead[]): string {
  const headers = [
    "Created",
    "Name",
    "Email",
    "Phone",
    "Qualification",
    "Destination",
    "Intake",
    "Budget",
    "Message",
    "Source",
    "Consent",
    "ID",
  ];

  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const lines = [headers.map(escape).join(",")];

  for (const row of rows) {
    lines.push(
      [
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : String(row.createdAt),
        row.fullName,
        row.email,
        row.phone,
        row.qualification,
        row.targetCountry,
        row.intake,
        row.budgetRange ?? "",
        row.message ?? "",
        row.source ?? "",
        row.consent ? "yes" : "no",
        row.id,
      ]
        .map(escape)
        .join(","),
    );
  }

  // Excel needs the BOM to read UTF-8 correctly.
  return `﻿${lines.join("\r\n")}\r\n`;
}
