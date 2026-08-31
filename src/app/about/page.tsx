import type { Metadata } from "next";
import { TeamCard } from "@/components/cards/team-card";
import { CTASection } from "@/components/sections/cta-section";
import { Container, PageHero, SectionHeader, TechBadge } from "@/components/ui/primitives";
import { team } from "@/content/team";

const principles = ["Reliability over test count", "Maintainability over cleverness", "Fast feedback over giant suites", "Automation where it creates value", "Quality belongs to the whole engineering team"];
const expertise = ["Playwright", "Cypress", "Selenium", "TypeScript", "Python", "REST", "GraphQL", "GitHub Actions", "GitLab CI", "Jenkins", "k6", "Grafana"];

export const metadata: Metadata = {
  title: "About",
  description: "A small, engineering-first QA automation team focused on maintainable release confidence.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero eyebrow="ABOUT" title={<>Small team.<br />Engineering first.</>} description="We treat automation as production infrastructure: explicit architecture, clear ownership, useful diagnostics, and maintenance planned from day one." />
        <section className="grid border-b border-line lg:grid-cols-2">
          <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r"><p className="eyebrow">PHILOSOPHY / 01</p><h2 className="mt-7 text-section font-medium tracking-[-0.05em]">Release confidence is an engineering problem.</h2></div>
          <div className="p-5 text-lg leading-8 text-muted md:p-10"><p>A useful QA system makes risk visible at the right moment. It does not chase test counts. It gives developers fast evidence, gives release owners a defensible signal, and stays maintainable as the product changes.</p></div>
        </section>
        <section className="border-b border-line">
          <SectionHeader eyebrow="TEAM / 04" title="Four focused engineering roles." description="The profiles below are centralized placeholders ready to be replaced with the real team and photography." />
          <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">{team.map((member) => <TeamCard key={member.name} member={member} />)}</div>
        </section>
        <section className="grid border-b border-line lg:grid-cols-2">
          <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r"><p className="eyebrow">EXPERTISE / 12</p><h2 className="mt-7 text-section font-medium tracking-[-0.05em]">Tools follow the system design.</h2></div>
          <div className="flex content-center flex-wrap gap-2 p-5 md:p-10">{expertise.map((item) => <TechBadge key={item}>{item}</TechBadge>)}</div>
        </section>
        <section className="border-b border-line">
          <SectionHeader eyebrow="PRINCIPLES / 05" title="How decisions get made." />
          <ol className="grid border-t border-line md:grid-cols-5">
            {principles.map((principle, index) => <li key={principle} className="border-b border-line p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:p-8"><span className="font-mono text-[10px] text-accent">0{index + 1}</span><p className="mt-12 text-lg font-medium leading-7">{principle}</p></li>)}
          </ol>
        </section>
      </Container>
      <CTASection title="Bring an engineering problem." description="We’ll bring a structured way to inspect it, prioritize it, and build a reliable quality signal around it." />
    </main>
  );
}
