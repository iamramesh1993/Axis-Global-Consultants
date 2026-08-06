/**
 * Country flags, drawn rather than emoji.
 *
 * Emoji flags don't render on Windows Chrome at all, and an image per flag is
 * four more requests for 20px of artwork. These are simplified but recognisable,
 * and they inherit crisp edges at any size.
 */

type FlagProps = { className?: string };

const frame = "overflow-hidden rounded-[3px]";

export function UkFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      className={`${frame} ${className ?? ""}`}
    >
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0 0 60 30M60 0 0 30"
        stroke="#C8102E"
        strokeWidth="4"
        clipPath="url(#uk-clip)"
      />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function CanadaFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      className={`${frame} ${className ?? ""}`}
    >
      <rect width="60" height="30" fill="#fff" />
      <rect width="15" height="30" fill="#D80621" />
      <rect x="45" width="15" height="30" fill="#D80621" />
      {/* Simplified maple leaf */}
      <path
        d="M30 6.5l1.6 3.4 3.1-1.4-1 3.6 3.4.4-2.6 2.2 1.1 1.9-3.5-.5.4 4.2-2.5-2.1-2.5 2.1.4-4.2-3.5.5 1.1-1.9-2.6-2.2 3.4-.4-1-3.6 3.1 1.4z"
        fill="#D80621"
      />
    </svg>
  );
}

export function AustraliaFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      className={`${frame} ${className ?? ""}`}
    >
      <rect width="60" height="30" fill="#00247D" />
      {/* Union canton */}
      <g>
        <path d="M0 0 30 15M30 0 0 15" stroke="#fff" strokeWidth="3" />
        <path d="M15 0v15M0 7.5h30" stroke="#fff" strokeWidth="5" />
        <path d="M15 0v15M0 7.5h30" stroke="#C8102E" strokeWidth="3" />
      </g>
      {/* Commonwealth star */}
      <circle cx="15" cy="22.5" r="2.6" fill="#fff" />
      {/* Southern Cross, simplified */}
      <g fill="#fff">
        <circle cx="45" cy="6" r="1.5" />
        <circle cx="52" cy="12" r="1.7" />
        <circle cx="41" cy="15" r="1.4" />
        <circle cx="48" cy="21" r="1.6" />
        <circle cx="46" cy="13" r="1" />
      </g>
    </svg>
  );
}

export function UzbekistanFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      className={`${frame} ${className ?? ""}`}
    >
      <rect width="60" height="10" fill="#0099B5" />
      <rect y="10" width="60" height="10" fill="#fff" />
      <rect y="20" width="60" height="10" fill="#1EB53A" />
      <rect y="9.4" width="60" height="1.2" fill="#CE1126" />
      <rect y="19.4" width="60" height="1.2" fill="#CE1126" />
      {/* Crescent */}
      <circle cx="10" cy="5" r="3.4" fill="#fff" />
      <circle cx="11.6" cy="4.4" r="3.2" fill="#0099B5" />
      <g fill="#fff">
        <circle cx="17" cy="2.4" r="0.7" />
        <circle cx="17" cy="5.2" r="0.7" />
        <circle cx="17" cy="8" r="0.7" />
        <circle cx="21" cy="2.4" r="0.7" />
        <circle cx="21" cy="5.2" r="0.7" />
      </g>
    </svg>
  );
}

/** Slug → flag, so the destination card can stay data-driven. */
export const FLAGS: Record<string, (props: FlagProps) => React.ReactElement> = {
  uk: UkFlag,
  canada: CanadaFlag,
  australia: AustraliaFlag,
  uzbekistan: UzbekistanFlag,
};
