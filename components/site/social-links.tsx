import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
} from "@/components/site/social-icons";
import { socials, socialNote } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TiktokIcon,
  linkedin: LinkedinIcon,
} as const;

/**
 * The social row, shared by the footer and the mobile drawer so the two can't
 * drift apart.
 *
 * Accounts that do not exist yet render as muted, non-interactive buttons with a
 * dashed border and an explicit label, not as links to a guessed URL. A dead
 * social link costs more trust than an absent one — and this brand's whole
 * position is not overstating what it has.
 *
 * The label goes in `aria-label` as well as `title`, because `title` does
 * nothing on touch devices, and a short note below the row carries the same
 * information for everyone.
 */
export function SocialLinks({ className }: { className?: string }) {
  const note = socialNote();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ul className="flex items-center gap-2">
        {socials.map(({ key, label, url, live }) => {
          const Icon = ICONS[key];

          return (
            <li key={key}>
              {live && url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-control border-line text-brand hover:border-brand hover:bg-brand hover:text-on-brand grid h-10 w-10 place-items-center border transition-colors"
                >
                  <Icon
                    className="h-[1.125rem] w-[1.125rem]"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <span
                  role="img"
                  aria-label={`${label} — coming soon`}
                  title={`${label} — coming soon`}
                  className="rounded-control border-line text-ink-subtle/60 grid h-10 w-10 cursor-default place-items-center border border-dashed"
                >
                  <Icon
                    className="h-[1.125rem] w-[1.125rem]"
                    aria-hidden="true"
                  />
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {note && (
        <p className="text-ink-subtle text-xs leading-relaxed">{note}</p>
      )}
    </div>
  );
}
