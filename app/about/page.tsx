import { Quote } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LeadCta } from "@/components/sections/lead-cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata = pageMetadata({
  title: "About Axis Global Consultants — our transparency promise",
  description:
    "Why we publish our process, state rejection risk up front, and turn away students we cannot honestly help. The transparency promise behind Axis Global Consultants.",
  path: "/about",
  ogTitle: "About us",
  ogSubtitle: "The transparency promise",
});

const promises = [
  {
    title: "We publish the process",
    body: "All seven stages, what each produces, and what we charge — on the website, before you contact us. If a step is not on that page, we do not do it.",
  },
  {
    title: "We state rejection risk",
    body: "Every shortlist row carries the risk, not just the entry requirement. A student who knows their odds makes a better decision than one who was told it would be fine.",
  },
  {
    title: "We date every number",
    body: "Every figure on this site carries the government source and the date we checked it. Immigration rules change several times a year and stale advice is the most common failure in this industry.",
  },
  {
    title: "We say no",
    body: "If your profile does not support what you are asking for, we will tell you at the free assessment stage. There is money in not saying that. We would rather have the referral.",
  },
  {
    title: "You always know your status",
    body: "A named advisor and a defined stage. You should never have to chase us to find out whether something was submitted.",
  },
  {
    title: "You pay third parties directly",
    body: "Visa fees, deposits and test fees go straight from you to the authority or institution. Nothing passes through us, so no margin can be hidden in it.",
  },
];

/**
 * Placeholder testimonials — replace with real, attributable quotes before
 * launch. Kept obviously marked so they cannot be mistaken for real ones.
 */
const testimonials = [
  {
    quote:
      "They told me my first choice was a waste of the application fee and explained exactly why. Nobody else had been straight with me like that.",
    name: "Placeholder — replace before launch",
    detail: "MSc, UK",
  },
  {
    quote:
      "Sab kuch pehle se bata diya tha — fees, timeline, risk. Koi surprise nahi tha.",
    name: "Placeholder — replace before launch",
    detail: "Undergraduate, Canada",
  },
  {
    quote:
      "I was about to enrol somewhere that would not have counted back home. They caught it before I paid the deposit.",
    name: "Placeholder — replace before launch",
    detail: "MBBS enquiry",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <PageHero
        eyebrow="About us"
        title="Built because the standard was so low."
        lead="Pakistani students deserve better than a brochure website, a “No.1 in Pakistan” banner and silence after the first meeting. That is a low bar, and clearing it properly is the entire business."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="panel">
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="Why we exist"
            title="The problem, stated plainly"
          />

          <div className="text-ink-muted mt-8 space-y-5 text-[1.0625rem] leading-[1.75]">
            <p>
              Overseas education advisory in Pakistan runs on an incentive
              problem. Advice is free, so it gets paid for somewhere else —
              usually by the institution with the largest recruitment
              commission. A student cannot see that, which means they cannot
              judge whether the shortlist in front of them was built for them or
              for the payout.
            </p>
            <p>
              The visible symptoms are always the same. A confident promise that
              you will definitely get in. A shortlist heavy on institutions you
              have never heard of. Fees that surface after you are committed.
              And then the silence — the part every student describes when they
              come to us second.
            </p>
            <p>
              The expensive part is not the wasted fee. It is the wasted year. A
              refusal in August means the next intake, another set of documents,
              and a student a year behind their classmates for a reason nobody
              explained.
            </p>
            <p className="text-ink">
              We do not think this requires a clever solution. It requires
              publishing things: the process, the fees, the risk, and the date
              the rules were last checked. Then doing what the published process
              says.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Our promise"
          title="Six commitments you can hold us to"
          lead="Specific enough to be broken, which is the point. A promise you cannot fail is not a promise."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((promise, i) => (
            <Reveal key={promise.title} delay={i * 0.05}>
              <div className="rounded-card border-line bg-card h-full border p-6">
                <h3 className="text-base font-bold tracking-[-0.015em]">
                  {promise.title}
                </h3>
                <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                  {promise.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <SectionHeader
          eyebrow="Students"
          title="What students say"
          lead="These are placeholder quotes while we collect real, attributable ones. We are not going to invent testimonials on a page about honesty."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.quote} delay={i * 0.06}>
              <figure className="rounded-card border-line-strong bg-page h-full border border-dashed p-6">
                <Quote className="text-brand/50 h-5 w-5" aria-hidden="true" />
                <blockquote className="text-ink-muted mt-4 text-sm leading-relaxed">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="border-line mt-5 border-t pt-4 text-xs">
                  <span className="text-ink-subtle block italic">
                    {testimonial.name}
                  </span>
                  <span className="text-ink-subtle mt-1 block">
                    {testimonial.detail}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="What we are not"
            title="Things we will not claim"
          />
          <ul className="mt-8 space-y-4">
            {[
              "We are not the “No.1 consultant in Pakistan”, and neither is anyone who says they are.",
              "We are not affiliated with any government department, embassy or visa authority.",
              "We cannot guarantee admission or a visa, because those decisions are not ours to make.",
              "We are not a visa agent and we do not offer any route that involves misrepresenting your circumstances.",
              "We do not have a hundred university partnerships to list, and we are not going to pad a page with logos.",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="bg-fg-subtle mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                />
                <p className="text-ink-muted text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <LeadCta
        title="Hold us to it."
        lead="Start with the free profile assessment. If we do not do what this page says, you will know inside a week."
      />
    </>
  );
}
