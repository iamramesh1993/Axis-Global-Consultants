import { z } from "zod";

/**
 * Frontmatter contracts for /content. Validated at build time so a malformed
 * MDX file fails the build instead of shipping a broken page.
 */

/** A single hard number or rule, with its official source and check date. */
export const factSchema = z.object({
  label: z.string(),
  value: z.string(),
  /** Optional clarifier shown under the value. */
  note: z.string().optional(),
});

export const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const faqSchema = z.object({
  q: z.string(),
  /** Plain text — also fed to FAQPage JSON-LD, so no markdown here. */
  a: z.string(),
});

export const intakeSchema = z.object({
  name: z.string(),
  months: z.string(),
  note: z.string().optional(),
});

export const countryFrontmatterSchema = z.object({
  title: z.string(),
  /** Short label for nav and cards, e.g. "the UK". */
  shortName: z.string(),
  /** Nav/card label, e.g. "UK". */
  code: z.string(),
  order: z.number().int(),
  metaTitle: z.string(),
  metaDescription: z.string().max(180),
  /** One-line hook used on the destination card. */
  hook: z.string(),
  /** Honest one-liner about who this destination actually suits. */
  bestFor: z.string(),
  tuitionRange: z.string(),
  livingCost: z.string(),
  intakes: z.array(intakeSchema).min(1),
  facts: z.array(factSchema).min(1),
  /** The blunt part — what commonly goes wrong. */
  risks: z.array(z.string()).min(1),
  faqs: z.array(faqSchema).min(1),
  sources: z.array(sourceSchema).min(1),
  /** ISO date the figures on this page were last checked against sources. */
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const guideFrontmatterSchema = z.object({
  title: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(180),
  /** ISO publish date. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  excerpt: z.string(),
  readingMinutes: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  faqs: z.array(faqSchema).default([]),
  sources: z.array(sourceSchema).default([]),
  /** Set false to keep a draft out of the build. */
  published: z.boolean().default(true),
});

export type Fact = z.infer<typeof factSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Intake = z.infer<typeof intakeSchema>;
export type CountryFrontmatter = z.infer<typeof countryFrontmatterSchema>;
export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
