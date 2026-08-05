# Axis Global Consultants — website (Phase 1)

Marketing site for [axisglobalpk.com](https://axisglobalpk.com). Overseas
education advisory for Pakistani students — UK, Canada, Australia.

Phase 1 is a marketing site with one real backend feature: lead capture. No
student login, application tracker or CRM — those are Phase 2.

## Stack

| Layer     | Choice                                  |
| --------- | --------------------------------------- |
| Framework | Next.js 15 (App Router) + TypeScript    |
| Styling   | Tailwind CSS v4 (CSS-first `@theme`)    |
| Motion    | Motion (Framer Motion v12)              |
| Content   | MDX in-repo (`/content`)                |
| Data      | Neon Postgres + Drizzle ORM             |
| Email     | Resend                                  |
| Analytics | GA4 + Meta Pixel, gated behind env vars |
| Hosting   | Vercel                                  |

Node 20+ and pnpm.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command          | What it does                     |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Dev server (Turbopack)           |
| `pnpm build`     | Production build — must be clean |
| `pnpm start`     | Serve the production build       |
| `pnpm typecheck` | `tsc --noEmit`                   |
| `pnpm lint`      | ESLint                           |
| `pnpm format`    | Prettier write                   |

## Environment variables

See `.env.example` for the full annotated list. Nothing is required to run the
marketing pages locally; `DATABASE_URL` and `RESEND_API_KEY` are needed for the
lead form to actually save and notify.

## Design tokens

All tokens live in `app/globals.css`:

- CSS custom properties on `:root` — the source values.
- `@theme inline` — exposes them to Tailwind as utilities (`bg-ink`,
  `text-accent`, `text-display-xl`, `rounded-card`, …).

The palette is a near-black base (`--ink: #0b0b0f`) with **one** accent,
electric lime (`--accent: #c8ff3d`). Dark is the only theme in Phase 1.

Display face is **Space Grotesk**, body is **Inter**, both via `next/font`.
Satoshi / General Sans were the first choice but aren't on Google Fonts — swap
them in via `next/font/local` if we license them.

## Project structure

```
app/            routes
components/
  site/         header, footer, logo, icons
  sections/     page sections
  ui/           primitives (button, reveal)
content/        countries/*.mdx, guides/*.mdx
lib/            site config, utils, db, validation, analytics
db/             drizzle schema + migrations
```

## Build order

1. ✅ Scaffold — tokens, fonts, dark theme, hero, header, footer
2. Design system — buttons, cards, stepper, mobile sticky CTA, full home page
3. Content — MDX pipeline, country + guide pages, SEO, sitemap, OG images
4. Backend — Neon + Drizzle, `/api/leads`, Resend, anti-spam
5. Analytics + polish — GA4/Pixel, Lighthouse, a11y, docs

## Deployment

To be documented in Stage 5, along with the DNS records for pointing
axisglobalpk.com at Vercel.
