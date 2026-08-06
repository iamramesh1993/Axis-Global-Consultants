/**
 * Hero backdrop: a dotted globe with an airliner climbing away from it on a
 * blue trail.
 *
 * Drawn rather than an image — crisp at any size, no network request, and the
 * dot tint stays locked to --brand-tint so it can never fight the headline for
 * contrast.
 *
 * Positioning is deliberate: the globe sits under the right-hand hero column so
 * its body falls behind the status card, while the trail and plane climb out to
 * the card's upper-left where there is clear space. On mobile it shifts right
 * and fades, becoming texture rather than a subject.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="absolute -top-24 -right-32 h-[36rem] w-[36rem] opacity-70 sm:-right-16 lg:top-[-3rem] lg:right-[1%] lg:h-[42rem] lg:w-[42rem] lg:opacity-100"
        viewBox="0 0 480 480"
        fill="none"
      >
        <defs>
          <pattern
            id="globe-dots"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.8" cy="1.8" r="1.8" fill="var(--brand-tint)" />
          </pattern>
          <radialGradient id="globe-fade" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="72%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="globe-mask">
            <circle cx="250" cy="255" r="205" fill="url(#globe-fade)" />
          </mask>
        </defs>

        {/* Dotted sphere */}
        <g mask="url(#globe-mask)">
          <circle cx="250" cy="255" r="205" fill="url(#globe-dots)" />
        </g>

        {/* Graticule */}
        <g
          stroke="var(--brand-tint)"
          strokeWidth="1.6"
          fill="none"
          opacity="0.95"
        >
          <circle cx="250" cy="255" r="205" />
          <ellipse cx="250" cy="255" rx="205" ry="80" />
          <ellipse cx="250" cy="255" rx="205" ry="155" />
          <ellipse cx="250" cy="255" rx="78" ry="205" />
          <ellipse cx="250" cy="255" rx="152" ry="205" />
        </g>
      </svg>

      {/*
        Plane and trail live in their own SVG so they can be placed in the clear
        band between the header and the top of the status card. Inside the globe
        SVG they always ended up behind the card. xl-only: below that width the
        band is too short to hold them without touching the headline.
      */}
      <svg
        className="absolute top-[4.25rem] right-[5%] hidden h-28 w-[28rem] xl:block"
        viewBox="0 0 448 112"
        fill="none"
      >
        <path
          d="M4 104C86 96 168 70 244 36c26-12 52-22 78-30"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M244 36c26-12 52-22 78-30"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
        <g
          transform="translate(340 8) rotate(-20) scale(1.5)"
          fill="var(--brand)"
        >
          <path d="M-30 1.2c0-1.5 1-2.4 2.6-2.6l24-1.5 8-9.4c.8-.9 1.8-1.2 2.6-.7.9.5 1 1.5.5 2.6l-4.4 8.2 12.4-.5c2.2-.1 3.4.7 3.4 2.1s-1.2 2.3-3.4 2.3l-12.4-.4 4.4 8.2c.5 1.1.4 2.1-.5 2.6-.8.5-1.8.2-2.6-.7l-8-9.4-24-1.6C-29 3.6-30 2.7-30 1.2Z" />
          <path d="M-6 0-18 14.5h5.5L2 2.4Z" opacity="0.7" />
          <path d="M-24 0-30-7h3.6l5.6 6.4Z" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
