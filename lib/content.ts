import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  countryFrontmatterSchema,
  guideFrontmatterSchema,
  type CountryFrontmatter,
  type GuideFrontmatter,
} from "@/lib/content-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

type Loaded<T> = {
  slug: string;
  frontmatter: T;
  body: string;
};

function readDir(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .sort();
}

function load<T>(
  dir: string,
  file: string,
  parse: (data: unknown, slug: string) => T,
): Loaded<T> {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, dir, file), "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: parse(data, slug), body: content };
}

function parseWith<T>(
  schema: {
    safeParse: (v: unknown) => { success: boolean; data?: T; error?: unknown };
  },
  what: string,
) {
  return (data: unknown, slug: string): T => {
    const result = schema.safeParse(data);
    if (!result.success || !result.data) {
      // Fail the build loudly rather than render a half-broken page.
      throw new Error(
        `Invalid frontmatter in ${what} "${slug}":\n${JSON.stringify(result.error, null, 2)}`,
      );
    }
    return result.data;
  };
}

const parseCountry = parseWith<CountryFrontmatter>(
  countryFrontmatterSchema,
  "content/countries",
);
const parseGuide = parseWith<GuideFrontmatter>(
  guideFrontmatterSchema,
  "content/guides",
);

// --- Countries ---------------------------------------------------------------

export function getAllCountries(): Loaded<CountryFrontmatter>[] {
  return readDir("countries")
    .map((f) => load("countries", f, parseCountry))
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getCountry(slug: string): Loaded<CountryFrontmatter> | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(CONTENT_DIR, "countries", file))) return null;
  return load("countries", file, parseCountry);
}

export function getCountrySlugs(): string[] {
  return getAllCountries().map((c) => c.slug);
}

// --- Guides ------------------------------------------------------------------

export function getAllGuides(): Loaded<GuideFrontmatter>[] {
  return readDir("guides")
    .map((f) => load("guides", f, parseGuide))
    .filter((g) => g.frontmatter.published)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getGuide(slug: string): Loaded<GuideFrontmatter> | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(CONTENT_DIR, "guides", file))) return null;
  const guide = load("guides", file, parseGuide);
  return guide.frontmatter.published ? guide : null;
}

export function getGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.slug);
}
