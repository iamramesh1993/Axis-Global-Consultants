import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Destinations } from "@/components/sections/destinations";
import { HowItWorksPreview } from "@/components/sections/how-it-works-preview";
import { WhyUs } from "@/components/sections/why-us";
import { GuidesPreview } from "@/components/sections/guides-preview";
import { LeadCta } from "@/components/sections/lead-cta";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${site.name} — Study in the UK, Canada, Australia & Uzbekistan`,
  description: site.description,
  path: "/",
  ogTitle: "Know exactly where you stand.",
  ogSubtitle: "Overseas education advisory for Pakistani students",
});

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Hero />
      <TrustStrip />
      <Destinations />
      <HowItWorksPreview />
      <WhyUs />
      <GuidesPreview />
      <LeadCta />
    </>
  );
}
