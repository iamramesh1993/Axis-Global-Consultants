# Axis Global Consultants — website

Marketing site for [axisglobalpk.com](https://axisglobalpk.com). Overseas
education advisory for Pakistani students — UK, Canada, Australia, Uzbekistan.

The positioning is transparency: every figure on the site carries the official
government source and the date it was verified, every destination page states
the rejection risks, and the fee structure is published before anyone makes
contact. If you change content, keep that property — it is the product.

No student login, application tracker or CRM. Those are the next phase.

## Stack

| Layer     | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | Next.js 15 (App Router) + TypeScript     |
| Styling   | Tailwind CSS v4 (CSS-first `@theme`)     |
| Motion    | Motion (Framer Motion v12)               |
| Content   | MDX in-repo (`/content`), zod-validated  |
| Data      | Neon Postgres + Drizzle ORM              |
| Email     | Resend                                   |
| Analytics | GA4 + Meta Pixel, gated behind env vars  |
| Tests     | Playwright (Chrome, iOS WebKit, Android) |
| Hosting   | Vercel                                   |

Node 20+ and pnpm.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

The marketing pages need no environment variables at all. Only the lead form
does — see below.

## Scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `pnpm dev`         | Dev server (Turbopack)                      |
| `pnpm build`       | Production build — must stay clean          |
| `pnpm start`       | Serve the production build                  |
| `pnpm typecheck`   | `tsc --noEmit`                              |
| `pnpm lint`        | ESLint                                      |
| `pnpm format`      | Prettier, incl. Tailwind class sorting      |
| `pnpm test:e2e`    | Playwright suite against a production build |
| `pnpm test:e2e:ui` | Same, in the interactive runner             |
| `pnpm db:generate` | Generate a migration from `db/schema.ts`    |
| `pnpm db:migrate`  | Apply migrations to `DATABASE_URL`          |
| `pnpm db:studio`   | Drizzle Studio                              |

## Environment variables

Full annotated list in `.env.example`. The ones that matter:

| Variable                    | Needed for                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`              | Saving leads. Neon pooled string, `?sslmode=require`                |
| `RESEND_API_KEY`            | Emailing new-lead alerts                                            |
| `LEAD_NOTIFY_EMAIL`         | Who receives the alert                                              |
| `LEAD_FROM_EMAIL`           | Verified Resend sender, e.g. `Axis Global <leads@axisglobalpk.com>` |
| `SITE_INDEXABLE`            | **Must be `true` to allow search indexing.** See below              |
| `NEXT_PUBLIC_SITE_URL`      | Canonicals, OG images, sitemap                                      |
| `WHATSAPP_ENABLED`          | Leave `false` in this phase                                         |
| `NEXT_PUBLIC_GA_ID`         | GA4. Omit and no GA code loads at all                               |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel. Same — omit and nothing loads                           |

### The indexing guard

`SITE_INDEXABLE` **fails closed**. Anything other than exactly `true` serves
`noindex, nofollow` on every page plus `robots.txt → Disallow: /`, and makes
`llms.txt` return a stub.

This exists so the domain could be pointed at Vercel before the site was
finished without Google indexing a thin page. **Set `SITE_INDEXABLE=true` in
Vercel Production at launch** — nothing else gates it, and a typo keeps you
hidden rather than half-published. The e2e suite asserts the guard is active,
so that test is expected to be updated when you flip it.

## Content

### Adding a destination

Create `content/countries/<slug>.mdx`. Frontmatter is validated by
`countryFrontmatterSchema` in `lib/content-schema.ts` — a malformed file fails
the build rather than shipping a broken page. Required fields include `facts`,
`risks`, `faqs`, `sources` and `verifiedOn`.

The route, sitemap entry, OG image, JSON-LD, `llms.txt` entry, home-page card
and the form's destination list all follow automatically. The only manual step
is adding the slug to `lib/validation.ts → TARGET_COUNTRIES` if you want it
selectable in the lead form, and to `e2e/routes.ts` so it is covered by tests.

### Adding a guide

Create `content/guides/<slug>.mdx` with frontmatter matching
`guideFrontmatterSchema`. Set `published: false` to keep a draft out of the
build. `faqs` feed both the on-page accordion and `FAQPage` structured data, so
write answers as complete standalone prose — that is what answer engines quote.

### Keeping figures honest

`verifiedOn` is rendered on the page next to the source links. When you update a
number, update that date and the source. Every figure currently on the site was
checked against gov.uk, canada.ca, immi.homeaffairs.gov.au and
studyaustralia.gov.au on 2026-08-06.

Volatile values worth re-checking each quarter: UK maintenance amounts and visa
fee, the UK Graduate Route duration cutoff (1 Jan 2027), Canada's cost-of-living
threshold, Australia's visa application charge and financial capacity figure,
and PMDC's position on foreign medical institutions.

## SEO, AEO and GEO

- Per-page metadata and canonicals via `lib/metadata.ts` — always go through it so canonicals and OG images can't drift apart
- Dynamic OG images at `/api/og` (satori — note it needs an explicit `display` on any element with more than one child)
- `sitemap.ts`, `robots.ts`, and `llms.txt` for answer engines
- JSON-LD: `EducationalOrganization`, `WebSite`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`
- All content pages are statically generated

## Lead capture

`POST /api/leads` → zod validation (the same schema the client uses) → Drizzle
insert → Resend email → optional WhatsApp.

Deliberate behaviours worth knowing before you change them:

- **Honeypot returns 200.** A filled `website` field is accepted and discarded so a bot cannot learn it was caught. Do not add a `.max(0)` back to that field — it would 422 and leak the signal.
- **Rate limit is in-memory**, 5 requests per IP per 10 minutes. Serverless instances don't share memory, so it is per-instance. Fine at current volume; move to Upstash Redis when it isn't.
- **Notification failures don't lose leads.** If the insert succeeds but email fails, the request still succeeds. Only when _both_ fail does it return 503 — and then the message tells the student to WhatsApp instead.
- The form never loses typed input on a server error.

### Database setup

```bash
pnpm db:generate   # only after editing db/schema.ts
pnpm db:migrate    # apply to DATABASE_URL
```

The initial migration for the `leads` table is committed at
`db/migrations/0000_regular_vision.sql`.

## Testing

```bash
pnpm test:e2e
```

Runs a production build and exercises it in Desktop Chrome, iPhone (WebKit) and
Pixel (Chromium): every route for 200 + single `h1` + no console errors, a crawl
of every internal link, all redirects, the 404, form validation and submission,
API error paths, rate limiting, the honeypot, structured data, security headers,
horizontal-overflow checks, tap-target sizes, 16px inputs, the mobile drawer and
sticky CTA, and `prefers-reduced-motion`.

First run needs browsers: `pnpm exec playwright install chromium webkit`.

## Design tokens

All tokens live in `app/globals.css`:

- CSS custom properties on `:root` — the source values
- `@theme inline` — exposes them to Tailwind as utilities (`bg-ink`, `text-accent`, `text-display-xl`, `rounded-card`, …)

Near-black base (`--ink: #0b0b0f`) with **one** accent, electric lime
(`--accent: #c8ff3d`). Dark is the only theme in this phase. Display face is
Space Grotesk, body is Inter, both via `next/font`. Satoshi / General Sans were
the first choice but aren't on Google Fonts — swap them in via `next/font/local`
if licensed.

## Mobile

Roughly 90% of traffic is expected from Instagram and Facebook ads on phones.

- `viewportFit: "cover"` plus safe-area insets for the iOS notch and home bar
- Inputs are `max(16px, 1rem)` on small screens so iOS Safari doesn't zoom on focus
- Sticky bottom CTA appears after 600px of scroll, suppressed on `/contact`
- Pinch-zoom is never disabled
- `body { overflow-x: hidden }` plus an e2e assertion that no page scrolls sideways
- PWA manifest with 192/512 icons and a maskable variant

## Security

Set in `next.config.ts`: CSP, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, HSTS in production, and
`poweredByHeader: false`.

Two known trade-offs, both deliberate:

- CSP allows `'unsafe-inline'` on `script-src` because the GA4 and Meta Pixel bootstrap snippets are inline by design. Tightening to a nonce means moving both behind a tag manager.
- `upgrade-insecure-requests` and HSTS are only emitted where there is real TLS. Emitting them on a local http build breaks every asset in WebKit.

## Project structure

```
app/            routes, api, sitemap, robots, manifest, llms.txt
components/
  site/         header, footer, logo, social icons, mobile CTA
  sections/     page sections
  ui/           primitives (button, card, faq, stepper, reveal)
  forms/        lead form and fields
  mdx/          MDX renderer and component mapping
  seo/          JSON-LD builders
  analytics/    GA4 + Meta Pixel loaders
content/        countries/*.mdx, guides/*.mdx
lib/            site config, content loading, schemas, db, notify, rate limit
db/             Drizzle schema + migrations
e2e/            Playwright specs
```

## Deployment

Import the repo at [vercel.com/new](https://vercel.com/new). Framework detection
handles the rest; add the environment variables above before the first deploy.

### DNS for axisglobalpk.com

The domain is registered with Namecheap. Keep it on **Namecheap BasicDNS** —
switching to Vercel's nameservers means re-creating every record there,
including the MX records needed for email on the domain.

1. Vercel → project → Settings → Domains → add `axisglobalpk.com`, and accept the prompt to add `www` too.
2. In Namecheap → Domain List → Manage → **Advanced DNS**, delete the parking records first: the `@` record pointing at Namecheap's parking IP, and `CNAME www → parkingpage.namecheap.com`.
3. Add the two records **exactly as the Vercel dashboard displays them**: an `A` record on `@`, and a `CNAME` on `www`. Vercel's `www` target is unique per project (it looks like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so copy it from the dashboard rather than from any guide.
4. TTL: Automatic.

Then set `SITE_INDEXABLE=true` when you actually want to be found.

## Placeholders still to replace

- Office address (`lib/site.ts`)
- Social handles — currently `axisglobalpk` guesses
- Whether `hello@axisglobalpk.com` is the right inbox
- Testimonials on `/about` — marked as placeholders on the page and styled with a dashed border so they can't be mistaken for real ones
- `/privacy` and `/terms` describe real practice but have not had legal review
