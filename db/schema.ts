import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    qualification: text("qualification").notNull(),
    targetCountry: text("target_country").notNull(),
    intake: text("intake").notNull(),
    budgetRange: text("budget_range"),
    message: text("message"),
    consent: boolean("consent").notNull().default(false),
    /** UTM string or referrer, for attribution once Meta ads are running. */
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_email_idx").on(table.email),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
