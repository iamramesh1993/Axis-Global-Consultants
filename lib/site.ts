/**
 * Single source of truth for brand + contact details.
 * Anything that appears in more than one place lives here.
 */

export const site = {
  name: "Axis Global Consultants",
  shortName: "Axis Global",
  tagline: "Overseas education, without the guesswork.",
  description:
    "Axis Global Consultants helps Pakistani students win admission to universities in the UK, Canada and Australia — with a published process, honest fit assessments and no commission-chasing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://axisglobalpk.com",
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

/** Primary nav — used by header and footer. */
export const mainNav = [
  { href: "/study/uk", label: "Study in UK" },
  { href: "/study/canada", label: "Study in Canada" },
  { href: "/study/australia", label: "Study in Australia" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
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
