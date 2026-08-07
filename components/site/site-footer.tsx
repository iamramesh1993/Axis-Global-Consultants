import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { WhatsappIcon } from "@/components/site/social-icons";
import { SocialLinks } from "@/components/site/social-links";
import { site, whatsappLink } from "@/lib/site";

const columns = [
  {
    heading: "Destinations",
    links: [
      { href: "/study/uk", label: "Study in the UK" },
      { href: "/study/canada", label: "Study in Canada" },
      { href: "/study/australia", label: "Study in Australia" },
      { href: "/study/uzbekistan", label: "Study in Uzbekistan" },
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

export function SiteFooter() {
  return (
    <footer className="border-line bg-page border-t">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
          {/* Brand + contact */}
          <div className="max-w-sm">
            <Logo height={48} />

            <p className="text-ink-muted mt-6 text-[0.9375rem] leading-relaxed">
              Overseas education advisory for Pakistani students. Published
              process, honest assessments, no commission-chasing.
            </p>

            <div className="mt-6 space-y-3 text-[0.9375rem]">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-ink-muted hover:text-brand flex items-center gap-3 transition-colors"
              >
                <Mail
                  className="text-brand h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="text-ink-muted hover:text-brand flex items-center gap-3 transition-colors"
              >
                <Phone
                  className="text-brand h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {site.contact.phone}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-brand flex items-center gap-3 transition-colors"
              >
                <WhatsappIcon className="text-brand h-4 w-4 shrink-0" />
                Message us on WhatsApp
              </a>
            </div>

            <p className="text-ink-subtle mt-6 text-sm leading-relaxed">
              {site.contact.address.street && (
                <>
                  {site.contact.address.street}
                  <br />
                </>
              )}
              {site.contact.address.city}, {site.contact.address.country}
              <br />
              {site.contact.hours}
              <br />
              {site.contact.meetingNote}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-eyebrow text-ink font-semibold uppercase">
                  {col.heading}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-ink-muted hover:text-brand text-[0.9375rem] transition-colors"
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
          <p className="text-ink-subtle text-sm">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <SocialLinks className="sm:items-end sm:text-right" />
        </div>

        <p className="text-ink-subtle mt-8 max-w-3xl text-xs leading-relaxed">
          Axis Global Consultants is an independent education advisory. We are
          not affiliated with any government department or visa authority.
          Admission and visa decisions rest entirely with the institution and
          the relevant immigration authority.
        </p>
      </div>
    </footer>
  );
}
