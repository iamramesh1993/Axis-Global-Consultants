# Axis Global — operations pipeline

**Internal. Not published.** This lives in `docs/`, never in `public/` — anything
under `public/` is served to the world.

Owner column: **R** = Ramesh (needs an account, a credential, or a business
decision), **Dev** = can be done in the codebase without you.

Status: `TODO` · `BLOCKED` · `DONE`

---

## 0. Blocking launch

Nothing else on this list matters as much as these three.

| #   | Item                                   | Owner | Status         | Notes                                                                                                                                                                                                                        |
| --- | -------------------------------------- | ----- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | **Resend API key** — lead email alerts | R     | TODO           | Leads save to the database but **nobody is notified**. The site promises a reply "within one working day". Until this is set, that promise depends on someone remembering to open the dashboard. See §1.1.                   |
| 0.2 | **Admin password**                     | R     | TODO           | `vercel env add ADMIN_PASSWORD production --sensitive`. `/admin/leads` is locked and unusable until then. Session secret is already set.                                                                                     |
| 0.3 | **Flip `SITE_INDEXABLE=true`**         | Dev   | BLOCKED by 0.1 | Site is currently `noindex` + `robots.txt Disallow: /`. Nothing gets found on Google until this flips. Hold until the lead form notifies properly — a student who submits into silence is worse than one who never finds us. |

---

## 1. Email and notifications

| #   | Item                                                         | Owner | Status | Notes                                                                                                                                                                         |
| --- | ------------------------------------------------------------ | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Create Resend account, verify `axisglobalpk.com`             | R     | TODO   | Resend gives 3 DNS records (DKIM + SPF + return-path). Add them in Namecheap → Advanced DNS. They will **not** clash with the existing `eforward*` MX records.                |
| 1.2 | Set `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL` | R     | TODO   | `LEAD_FROM_EMAIL` must be on the verified domain, e.g. `Axis Global <leads@axisglobalpk.com>`.                                                                                |
| 1.3 | Send a real test lead end to end                             | Dev   | TODO   | After 1.2. Confirm the email lands, `Reply` goes to the student, and it isn't in spam.                                                                                        |
| 1.4 | Decide the real inbox for `hello@axisglobalpk.com`           | R     | TODO   | Currently a Namecheap forward. Google Workspace or Zoho if you want a proper mailbox.                                                                                         |
| 1.5 | WhatsApp Cloud API                                           | R     | TODO   | Code is written and gated behind `WHATSAPP_ENABLED=false`. Needs a Meta Business account and a verified number. Low priority while volume is low — the email alert covers it. |
| 1.6 | SPF/DKIM/DMARC check                                         | Dev   | TODO   | After 1.1. Add a DMARC record (`p=none` to start) so alert mail isn't spam-filed.                                                                                             |

---

## 2. Cloudflare

Worth doing, but **read the ordering note** — putting Cloudflare in front of
Vercel wrongly is a classic way to break TLS.

| #   | Item                                                  | Owner   | Status | Notes                                                                                                                                                                                                                                          |
| --- | ----------------------------------------------------- | ------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Decide whether Cloudflare is actually needed          | R + Dev | TODO   | Vercel already gives global CDN, DDoS protection, automatic TLS and HTTP/3. Cloudflare adds value mainly for: a WAF you control, bot rules, analytics without cookies, and cheaper egress at scale. At current traffic it is **optional**.     |
| 2.2 | If yes: move nameservers to Cloudflare                | R       | TODO   | Cloudflare requires full DNS delegation. You must re-create every record first: the two Vercel A records, the `www` CNAME, the `eforward*` MX records, the SPF TXT, and anything Resend adds. Losing the MX records silently kills your email. |
| 2.3 | Set SSL mode to **Full (strict)**                     | R       | TODO   | Anything less (Flexible) creates a redirect loop with Vercel and serves your site over a downgraded connection. This is the single most common mistake.                                                                                        |
| 2.4 | Turn **off** Cloudflare Auto Minify and Rocket Loader | R       | TODO   | Both break Next.js hydration. Auto Minify is deprecated but still on for older zones.                                                                                                                                                          |
| 2.5 | Set cache level to "Standard", do not cache HTML      | R       | TODO   | Vercel already handles ISR/static caching. Cloudflare caching HTML on top causes stale pages after a deploy.                                                                                                                                   |
| 2.6 | Add a WAF rate-limit rule on `/api/leads`             | Dev     | TODO   | Would replace the in-memory limiter (§4.3), which is per-instance and therefore weak.                                                                                                                                                          |
| 2.7 | Bot Fight Mode — test before enabling                 | R       | TODO   | It can block legitimate crawlers including Googlebot variants and the answer-engine crawlers we want (§3.7).                                                                                                                                   |

---

## 3. SEO / AEO / GEO

| #    | Item                                       | Owner   | Status         | Notes                                                                                                                                                                                      |
| ---- | ------------------------------------------ | ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1  | Per-page metadata, canonicals, OG images   | Dev     | DONE           | All routes go through `lib/metadata.ts`.                                                                                                                                                   |
| 3.2  | `sitemap.xml`, `robots.txt`, `llms.txt`    | Dev     | DONE           | `/admin` and `/api/` are disallowed and absent from the sitemap.                                                                                                                           |
| 3.3  | JSON-LD                                    | Dev     | DONE           | EducationalOrganization, WebSite, Service, Article, FAQPage, BreadcrumbList.                                                                                                               |
| 3.4  | Google Search Console                      | R       | BLOCKED by 0.3 | Verify via DNS TXT, submit the sitemap. Pointless while the site is noindex.                                                                                                               |
| 3.5  | Bing Webmaster Tools                       | R       | BLOCKED by 0.3 | Also feeds ChatGPT search. Worth 10 minutes.                                                                                                                                               |
| 3.6  | Google Business Profile                    | R       | BLOCKED by 3.9 | Needs a real address. This is the single biggest local-SEO lever for "study abroad consultant Karachi".                                                                                    |
| 3.7  | Confirm answer-engine crawlers are allowed | Dev     | TODO           | After 0.3, verify `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` are not blocked, since AEO is part of the strategy. Decide deliberately rather than by default.                |
| 3.8  | GA4 + Meta Pixel IDs                       | R       | TODO           | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`. Nothing loads without them — no cookie banner needed until they are set. Note: setting them changes what the privacy policy must say.    |
| 3.9  | Real office address                        | R       | TODO           | Currently the site shows "Karachi, Pakistan" + "Meetings by appointment", which reads as finished. Add `site.contact.address.street` and the street line appears everywhere automatically. |
| 3.10 | Real social handles                        | R       | TODO           | `lib/site.ts` has `axisglobalpk` guesses on all four. Broken social links from the footer look worse than no links.                                                                        |
| 3.11 | Meta Conversions API                       | Dev     | TODO           | `TODO: CAPI` marker is in `app/api/leads/route.ts`. Needed for reliable ad attribution once iOS strips the pixel.                                                                          |
| 3.12 | Quarterly figure re-check                  | R + Dev | RECURRING      | See §6. This is the site's core promise.                                                                                                                                                   |

---

## 4. Security

| #   | Item                                      | Owner | Status    | Notes                                                                                                                                                                                                  |
| --- | ----------------------------------------- | ----- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.1 | Security headers                          | Dev   | DONE      | CSP, HSTS (preload), nosniff, DENY framing, Referrer-Policy, Permissions-Policy, `poweredByHeader: false`.                                                                                             |
| 4.2 | Tighten CSP `script-src`                  | Dev   | TODO      | Currently allows `'unsafe-inline'` because the GA4 and Meta Pixel bootstraps are inline by design. Moving both behind Google Tag Manager would let us use a nonce. Do it when 3.8 happens, not before. |
| 4.3 | Replace the in-memory rate limiter        | Dev   | TODO      | `lib/rate-limit.ts` is per-serverless-instance, so the real limit is higher than 5/10min. Upstash Redis, or Cloudflare (§2.6). Fine at current volume; not fine once ads run.                          |
| 4.4 | Admin auth                                | Dev   | DONE      | HMAC-signed httpOnly cookie, timing-safe compare, fails closed, 12h expiry, rate-limited login, CSV endpoint 404s for anonymous callers.                                                               |
| 4.5 | Rotate the admin password on staff change | R     | RECURRING | Single shared password. If more than one person needs access, replace this with real auth rather than sharing it.                                                                                      |
| 4.6 | HSTS preload submission                   | R     | TODO      | Header is already set. Submitting to hstspreload.org is **hard to reverse** — only do it once you are certain the domain will always be HTTPS.                                                         |
| 4.7 | Dependency audit in CI                    | Dev   | TODO      | `pnpm audit` on a schedule. Nothing outstanding today.                                                                                                                                                 |
| 4.8 | Database backups                          | R     | TODO      | Neon has point-in-time restore on paid plans; the free tier's window is short. Leads are the business asset — check what the current plan actually retains.                                            |
| 4.9 | Confirm no secret is client-exposed       | Dev   | DONE      | Only `NEXT_PUBLIC_*` reach the browser: site URL, GA ID, pixel ID. All non-sensitive.                                                                                                                  |

---

## 5. Production hygiene

| #   | Item                                          | Owner | Status | Notes                                                                                                                                                                                                                                                            |
| --- | --------------------------------------------- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Remove operator-facing text from public pages | Dev   | DONE   | Was live: "Placeholder — pending legal review" on /privacy and /terms, "Placeholder — replace before launch" testimonials on /about, "If analytics is enabled… corresponding configuration", "next release", "until it ships", "Office address to be confirmed". |
| 5.2 | Automated guard against it returning          | Dev   | DONE   | `e2e/production-hygiene.spec.ts` fails the build on a blocklist of internal phrases across every route.                                                                                                                                                          |
| 5.3 | Nothing internal under `/public`              | Dev   | DONE   | `CREDITS.md` was world-readable at `/destinations/CREDITS.md`; moved to `docs/`. The logo master moved to `docs/brand/`. Tested.                                                                                                                                 |
| 5.4 | Admin login discloses no configuration        | Dev   | DONE   | Was naming `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` on a public page. Now generic; detail goes to the server log.                                                                                                                                               |
| 5.5 | Real testimonials                             | R     | TODO   | The /about testimonials section was **removed**, not faked — a page about honesty cannot carry invented quotes. Collect 3 real ones with written consent (name, course, destination) and it goes back in.                                                        |
| 5.6 | Legal review of /privacy and /terms           | R     | TODO   | Both accurately describe how we operate but have had no lawyer near them. The public "pending review" banner is gone; the obligation is not.                                                                                                                     |
| 5.7 | Git auto-deploy                               | R     | TODO   | Vercel dashboard → Settings → Git → connect the GitHub repo. CLI couldn't do it: it needs a GitHub App OAuth grant on your account. Until then every deploy is manual.                                                                                           |
| 5.8 | Custom 404 and error pages                    | Dev   | DONE   | 404 is designed and offers routes out.                                                                                                                                                                                                                           |
| 5.9 | `error.tsx` boundary                          | Dev   | TODO   | A server error currently shows Next's default page. A branded one is better, and must not leak a stack trace.                                                                                                                                                    |

---

## 6. Content accuracy — recurring

The site's entire positioning is that every figure is sourced and dated. That
only stays true if someone checks. **Owner: R to diarise, Dev to update.**

Last full verification: **2026-08-06**.

| Check each quarter                                     | Source                                                                        |
| ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| UK maintenance amounts, visa fee, IHS                  | gov.uk/student-visa                                                           |
| **UK Graduate Route cutoff — 1 Jan 2027**              | gov.uk. Hard date, already in a guide. Content must change the day it passes. |
| Canada cost-of-living threshold, PAL rules, work hours | canada.ca IRCC                                                                |
| Australia VAC and financial capacity                   | immi.homeaffairs.gov.au, studyaustralia.gov.au                                |
| PMDC position on foreign medical institutions          | pmdc.pk. Highest-stakes claim on the site.                                    |

When a figure changes, update the value **and** `verifiedOn` in the MDX
frontmatter — the date renders on the page next to the sources.

---

## 7. Code hygiene

| #   | Item                                         | Owner   | Status | Notes                                                                                                                                                                                                                                                                                                   |
| --- | -------------------------------------------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7.1 | Strict TS, ESLint, Prettier w/ class sorting | Dev     | DONE   |                                                                                                                                                                                                                                                                                                         |
| 7.2 | Playwright suite                             | Dev     | DONE   | 300+ tests across Chrome, iOS WebKit, Android: every route, internal-link crawl, redirects, form validation, API error paths, rate limiting, honeypot, structured data, security headers, no horizontal overflow, tap targets, 16px inputs, drawer, reduced motion, admin lockdown, production hygiene. |
| 7.3 | Run the suite in CI on every push            | Dev     | TODO   | Currently only runs locally, which means it only runs when someone remembers. Depends on 5.7.                                                                                                                                                                                                           |
| 7.4 | Lighthouse / Core Web Vitals baseline        | Dev     | TODO   | First Load JS is 216 kB after dropping framer-motion. Worth a real mobile Lighthouse run on the live domain.                                                                                                                                                                                            |
| 7.5 | Zod-validated MDX frontmatter                | Dev     | DONE   | A malformed content file fails the build instead of shipping broken.                                                                                                                                                                                                                                    |
| 7.6 | Single source of truth for brand/contact     | Dev     | DONE   | `lib/site.ts`.                                                                                                                                                                                                                                                                                          |
| 7.7 | Photo licensing recorded                     | Dev     | DONE   | `docs/photo-credits.md` — Unsplash IDs and licence terms.                                                                                                                                                                                                                                               |
| 7.8 | Student portal (Phase 2)                     | R + Dev | TODO   | Login, live application tracker, document upload. The status card on the home page sets this expectation, so don't leave it indefinitely.                                                                                                                                                               |

---

## Known trade-offs, deliberately accepted

Written down so nobody "fixes" them by accident:

1. **CSP allows `'unsafe-inline'` for scripts** — required by the GA4 and Meta Pixel bootstrap snippets. See 4.2.
2. **`upgrade-insecure-requests` is absent from the CSP** — it broke every asset in WebKit on local http builds, and gating it on `process.env.VERCEL` was unreliable because `vercel env pull` writes `VERCEL=1` into `.env.local`. Redundant next to HSTS plus Vercel's edge redirect.
3. **Rate limiting is in-memory** — per-instance, not global. See 4.3.
4. **One shared admin password, no user accounts** — proportionate for one operator. Replace, don't extend, if that changes.
5. **Logo artwork has a white background, not transparency** — so the lockup is only placed on white surfaces. On the grey panel tone it would show a box.
6. **The trust strip carries words, not statistics** — "10,000+ placed" and "98% visa success" are not ours to invent, and /about states we make no such claims. The styling is ready for audited numbers.
