import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy", description: "Placeholder privacy information for the booking and analytics configuration.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero eyebrow="PRIVACY" title="A clear placeholder for company-specific legal review." description="This page describes the intended data flows but must be reviewed and replaced with company-specific legal information before launch." />
        <div className="grid border-b border-line lg:grid-cols-[0.6fr_1.4fr]">
          <aside className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Status / legal review required</p></aside>
          <div className="space-y-12 p-5 md:p-10 lg:p-14">
            <LegalSection title="Information processed"><p>This site does not currently include a custom lead form or enabled analytics provider. If analytics is enabled later, the selected provider and its data handling must be documented here.</p></LegalSection>
            <LegalSection title="Booking provider"><p>When a Cal.com URL is configured, the booking experience is provided by Cal.com. Information entered into that calendar is processed by the booking provider and the account owner under their respective terms.</p></LegalSection>
            <LegalSection title="Contact"><p>Replace this placeholder contact with the company&apos;s verified privacy contact before launch. Current configuration: <a className="text-accent hover:underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p></LegalSection>
            <LegalSection title="Required review"><p>Company identity, jurisdiction, retention periods, legal basis, processor details, data-subject rights, and effective dates have not been established in this placeholder and no compliance claim is made.</p></LegalSection>
          </div>
        </div>
      </Container>
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-2xl font-medium tracking-[-0.035em]">{title}</h2><div className="mt-4 max-w-3xl leading-8 text-muted">{children}</div></section>;
}
