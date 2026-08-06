# Claude Code — Axis Global Consultants, Phase 1 Polish Pass

> UI/UX polish on the existing site. Do NOT redesign, do NOT change the color system (keep blue + light theme), do NOT touch the backend/lead form logic. Visual and layout refinement only. Work through the fixes in order, commit after each numbered fix with a clear message, and stop for my review at the end. Do not push.

The site is live and looks good — this is targeted polish, not a rebuild. Keep everything that works.

---

## Fix 1 — Hero graphic (globe + plane) — HIGHEST PRIORITY

**Problem:** The globe/plane graphic is clipped in the top-right corner. The plane's arc runs off the screen edge so it reads as a rendering bug, not a design choice, and there's dead space between the tracker card and the globe.

**Fix — make the globe an intentional full-bleed ambient background for the hero:**

- Render the globe as a large, very faint (low-opacity, ~6–12%) background element behind the entire hero section, bleeding from center-right toward the right edge. It should feel like ambient texture, not a floating object stuck in a corner.
- The "YOUR FILE" tracker card floats _on top of_ the globe as the clear focal point on the right.
- Keep the plane's flight-path arc fully **contained** within the visible hero area — it must not run off the top or right edge. If containing it cleanly is awkward, remove the plane entirely and keep just the globe. A clean globe beats a clipped plane.
- The globe must sit behind content (`z-index`/stacking correct) and never overlap or reduce legibility of the headline or card.
- Respect `prefers-reduced-motion` for any globe/plane animation.

Rule of thumb: an element cut off at a screen edge looks like a mistake. It should be either a deliberate full-bleed or fully contained — nothing in between.

## Fix 2 — Hero vertical rhythm

The headline starts too far down; there's a large empty gap above it. Tighten the hero's top spacing so the content sits higher and the left column (headline, subhead, CTAs, trust ticks) is vertically balanced against the tracker card on the right. Reduce the oversized top padding.

## Fix 3 — Destination cards: equal-height, baseline-aligned meta

**Problem:** The four destination cards (UK / Canada / Australia / Uzbekistan) are uneven — the UK card has a big empty gap in the middle because its description is shorter, pushing the Tuition/Intakes block down, while the others are filled.

**Fix:**

- Make all four cards equal height.
- Align the meta blocks (Tuition, Intakes) to a **consistent baseline across all cards**, regardless of description length — use flex column with the description area flex-growing and the meta block pinned to the bottom. All four "Tuition" labels should sit on the same line, all four "Intakes" on the same line.
- Keep the same content and styling, just fix the internal alignment.

## Fix 4 — Consistent section spacing

Vertical spacing between sections is uneven — some gaps (e.g. destinations→process, comparison table→guides) are noticeably larger than others. Define a single vertical-spacing scale (e.g. section padding token like `py-24` desktop / `py-16` mobile) and apply it uniformly to every top-level section so the page rhythm is consistent top to bottom.

## Fix 5 — Small consistency sweep (only if quick)

- Ensure card corner-radius, border color, and shadow are identical across destination cards, guide cards, the tracker card, and the form card.
- Ensure the accent blue used for links, the "stand"/"dream destination" highlighted words, and buttons is the exact same token everywhere (no near-duplicate blues).
- Check mobile: hero graphic must not cause horizontal scroll; destination cards stack cleanly; sticky bottom CTA (if present) doesn't overlap the form's submit button.

---

## What NOT to change

- Do not change the color palette or switch to dark mode. Blue + light stays.
- Do not alter copy, page structure, routes, or the lead-form fields/validation/API.
- Do not add new sections or features.
- Do not touch env vars, Drizzle schema, or Resend logic.

When done, give me a short before/after summary of each fix and commit. Stop for review — do not push.
