/**
 * Hero backdrop: one dotted globe, treated as ambient texture.
 *
 * It bleeds deliberately off the right edge and is centred vertically on the
 * hero, so it reads as a full-bleed background rather than an object parked in
 * the corner. Everything is drawn from --brand at low opacity, which keeps the
 * tint on a single token and well below the headline and card in contrast.
 *
 * The plane is gone on purpose. At this layout density the status card occupies
 * the region any flight path would cross, so the arc either vanished behind the
 * card or ran off the top-right corner — which reads as a rendering bug rather
 * than a design choice. The plane motif already lives in the logo, prominently.
 *
 * Nothing here animates, so there is nothing for prefers-reduced-motion to
 * disable; the global rule in globals.css covers the rest of the hero.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/*
        Anchored to the right edge and vertically centred, with a controlled
        translate so the bleed is intentional and identical at every width.
      */}
      <svg
        className="absolute top-1/2 right-0 h-[34rem] w-[34rem] translate-x-[30%] -translate-y-1/2 opacity-[0.10] sm:h-[40rem] sm:w-[40rem] lg:translate-x-[20%] xl:h-[46rem] xl:w-[46rem]"
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
            <circle cx="1.9" cy="1.9" r="1.9" fill="var(--brand)" />
          </pattern>
          {/* Softens the sphere towards its edge so the bleed has no hard rim */}
          <radialGradient id="globe-fade" cx="46%" cy="44%" r="56%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="68%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="globe-mask">
            <circle cx="240" cy="240" r="230" fill="url(#globe-fade)" />
          </mask>
        </defs>

        <g mask="url(#globe-mask)">
          <circle cx="240" cy="240" r="230" fill="url(#globe-dots)" />

          {/* Graticule, inside the same mask so it fades out with the dots */}
          <g stroke="var(--brand)" strokeWidth="1.4" fill="none" opacity="0.55">
            <circle cx="240" cy="240" r="230" />
            <ellipse cx="240" cy="240" rx="230" ry="90" />
            <ellipse cx="240" cy="240" rx="230" ry="172" />
            <ellipse cx="240" cy="240" rx="88" ry="230" />
            <ellipse cx="240" cy="240" rx="170" ry="230" />
          </g>
        </g>
      </svg>
    </div>
  );
}
