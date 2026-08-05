import { Check, Clock, FileText, X } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FaqList } from "@/components/ui/faq";
import { LeadCta } from "@/components/sections/lead-cta";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { stages } from "@/lib/site";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "How it works", path: "/how-it-works" },
];

export const metadata = pageMetadata({
  title: "How it works — our published seven-stage process",
  description:
    "The seven stages of an Axis Global application, what happens in each, what we charge and what we do not charge for. Published before you commit to anything.",
  path: "/how-it-works",
  ogTitle: "How it works",
  ogSubtitle: "Seven stages, published fees, no surprises",
});

/** What actually happens in each stage, and what you get out of it. */
const stageDetail: Record<
  string,
  { does: string[]; output: string; typical: string }
> = {
  profile: {
    does: [
      "Read your transcripts, test scores and any gaps in study",
      "Establish your real budget, including the visa financial thresholds",
      "Tell you plainly which destinations are realistic and which are not",
    ],
    output:
      "A written profile assessment you keep, whether or not you continue",
    typical: "2–4 working days",
  },
  shortlist: {
    does: [
      "Build a ranked list of reach, match and safe options",
      "State the rejection risk on each one, not just the entry requirements",
      "Cross-check post-study work rights against what you actually want to do",
    ],
    output: "A shortlist document with costs, deadlines and risk on every row",
    typical: "3–7 working days",
  },
  documents: {
    does: [
      "Give you a checklist you can see, so nothing is a surprise",
      "Review your statement of purpose — as an editor, not a ghostwriter",
      "Structure your financial evidence around the 28-day and threshold rules",
    ],
    output: "A complete, checked application pack per institution",
    typical: "2–5 weeks, mostly depending on you",
  },
  applied: {
    does: [
      "Submit each application and log every reference number",
      "Chase institutions when they go quiet",
      "Keep one status you can ask about at any time",
    ],
    output: "Confirmation and reference number for every submission",
    typical: "Ongoing",
  },
  offer: {
    does: [
      "Lay conditional and unconditional offers side by side",
      "Compare total cost, not just tuition",
      "Tell you if an offer is worse than it looks",
    ],
    output: "A written comparison so you decide on the numbers",
    typical: "2–12 weeks after applying",
  },
  visa: {
    does: [
      "Prepare financial evidence against the current published thresholds",
      "Run credibility or Genuine Student interview practice with you",
      "Assemble and check the full submission pack before it goes",
    ],
    output: "A visa application we are willing to put our name to",
    typical: "3–8 weeks including the decision",
  },
  departure: {
    does: [
      "Help with accommodation, airport pickup and the arrival checklist",
      "Brief you on registration, banking and SIM in your first week",
      "Stay reachable after you land",
    ],
    output: "A departure pack and a contact who answers after you arrive",
    typical: "2–6 weeks before travel",
  },
};

const included = [
  "Profile assessment and honest fit advice",
  "University shortlisting with rejection risk stated",
  "Application submission and follow-up",
  "SOP and personal statement editing",
  "Financial documentation structuring",
  "Visa application preparation and interview practice",
  "Pre-departure briefing and arrival support",
];

const notIncluded = [
  "Government visa fees, health surcharges and biometrics — paid by you, directly to the authority",
  "University application fees and tuition deposits — paid by you, directly to the institution",
  "English test fees (IELTS, PTE, TOEFL) and MDCAT",
  "Document attestation, courier and translation charges",
  "Flights, accommodation deposits and insurance",
];

const faqs = [
  {
    q: "What do you charge for a student consultation?",
    a: "The profile assessment is free and you keep the written output whether or not you continue with us. Beyond that, our service fee depends on the destination and the number of applications, and we quote it in writing before you commit to anything. We will not begin chargeable work without a signed quote in your hands.",
  },
  {
    q: "Do you get commission from universities?",
    a: "Some institutions pay recruitment commission, which is standard across the industry worldwide. What matters is that it does not change our advice: our shortlists are ranked on fit and rejection risk, and we will tell you when a non-commission option is the better choice for you. If you ask us whether a particular institution pays us, we will answer straight.",
  },
  {
    q: "Can you guarantee my visa or admission?",
    a: "No, and neither can anyone else. Admission decisions belong to the institution and visa decisions belong to the immigration authority. Anyone guaranteeing either is either misinformed or lying to you. What we can do is tell you honestly what your odds look like before you spend money, and make sure the application does not fail on something avoidable.",
  },
  {
    q: "What happens if my visa is refused?",
    a: "We tell you exactly why, in writing, including whether it was avoidable. Where a reapplication is realistic we prepare it, and where the refusal reason means it is not, we say so rather than taking another fee. Refusal handling is part of the service, not an upsell.",
  },
  {
    q: "How long does the whole process take?",
    a: "Plan on six to nine months from first conversation to departure for a normal application. It can be compressed to three or four months for a late intake, but compressed applications carry a materially higher refusal risk — mostly because of the funds-holding rules. We will tell you when we think you should wait for the next intake.",
  },
  {
    q: "Do you write my statement of purpose for me?",
    a: "No. We edit, structure and challenge your draft, but the words stay yours. Agent-written statements are detectable, and both UK credibility interviews and Australia's Genuine Student requirement are specifically designed to catch them. A statement you cannot defend in an interview is worse than a plain one you can.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        eyebrow="The process"
        title="Our whole process, published before you commit."
        lead="Seven stages. What happens in each, what you get out of it, how long it usually takes, and exactly what we do and do not charge for."
        breadcrumbs={breadcrumbs}
      />

      {/* Stage-by-stage detail */}
      <Section tone="raised">
        <SectionHeader
          eyebrow="Stage by stage"
          title="Where your file goes, and what comes out of it"
        />

        <ol className="mt-12 space-y-5">
          {stages.map((stage, i) => {
            const detail = stageDetail[stage.key];
            return (
              <Reveal as="li" key={stage.key} delay={i * 0.04}>
                <div className="rounded-card border-line bg-ink border p-6 md:p-8">
                  <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    <div className="lg:w-72 lg:shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="bg-accent font-display text-on-accent grid h-8 w-8 place-items-center rounded-full text-xs font-bold">
                          {stage.n}
                        </span>
                        <h3 className="font-display text-xl font-semibold tracking-tight">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-fg-muted mt-4 text-sm leading-relaxed">
                        {stage.blurb}
                      </p>
                      {detail && (
                        <p className="text-fg-subtle mt-4 inline-flex items-center gap-2 text-xs">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          Typically {detail.typical}
                        </p>
                      )}
                    </div>

                    {detail && (
                      <div className="border-line flex-1 border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                        <p className="text-eyebrow text-fg-subtle font-sans uppercase">
                          What we do
                        </p>
                        <ul className="mt-4 space-y-2.5">
                          {detail.does.map((item) => (
                            <li key={item} className="flex gap-3">
                              <Check
                                className="text-accent mt-0.5 h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-fg-muted text-sm leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="bg-accent/[0.07] mt-5 flex gap-3 rounded-xl px-4 py-3">
                          <FileText
                            className="text-accent mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-relaxed">
                            <span className="text-fg-subtle">You get: </span>
                            {detail.output}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* Fees — the honest section */}
      <Section>
        <SectionHeader
          eyebrow="Fees"
          title="What we charge, and what we don't"
          lead="The profile assessment is free and yours to keep. Everything chargeable is quoted in writing before it starts — there is no “free consultation” here that turns into a bill later."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-card border-accent/30 bg-accent/[0.05] h-full border p-6 md:p-8">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Included in our service fee
              </h3>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check
                      className="text-accent mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-fg-muted text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-card border-line bg-ink-raised/50 h-full border p-6 md:p-8">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Third-party costs you pay directly
              </h3>
              <p className="text-fg-subtle mt-3 text-sm">
                These never pass through us. You pay the authority or
                institution yourself, so nobody can add a margin you cannot see.
              </p>
              <ul className="mt-6 space-y-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex gap-3">
                    <X
                      className="text-fg-subtle mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-fg-muted text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <p className="rounded-card border-line bg-ink-raised/40 text-fg-muted mx-auto mt-8 max-w-3xl border px-6 py-5 text-sm leading-relaxed">
            <span className="text-fg font-medium">
              Our service fee is quoted per case, not per brochure.
            </span>{" "}
            It depends on the destination and how many applications you want,
            and you will have it in writing before any chargeable work begins.
            Ask us for the number in your first conversation — we will give it
            to you without a meeting first.
          </p>
        </Reveal>
      </Section>

      <Section tone="raised">
        <SectionHeader
          eyebrow="Questions"
          title="The ones people actually ask"
        />
        <div className="mt-10 max-w-3xl">
          <FaqList faqs={faqs} />
        </div>
      </Section>

      <LeadCta
        title="Start at stage one."
        lead="The profile assessment is free, written, and yours to keep. It is also the stage where we are most likely to tell you something you did not want to hear."
      />
    </>
  );
}
