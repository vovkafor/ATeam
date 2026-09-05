import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { TeamCard } from "@/components/cards/team-card";
import { ClientWall } from "@/components/sections/client-wall";
import { CTASection } from "@/components/sections/cta-section";
import { TrustSignals } from "@/components/sections/trust-signals";
import { Container, PageHero, SectionHeader } from "@/components/ui/primitives";
import { collaboration } from "@/content/trust";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The two QA engineers behind A-Team: mobile and web automation frameworks, and evaluation of AI and LLM systems. Apple Developer Academy background, 100% job success on Upwork.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero
          eyebrow="TEAM"
          title={
            <>
              The engineers
              <br />
              on the work.
            </>
          }
          description="Senior QA engineers with complementary ground: automation frameworks built from zero, and evaluation of AI-driven systems. The team is growing — you always work with the engineers directly."
        />

        <TrustSignals />

        <section className="border-b border-line" aria-label="Engineer profiles">
          <SectionHeader
            eyebrow="PROFILES / 02"
            title="Hover a card for the full picture."
            description="Each profile opens to the record behind the summary: the roles they came from, and what that engineer is distinctly good at."
          />
          <div className="grid items-start gap-5 border-t border-line p-5 md:gap-6 md:p-8 lg:grid-cols-2 lg:p-10">
            {team.map((member, index) => (
              <TeamCard key={member.slug} member={member} index={index} />
            ))}
          </div>
        </section>

        <section className="border-b border-line" aria-label="Where the team has worked">
          <SectionHeader
            eyebrow="TRACK RECORD"
            title="Where we&apos;ve worked."
            description="Point at a company to see the skills that engagement used."
          />
          <ClientWall />
        </section>

        <section className="border-b border-line" aria-label="How we work together">
          <SectionHeader eyebrow="COLLABORATION / 03" title={collaboration.title} description={collaboration.intro} />
          <ol className="grid border-t border-line lg:grid-cols-3">
            {collaboration.points.map((point, index) => (
              <li
                key={point.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                className="group relative border-b border-line p-5 transition-colors duration-500 last:border-b-0 hover:bg-panel/70 md:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="font-mono text-[10px] tracking-[0.12em] text-accent">0{index + 1}</span>
                <h3 className="mt-10 text-lg font-medium leading-tight tracking-[-0.03em]">{point.title}</h3>
                <p className="mt-4 leading-7 text-muted">{point.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <CTASection
        title="Work with the engineers, not an account manager."
        description="Bring the release you are least confident about and we'll tell you where the signal is missing."
      />
    </main>
  );
}
