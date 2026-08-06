/**
 * Single source of truth for brand + contact details.
 * Anything that appears in more than one place lives here.
 */

const DEFAULT_URL = "https://axisglobalpk.com";

/**
 * `??` is not enough here: an env var that exists but is blank is a real and
 * common state (a Vercel variable saved empty, or `vercel env pull` writing
 * `KEY=""`). An empty string sails past `??` and then `new URL("")` throws
 * during `next build` with a bare "Invalid URL", which is a miserable thing to
 * debug. Treat blank as unset.
 */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl =
  configuredUrl && configuredUrl.length > 0 ? configuredUrl : DEFAULT_URL;

export const site = {
  name: "Axis Global Consultants",
  shortName: "Axis Global",
  tagline: "Overseas education, without the guesswork.",
  description:
    "Axis Global Consultants helps Pakistani students win admission to universities in the UK, Canada, Australia and Uzbekistan — with a published process, honest fit assessments and no commission-chasing.",
  url: siteUrl,
  locale: "en_PK",

  contact: {
    email: "hello@axisglobalpk.com",
    phone: "+92 313 5155868",
    whatsapp: "+923135155868", // same line as above; wa.me links strip the non-digits
    address: {
      line1: "Office address to be confirmed", // PLACEHOLDER
      city: "Karachi",
      country: "Pakistan",
    },
    hours: "Mon–Sat, 10:00–19:00 PKT",
  },

  socials: {
    instagram: "https://instagram.com/axisglobalpk", // PLACEHOLDER
    facebook: "https://facebook.com/axisglobalpk", // PLACEHOLDER
    linkedin: "https://linkedin.com/company/axisglobalpk", // PLACEHOLDER
    tiktok: "https://tiktok.com/@axisglobalpk", // PLACEHOLDER
  },
} as const;

export const whatsappLink = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`;

/**
 * Primary nav. Country labels are short here so seven items still fit the
 * desktop bar; the mobile drawer and footer use the fuller "Study in X" wording
 * where there is room for it.
 */
export const mainNav = [
  { href: "/study/uk", label: "UK", longLabel: "Study in the UK" },
  { href: "/study/canada", label: "Canada", longLabel: "Study in Canada" },
  {
    href: "/study/australia",
    label: "Australia",
    longLabel: "Study in Australia",
  },
  {
    href: "/study/uzbekistan",
    label: "Uzbekistan",
    longLabel: "Study in Uzbekistan",
  },
  { href: "/how-it-works", label: "How it works", longLabel: "How it works" },
  { href: "/guides", label: "Guides", longLabel: "Guides" },
  { href: "/about", label: "About", longLabel: "About us" },
] as const;

/** The seven published stages. Referenced by the home stepper and /how-it-works. */
export const stages = [
  {
    n: 1,
    key: "profile",
    title: "Profile",
    blurb:
      "We read your transcripts, budget and timeline, then tell you honestly where you stand.",
  },
  {
    n: 2,
    key: "shortlist",
    title: "Shortlist",
    blurb:
      "A ranked list with reach, match and safe options — and the rejection risk on each.",
  },
  {
    n: 3,
    key: "documents",
    title: "Documents",
    blurb:
      "SOP, references, transcripts, financials. Checklists you can see, not chase.",
  },
  {
    n: 4,
    key: "applied",
    title: "Applied",
    blurb:
      "Applications submitted, with every reference number logged against your file.",
  },
  {
    n: 5,
    key: "offer",
    title: "Offer",
    blurb:
      "Conditional and unconditional offers compared side by side before you commit.",
  },
  {
    n: 6,
    key: "visa",
    title: "Visa",
    blurb:
      "Financial evidence, credibility interview prep, and the full submission pack.",
  },
  {
    n: 7,
    key: "departure",
    title: "Departure",
    blurb:
      "Accommodation, travel, arrival checklist. We stay reachable after you land.",
  },
] as const;
