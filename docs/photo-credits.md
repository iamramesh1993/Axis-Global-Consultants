# Destination photography

> Internal note. Kept in `docs/` rather than `public/` — anything under `public/`
> is served to the world, and this file was briefly readable at
> `/destinations/CREDITS.md`.

All four images are from **Unsplash**, under the
[Unsplash License](https://unsplash.com/license): free to use for commercial
and non-commercial purposes, no permission or attribution required. Attribution
is recorded here anyway so the provenance of every asset on the site is
traceable — and so these can be replaced deliberately rather than guessed at.

| File              | Subject                         | Unsplash photo ID                  |
| ----------------- | ------------------------------- | ---------------------------------- |
| `uk.webp`         | Big Ben & Palace of Westminster | `photo-1486299267070-83823f5448dd` |
| `canada.webp`     | CN Tower & Toronto skyline      | `photo-1543962226-818f4301073f`    |
| `australia.webp`  | Sydney Opera House at night     | `photo-1523059623039-a9ed027e7fad` |
| `uzbekistan.webp` | Registan, Samarkand             | `photo-1664602078796-68ee76b3fc59` |

Any photo page can be reached at `https://unsplash.com/photos/<id>`.

## Replacing an image

Keep the same filenames and the 16:10 aspect ratio. Two sizes per destination:

- `<slug>.webp` — 1000×625, quality 76 (used from `sm` breakpoint up)
- `<slug>-sm.webp` — 500×313, quality 72 (mobile)

The card crops with `object-cover`, so the monument should sit near the centre of
the frame or it will be cut off on narrow viewports.

If Axis Global commissions or licenses its own photography later, drop it in
here under the same names and nothing else needs to change.
