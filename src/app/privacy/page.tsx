import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container, PageHero } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What the booking form collects, where it goes, and what still needs legal review.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero
          eyebrow="PRIVACY"
          title="What we collect, in plain words."
          description="This page describes the data the site actually handles today. It still needs review against the company's jurisdiction and legal basis before launch."
        />
        <div className="grid border-b border-line lg:grid-cols-[0.6fr_1.4fr]">
          <aside className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Status / legal review required</p>
          </aside>
          <div className="space-y-12 p-5 md:p-10 lg:p-14">
            <LegalSection title="What the booking form collects">
              <p>
                Your name, email address, an optional company name, what you wrote about your testing, the slot and
                timezone you picked, and any file you chose to attach. Nothing else is requested, and the site sets no
                advertising or tracking cookies.
              </p>
            </LegalSection>
            <LegalSection title="Where it goes">
              <p>
                The booking is emailed to us and a confirmation with the meeting link and a calendar invite is emailed
                back to you. Delivery runs over our email provider; the attachment travels with that email. There is no
                third-party booking platform in the path.
              </p>
            </LegalSection>
            <LegalSection title="Contact">
              <p>
                To ask what we hold about you, or to have it deleted, write to{" "}
                <a className="text-accent hover:underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                .
              </p>
            </LegalSection>
            <LegalSection title="Still to be established">
              <p>
                Company identity, jurisdiction, retention periods, legal basis, processor details, data-subject rights
                and effective dates are not settled on this page, and no compliance claim is made until they are.
              </p>
            </LegalSection>
          </div>
        </div>
      </Container>
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-medium tracking-[-0.035em]">{title}</h2>
      <div className="mt-4 max-w-3xl leading-8 text-muted">{children}</div>
    </section>
  );
}
