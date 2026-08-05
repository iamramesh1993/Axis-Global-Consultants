import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/site/social-icons";
import { site, whatsappLink } from "@/lib/site";

const columns = [
  {
    heading: "Destinations",
    links: [
      { href: "/study/uk", label: "Study in the UK" },
      { href: "/study/canada", label: "Study in Canada" },
      { href: "/study/australia", label: "Study in Australia" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/about", label: "About us" },
      { href: "/guides", label: "Guides" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
];

const socials = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-line bg-ink relative mt-24 border-t">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + contact */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LogoMark />
              <span className="font-display text-lg leading-tight font-bold tracking-[-0.03em]">
                Axis Global
                <br />
                Consultants
              </span>
            </div>

            <p className="text-fg-muted mt-5 text-sm leading-relaxed">
              Overseas education advisory for Pakistani students. Published
              process, honest assessments, no commission-chasing.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg-muted hover:text-accent flex items-center gap-2.5 transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="text-fg-muted hover:text-accent flex items-center gap-2.5 transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {site.contact.phone}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-accent flex items-center gap-2.5 transition-colors"
              >
                <WhatsappIcon className="h-4 w-4 shrink-0" />
                Message us on WhatsApp
              </a>
            </div>

            <p className="text-fg-subtle mt-6 text-xs leading-relaxed">
              {site.contact.address.line1}
              <br />
              {site.contact.address.city}, {site.contact.address.country}
              <br />
              {site.contact.hours}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-eyebrow text-fg-subtle font-sans uppercase">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-fg-muted hover:text-fg text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-line mt-14 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fg-subtle text-xs">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="border-line text-fg-muted hover:border-accent/60 hover:text-accent grid h-9 w-9 place-items-center rounded-full border transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-fg-subtle mt-8 max-w-3xl text-[0.6875rem] leading-relaxed">
          Axis Global Consultants is an independent education advisory. We are
          not affiliated with any government department or visa authority.
          Admission and visa decisions rest entirely with the institution and
          the relevant immigration authority.
        </p>
      </div>
    </footer>
  );
}
