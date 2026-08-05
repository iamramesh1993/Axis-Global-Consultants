import { z } from "zod";

/** Options are shared by the form UI and the server validator so they can't drift. */
export const TARGET_COUNTRIES = [
  "UK",
  "Canada",
  "Australia",
  "Uzbekistan",
  "Undecided",
] as const;

export const QUALIFICATIONS = [
  "Matric / O-Level",
  "FSc / A-Level / Intermediate",
  "Bachelor's (2 year)",
  "Bachelor's (4 year) / BS",
  "Master's",
  "Other",
] as const;

export const INTAKES = [
  "January 2027",
  "February 2027",
  "May 2027",
  "July 2027",
  "September 2027",
  "January 2028",
  "Later / not sure",
] as const;

export const BUDGET_RANGES = [
  "Under PKR 3 million / year",
  "PKR 3–5 million / year",
  "PKR 5–8 million / year",
  "PKR 8 million+ / year",
  "Not sure yet",
] as const;

/**
 * Pakistani mobile numbers. Accepts the shapes people actually type:
 * 03135155868, 0313-515-5868, +92 313 5155868, 92 3135155868.
 */
const PK_PHONE = /^(?:\+?92|0)?3\d{9}$/;

export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "That name is too long")
    // Reject obvious junk without being precious about real-world names.
    .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u, "Please use letters only"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email")
    .max(200)
    .email("That email doesn't look right"),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number")
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine(
      (v) => PK_PHONE.test(v),
      "Enter a Pakistani mobile, e.g. 0313 5155868",
    ),

  qualification: z.enum(QUALIFICATIONS, {
    message: "Please select your highest qualification",
  }),

  targetCountry: z.enum(TARGET_COUNTRIES, {
    message: "Please select a destination",
  }),

  intake: z.enum(INTAKES, { message: "Please select an intake" }),

  budgetRange: z.enum(BUDGET_RANGES).optional().or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(2000, "Please keep this under 2000 characters")
    .optional(),

  consent: z.literal(true, {
    message: "We need your consent to get in touch",
  }),

  /**
   * Honeypot — must stay empty. Bots fill every field they find.
   *
   * Deliberately permissive rather than `.max(0)`: if the schema rejected a
   * filled honeypot, the request would fail validation with a 422 and the bot
   * would learn which field tripped it. Accept the value here, then discard the
   * submission in the route with a 200 so it looks like a success.
   */
  website: z.string().max(500).optional(),

  /** Captured client-side from the URL, never trusted for anything but attribution. */
  source: z.string().max(500).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadParsed = z.output<typeof leadSchema>;
