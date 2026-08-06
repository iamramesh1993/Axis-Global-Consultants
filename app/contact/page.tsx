import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsappIcon } from "@/components/site/social-icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { site, whatsappLink } from "@/lib/site";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata = pageMetadata({
  title: "Book a free assessment",
  description:
    "Send us your grades, budget and timeline and get an honest written profile assessment within one working day. No obligation, no commission-chasing.",
  path: "/contact",
  ogTitle: "Book a free assessment",
  ogSubtitle: "An honest answer within one working day",
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <PageHero
        eyebrow="Free assessment"
        title="Tell us where you stand."
        lead="Fill this in and a real advisor reads it. You will hear back within one working day — and if we do not think we can help, we will tell you that instead of booking a meeting to sell you something else."
        breadcrumbs={breadcrumbs}
      />

      <Section className="pt-0 md:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Form first in the DOM: it is the point of the page, and on mobile
              it should be what you land on rather than the address block. */}
          <Reveal>
            <div className="rounded-card-lg border-line-strong bg-card border p-6 shadow-[var(--shadow-card)] md:p-8">
              <LeadForm />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.015em]">
                  Rather just message us?
                </h2>
                <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                  That is genuinely fine. WhatsApp is how most of our
                  conversations start.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-card border-line bg-card hover:border-brand/40 flex items-center gap-3 border px-5 py-4 transition-colors"
                  >
                    <WhatsappIcon className="text-brand h-5 w-5 shrink-0" />
                    <span className="text-sm">
                      <span className="block font-medium">WhatsApp</span>
                      <span className="text-ink-muted">
                        {site.contact.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                    className="rounded-card border-line bg-card hover:border-brand/40 flex items-center gap-3 border px-5 py-4 transition-colors"
                  >
                    <Phone
                      className="text-brand h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm">
                      <span className="block font-medium">Call</span>
                      <span className="text-ink-muted">
                        {site.contact.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`mailto:${site.contact.email}`}
                    className="rounded-card border-line bg-card hover:border-brand/40 flex items-center gap-3 border px-5 py-4 transition-colors"
                  >
                    <Mail
                      className="text-brand h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm">
                      <span className="block font-medium">Email</span>
                      <span className="text-ink-muted">
                        {site.contact.email}
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="rounded-card border-line bg-card border p-5">
                <h3 className="text-eyebrow text-ink-subtle uppercase">
                  Office
                </h3>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-ink-muted flex gap-3">
                    <MapPin
                      className="text-brand/70 mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {site.contact.address.line1}
                      <br />
                      {site.contact.address.city},{" "}
                      {site.contact.address.country}
                    </span>
                  </p>
                  <p className="text-ink-muted flex gap-3">
                    <Clock
                      className="text-brand/70 mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    {site.contact.hours}
                  </p>
                </div>
              </div>

              <div className="rounded-card border-brand/25 bg-brand/[0.05] border p-5">
                <h3 className="text-sm font-bold tracking-[-0.015em]">
                  What happens next
                </h3>
                <ol className="text-ink-muted mt-4 space-y-3 text-sm">
                  {[
                    "An advisor reads what you sent — not an autoresponder.",
                    "We WhatsApp or call you within one working day.",
                    "You get a written profile assessment you keep, free.",
                    "You decide whether to continue. No follow-up pressure.",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="bg-brand/20 text-brand grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.625rem] font-semibold">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
