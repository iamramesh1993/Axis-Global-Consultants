import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";

const LAST_UPDATED = "2026-08-06";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Terms of use", path: "/terms" },
];

export const metadata = pageMetadata({
  title: "Terms of use",
  description:
    "Terms governing use of the Axis Global Consultants website, the limits of the information published here, and what we do and do not guarantee.",
  path: "/terms",
  ogTitle: "Terms of use",
});

const sections = [
  {
    heading: "About these terms",
    body: [
      `These terms govern your use of ${site.url}. They do not form an advisory agreement — engaging us for services is a separate written agreement with its own terms, which we provide before any chargeable work begins.`,
    ],
  },
  {
    heading: "The information on this site",
    body: [
      "We publish tuition ranges, living costs, visa fees and immigration requirements as a guide, and we date every figure and link the official source we checked it against.",
      "Immigration rules, fees and thresholds change frequently and sometimes without notice. The official government source always takes precedence over anything written here. Verify current requirements with the relevant authority before you rely on them for a decision involving money.",
      "Nothing on this site is legal or immigration advice, and reading it does not create an advisor-client relationship.",
    ],
  },
  {
    heading: "What we do not guarantee",
    body: [
      "We cannot guarantee admission to any institution. Admission decisions rest solely with the institution.",
      "We cannot guarantee a visa. Visa decisions rest solely with the relevant immigration authority.",
      "We cannot guarantee employment, post-study work rights, permanent residence, or any outcome that depends on a third party's decision.",
      "We are not affiliated with, endorsed by, or acting on behalf of any government department, embassy, high commission or visa authority.",
    ],
  },
  {
    heading: "Medical and regulated qualifications",
    body: [
      "Where we discuss studying medicine or dentistry abroad, recognition and licensing in Pakistan are governed by the Pakistan Medical & Dental Council, not by us and not by the foreign institution. Requirements including prior approval, accreditation and licensing examinations are set and changed by the regulator.",
      "You are responsible for verifying the current position with the regulator before enrolling. We will help you check it, but the obligation and the consequence are yours.",
    ],
  },
  {
    heading: "Your responsibilities",
    body: [
      "The information you give us must be accurate and complete. We do not submit applications containing statements we know or suspect to be false, and we will end an engagement rather than do so.",
      "Fees payable to institutions, immigration authorities and test providers are your responsibility and are paid by you directly to them.",
    ],
  },
  {
    heading: "Third-party links",
    body: [
      "We link to government and institutional websites for verification. We do not control their content and are not responsible for it.",
    ],
  },
  {
    heading: "Contact",
    body: [`Questions about these terms should go to ${site.contact.email}.`],
  },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        lead="What the information here is, what it is not, and what nobody in this industry can honestly guarantee."
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
