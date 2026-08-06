/**
 * Hero backdrop: a dotted globe watermark.
 *
 * Deliberately drawn rather than an image — it stays crisp at any size, adds no
 * network request, and the tint stays locked to --brand-tint so it can never
 * fight the foreground text for contrast.
 *
 * The plane motif lives in the logo instead of here: at this layout density any
 * hero flight path either hides behind the status card or crosses the headline.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Dotted globe, top-right */}
      <svg
        className="absolute -top-16 -right-24 h-[34rem] w-[34rem] md:-right-10 lg:right-[6%] lg:h-[38rem] lg:w-[38rem]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <defs>
          <pattern
            id="globe-dots"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.6" cy="1.6" r="1.6" fill="var(--brand-tint)" />
          </pattern>
          <radialGradient id="globe-fade" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="globe-mask">
            <circle cx="200" cy="200" r="185" fill="url(#globe-fade)" />
          </mask>
        </defs>

        <g mask="url(#globe-mask)">
          <circle cx="200" cy="200" r="185" fill="url(#globe-dots)" />
        </g>

        {/* Latitude/longitude hints */}
        <g
          stroke="var(--brand-tint)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.9"
        >
          <circle cx="200" cy="200" r="185" />
          <ellipse cx="200" cy="200" rx="185" ry="72" />
          <ellipse cx="200" cy="200" rx="185" ry="140" />
          <ellipse cx="200" cy="200" rx="70" ry="185" />
          <ellipse cx="200" cy="200" rx="138" ry="185" />
        </g>
      </svg>
    </div>
  );
}
