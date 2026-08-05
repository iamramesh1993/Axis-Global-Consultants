# Claude Code Build Prompt — Axis Global Consultants (Phase 1)

> **When I say "go", do everything below in order, starting with Stage 0 (bootstrap), without waiting for further input — except stop for review at the end of each numbered build stage in section 9.**

---

## Stage 0 — Bootstrap (run this first, before anything else)

The repo already exists on GitHub. Set it up locally in the current working directory:

1. If the current folder is **already** the cloned repo (a `.git` pointing at `iamramesh1993/Axis-Global-Consultants` exists), use it as-is. Otherwise clone it:
   ```bash
   git clone https://github.com/iamramesh1993/Axis-Global-Consultants.git .
   ```
   (Clone into the current directory. If it's non-empty and clone refuses, clone into a subfolder `Axis-Global-Consultants/` and `cd` into it.)
2. Set git identity for this repo:
   ```bash
   git config user.name "iamramesh1993"
   git config user.email "iamramesh214@gmail.com"
   ```
3. Confirm the remote:
   ```bash
   git remote -v   # should show iamramesh1993/Axis-Global-Consultants
   ```
4. Verify toolchain: Node 20+, pnpm. If pnpm is missing, `npm i -g pnpm`.
5. Then proceed straight into Stage 1 of the build.

If cloning fails (auth/permissions), tell me exactly what failed and how to fix it, then continue building locally so no time is lost — I'll sort the remote and you can commit once it's connected.

---

## 0 — Agent instructions (read first)

You are building the **Phase 1 marketing website** for a study-abroad consultancy. Ship a fast, SEO-first, mobile-first, Gen-Z-appealing site with a working lead-capture form that writes to a database and fires a notification. Do **not** build a student login, application tracker, or CRM in this phase — those are Phase 2.

Work in stages. After each stage, stop and summarize what you built and what you need from me (env vars, decisions) before continuing. Do not invent API keys — leave clearly-marked placeholders in `.env.local` and `.env.example`.

If a design or copy decision is ambiguous, make the tasteful modern choice and note it — don't block on it.

---

## 1 — What this is

**Business:** Axis Global Consultants — an overseas-education advisory helping Pakistani students get admission to foreign universities (Phase 1 focus: **UK, Canada, Australia**).

**Brand name (use exactly):** Axis Global Consultants
**Domain (already registered):** axisglobalpk.com
**GitHub repo (already created — remote already exists):** https://github.com/iamramesh1993/Axis-Global-Consultants
**Git identity for commits:** name `iamramesh1993`, email `iamramesh214@gmail.com`

**Positioning (this is the whole point):** the incumbents (HR Pakistan, IDP, etc.) are all the same — WordPress brochure sites, a "No.1 in Pakistan" banner, a WhatsApp button, and total silence after the first meeting. We are the transparent, tech-forward opposite:

- Published, honest process — no "free consultation" that hides a commission.
- Clear stages shown up front (Profile → Shortlist → Documents → Applied → Offer → Visa → Departure) even though the live tracker itself is Phase 2.
- Honest fit/rejection-risk framing, not "we get everyone in."

**Explicit anti-reference:** HR Pakistan (hrpakistan.com). Same _structure_ of trust content (services, destinations, testimonials, contact) but the visual language must be the polar opposite — modern, clean, confident, Gen-Z, NOT a dated brochure.

---

## 2 — Tech stack (non-negotiable — matches my existing pipeline)

| Layer          | Choice                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------ |
| Framework      | **Next.js 15 (App Router) + TypeScript**                                                   |
| Styling        | **Tailwind CSS**                                                                           |
| Content        | **MDX in-repo** for country/guide pages (no CMS in Phase 1)                                |
| Data           | **Neon Postgres + Drizzle ORM**                                                            |
| Email notify   | **Resend**                                                                                 |
| Lead alert     | Resend email to admin + optional WhatsApp Cloud API stub (leave togglable, off by default) |
| Analytics      | **GA4 + Meta Pixel** (component stubs, gated behind env vars)                              |
| Hosting target | **Vercel** (build must pass `next build` cleanly for Vercel)                               |
| Domain         | axisglobalpk.com (already registered; don't configure DNS — I'll do it)                    |

Package manager: pnpm. Node 20+.

---

## 3 — Design direction (Gen-Z, modern — NOT brochure)

**Vibe:** confident, editorial, a little bold. Think a well-funded fintech landing page, not an education agency. Reference feel: generous whitespace, big confident type, one strong accent color, subtle motion, real depth.

**Design tokens (define in Tailwind config + CSS vars):**

- **Type:** a modern geometric/grotesk sans for headings (e.g. `Satoshi`, `General Sans`, or `Inter` tight-tracked as fallback), readable sans for body. Big, tight headlines. Fluid type scale (`clamp()`).
- **Color:** dark, premium base (near-black `#0B0B0F` or deep navy) + **one vivid accent** (pick an electric/lime/violet — choose one and commit). Avoid the generic corporate-blue every competitor uses. Light sections allowed for contrast.
- **Layout:** asymmetric hero, bento-grid sections, rounded-2xl cards, soft shadows, thin borders. No stock-photo-in-a-box brochure blocks.
- **Motion:** subtle scroll-reveal + hover states (Framer Motion). Tasteful, not gimmicky. Respect `prefers-reduced-motion`.
- **Mobile-first:** ~90% of traffic is mobile from Instagram/FB ads. Design phone-first, sticky bottom CTA on mobile.
- Dark mode default; ensure AA contrast.

**Do NOT do:** carousels of university logos as the hero, "★★★★★ No.1 in Pakistan" banners, clip-art icons, WhatsApp-green floating button as the primary CTA (a subtle WhatsApp link is fine, but the primary CTA is "Book a Free Assessment" → lead form).

---

## 4 — Pages / routes (Phase 1)

```
/                      Home
/study/uk              Country guide (MDX)
/study/canada          Country guide (MDX)
/study/australia       Country guide (MDX)
/how-it-works          The transparent process (the 7 stages + honest fees section)
/about                 Positioning: why we're different, transparency promise
/contact               Lead form + office/contact details
/guides/[slug]         MDX blog/guide pages (seed 2-3 sample posts)
/privacy  /terms       Basic legal pages (placeholder copy, clearly marked)
```

### Home must contain, in order:

1. **Hero** — bold headline on transparency/getting-in, subhead, primary CTA ("Book a Free Assessment"), secondary ("See how it works"). One strong visual/graphic, not a stock classroom photo.
2. **Trust strip** — "No commission-chasing · Published process · You always know your file's status" (words, not fake logos).
3. **Destinations** — UK / Canada / Australia cards → country pages. Each with a real hook (cost range, intake months, "what you need").
4. **How it works** — the 7 stages as a visual horizontal/stepper timeline (Profile → Shortlist → Documents → Applied → Offer → Visa → Departure). Note the live tracker is "coming soon in your student portal."
5. **Why us / transparency** — direct contrast with the old way (a tasteful "old way vs Axis way" comparison — no naming competitors).
6. **Guides preview** — latest MDX guides.
7. **Lead CTA section** — the assessment form (or link to /contact).
8. **Footer** — links, contact, socials, subtle WhatsApp link, legal.

---

## 5 — Lead capture (the one real backend feature)

**Form fields:** full name, email, phone (PK format), highest qualification, target country (UK/Canada/Australia/Undecided), intended intake (dropdown), budget range (optional), short message (optional), consent checkbox.

**Flow:**

1. Client-side validation (zod + react-hook-form). No HTML `<form>` submission that reloads — use handlers.
2. `POST /api/leads` → validate again server-side (zod) → insert into Neon via Drizzle.
3. On success → fire Resend email to admin (`LEAD_NOTIFY_EMAIL`) with the lead details.
4. WhatsApp Cloud API notification: write the function but **gate it behind `WHATSAPP_ENABLED=false`** — stub the call, don't require creds in Phase 1.
5. Return success → show a warm confirmation state (not just "submitted"). Handle errors gracefully.
6. Basic anti-spam: honeypot field + simple rate-limit per IP.

**Drizzle schema (`leads` table):**
`id (uuid pk)`, `full_name`, `email`, `phone`, `qualification`, `target_country`, `intake`, `budget_range (nullable)`, `message (nullable)`, `consent (bool)`, `source (nullable, for UTM)`, `created_at (default now)`.

Also capture UTM params (`utm_source/medium/campaign`) into `source` when present — I'll run Meta ads later.

---

## 6 — SEO (this is the acquisition channel — take it seriously)

- SSG all content pages. Country/guide pages statically generated from MDX.
- Per-page `metadata` (title, description, OG image, canonical).
- Dynamic OG images (`next/og`) for country + guide pages.
- `sitemap.ts` + `robots.ts`.
- JSON-LD: `Organization` on home, `Article` on guides, `FAQPage` where FAQs exist, `BreadcrumbList`.
- Semantic headings, alt text, fast LCP. Target Lighthouse 90+ on mobile.
- Country pages structured for the money keywords: "study in {country} from Pakistan", cost, intakes, requirements, scholarships, visa checklist. Each ends with the lead CTA.

---

## 7 — Analytics & pixel

- GA4 + Meta Pixel components, loaded only if `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` are set.
- Fire a `Lead` pixel event + GA event on successful form submit (this feeds Meta CAPI later — leave a `TODO: CAPI` note server-side).
- No tracking without the env vars present (clean local dev).

---

## 8 — Project structure & quality

```
/app            routes
/components      ui + sections
/content        /countries/*.mdx  /guides/*.mdx
/lib            db (drizzle), resend, validation (zod schemas), analytics
/db             schema.ts, migrations
/public         assets
```

- Strict TypeScript, ESLint + Prettier.
- All secrets in `.env.local`; commit a complete `.env.example`.
- `README.md` with: setup, env vars explained, how to run migrations, how to add a new country/guide MDX page, how to deploy to Vercel, and the DNS records I'll need to point axisglobalpk.com at Vercel.
- Seed script: 3 country pages + 2 sample guides + a few placeholder testimonials (clearly marked as placeholder).
- Do NOT use localStorage/sessionStorage for anything critical.
- Everything must `next build` clean for Vercel.

---

## 9 — Build order (stop & summarize after each)

1. **Scaffold** — Next 15 + TS + Tailwind + design tokens + fonts + dark theme. Home hero + footer shell only. → show me.
2. **Design system** — buttons, cards, section wrappers, stepper, nav, mobile sticky CTA. Full home page assembled.
3. **Content** — MDX pipeline; UK/Canada/Australia pages + how-it-works + about + 2 guides. SEO metadata + sitemap + robots + JSON-LD + OG images.
4. **Backend** — Neon + Drizzle schema + migration; `/api/leads`; Resend notify; WhatsApp stub (off); validation; anti-spam.
5. **Analytics + polish** — GA4/Pixel stubs, lead events, Lighthouse pass, a11y pass, README + `.env.example`.

**Git:** This folder is the local clone of the repo above and the remote already exists. Set `git config user.name iamramesh1993` and `git config user.email iamramesh214@gmail.com`. Commit after each stage with clear messages. Do NOT push until I tell you to — I'll review and push myself.

---

## 10 — Copy tone

Confident, plain, honest. Short sentences. No "unlock your dreams," no "No.1," no exclamation spam. Sound like a sharp, straight-talking advisor who respects the student. English primary; a light Urdu phrase in a testimonial is fine for authenticity.

---

### Env vars you'll need from me

```
DATABASE_URL=            # Neon
RESEND_API_KEY=
LEAD_NOTIFY_EMAIL=
WHATSAPP_ENABLED=false
WHATSAPP_TOKEN=          # leave blank Phase 1
WHATSAPP_PHONE_ID=       # leave blank Phase 1
NEXT_PUBLIC_GA_ID=       # optional
NEXT_PUBLIC_META_PIXEL_ID=  # optional
NEXT_PUBLIC_SITE_URL=https://axisglobalpk.com
```

When I say **"go"**, begin at Stage 0 (bootstrap), then Stage 1, and stop for my review at the end of each build stage.
