import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";

const LAST_UPDATED = "2026-08-06";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy policy", path: "/privacy" },
];

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What data Axis Global Consultants collects through the assessment form, why, how long we keep it, and how to have it deleted.",
  path: "/privacy",
  ogTitle: "Privacy policy",
});

const sections = [
  {
    heading: "What we collect",
    body: [
      "When you submit the assessment form we collect your name, email address, phone number, highest qualification, target destination, intended intake, and optionally your budget range and any message you write.",
      "We also record how you arrived at the site — campaign parameters in the URL such as utm_source, or the referring domain — so we can tell which advertising is worth continuing.",
      "We may use Google Analytics 4 and the Meta Pixel to see how people find and use the site — which pages get read, and which adverts bring students here. These set cookies. They never receive anything you type into the assessment form, and you can block or clear them in your browser at any time.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To respond to your enquiry and prepare your profile assessment. That is the primary and, for most of this data, the only purpose.",
      "To understand which advertising reaches students who we can actually help.",
      "We do not sell your data, and we do not pass it to universities or third-party recruiters without asking you first, per application.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiry records are retained for up to 24 months from your last contact with us, after which they are deleted. If you become a client, we retain your file for as long as we are acting for you and for a reasonable period afterwards in case you return.",
    ],
  },
  {
    heading: "Where it is stored",
    body: [
      "Enquiries are stored in a managed Postgres database and notified to us by email. Both services are operated by third-party providers under their own security terms, and may store data outside Pakistan.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      `You can ask us to correct or delete your data at any time by emailing ${site.contact.email}. We will action deletion requests within 30 days and confirm when it is done.`,
      "You can ask us to stop contacting you and we will, without asking why.",
      "You can block or clear analytics cookies in your browser at any time. The site works fully without them.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about this policy should go to ${site.contact.email} or ${site.contact.phone}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lead="What we collect through the form, why, and how to make us delete it."
        breadcrumbs={breadcrumbs}
        meta={
          <p className="text-ink-subtle text-xs">
            Last updated {formatDate(LAST_UPDATED)}
          </p>
        }
      />

      <Section spacing="flushTop">
        <div className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.02em]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-ink-muted leading-[1.75]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
