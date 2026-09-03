import type { CSSProperties } from "react";
import { Braces, Gauge, GitBranch, MonitorCheck } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { ProjectCard } from "@/components/cards/project-card";
import { TeamCard } from "@/components/cards/team-card";
import { TextRise } from "@/components/motion/text-rise";
import { CTASection } from "@/components/sections/cta-section";
import { ServicesBento } from "@/components/sections/services-bento";
import { ButtonLink } from "@/components/ui/button-link";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/primitives";
import { CineTile } from "@/components/visuals/cine-tile";
import { QualityGraphClip, ReleasePipelineClip, TerminalClip } from "@/components/visuals/clips";
import { processStages } from "@/content/process";
import { projects } from "@/content/projects";
import { team } from "@/content/team";

const capabilities = [
  { title: "UI Automation", technologies: "Playwright / Cypress / Selenium", icon: MonitorCheck },
  { title: "API Testing", technologies: "REST / GraphQL / Integration", icon: Braces },
  { title: "CI/CD Testing", technologies: "GitHub Actions / GitLab CI / Jenkins", icon: GitBranch },
  { title: "Performance", technologies: "Load / Stress / Analysis", icon: Gauge },
];

export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <Container className="border-x-0 md:border-x">
        <section className="px-5 pt-24 pb-16 md:px-12 md:pt-36 md:pb-24 lg:px-16">
          <Eyebrow className="fade-up-delayed">AUTOMATED QUALITY / CONTINUOUS DELIVERY</Eyebrow>

          <h1 className="mt-12 max-w-[16ch] text-hero font-medium leading-[0.92] tracking-[-0.055em] md:mt-16">
            <TextRise text="Testing infrastructure built to ship." delay={120} />
          </h1>

          <p
            className="fade-up-delayed mt-10 max-w-md text-lg leading-8 text-muted md:text-xl"
            style={{ "--rise-delay": "520ms" } as CSSProperties}
          >
            Automated testing built around your release process.
          </p>

          <div
            className="fade-up-delayed mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ "--rise-delay": "660ms" } as CSSProperties}
          >
            <TrackLink
              href="/book"
              event="book_call_clicked"
              properties={{ location: "homepage_hero" }}
              className="group/cta inline-flex items-center gap-3 text-[15px] font-medium text-accent transition-colors duration-500 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Book a call
              <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1">
                →
              </span>
            </TrackLink>
            <ButtonLink href="/work" variant="text" className="text-[15px] text-muted hover:text-ink">
              See our work
            </ButtonLink>
          </div>
        </section>

        {/* Three looping clips: the work itself, rather than a chart about it. */}
        <section aria-label="How the system behaves" className="grid gap-10 px-5 pb-24 md:grid-cols-3 md:gap-8 md:px-12 md:pb-32 lg:px-16">
          <CineTile caption="Fast Feedback Loops" index={0}>
            <TerminalClip />
          </CineTile>
          <CineTile caption="High Code Quality" index={1}>
            <QualityGraphClip />
          </CineTile>
          <CineTile caption="Complete Release Control" index={2}>
            <ReleasePipelineClip />
          </CineTile>
        </section>
      </Container>

      <Container>
        <Section className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
            <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.04em]">Built for teams that ship software, not test reports.</h2>
            <p className="mt-6 max-w-lg leading-7 text-muted">We build test automation around your engineering workflow, product architecture, and release process.</p>
          </div>
          <div className="grid sm:grid-cols-2">
            {capabilities.map(({ title, technologies, icon: Icon }, index) => (
              <div
                key={title}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                className="group relative overflow-hidden border-b border-line p-5 transition-colors duration-500 even:border-l hover:bg-panel/70 sm:p-8 [&:nth-last-child(-n+2)]:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <Icon
                  aria-hidden="true"
                  size={21}
                  strokeWidth={1.5}
                  className="transition-[color,transform] duration-500 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
                <h3 className="mt-10 text-lg font-medium">{title}</h3>
                <p className="mt-3 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-muted">{technologies}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="SERVICES / 05" title="What we automate." description="Focused systems for browser, service, delivery, performance, and quality architecture work." />
          <div className="px-5 pb-20 md:px-10 md:pb-28">
            <ServicesBento />
          </div>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="SELECTED WORK / 03" title="Automation measured in outcomes." description="Demonstration case studies showing how we structure release, integration, and performance engagements." />
          <div className="flex flex-col gap-5 px-5 pb-20 md:gap-6 md:px-10 md:pb-28">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="PROCESS / 06" title="A pipeline, not a pile of tests." description="Each stage produces a concrete engineering output and a clearer release signal." />
          <ol className="grid border-t border-line md:grid-cols-3 lg:grid-cols-6">
            {processStages.map((stage, index) => (
              <li
                key={stage.number}
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
                className="group relative border-b border-line p-5 transition-colors duration-500 last:border-b-0 hover:bg-panel/70 md:border-r md:last:border-r-0 lg:border-b-0 lg:p-6"
              >
                <span className="font-mono text-[10px] tracking-[0.12em] text-accent">{stage.number}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <h3 className="mt-12 text-lg font-medium tracking-[-0.03em]">{stage.shortTitle}</h3>
                <p className="mt-4 text-sm leading-6 text-muted">{stage.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="TEAM / 02" title="Small team. Engineering first." description="Two senior QA engineers doing the work directly — no account layer, no handover to juniors." />
          <div className="grid items-start gap-5 border-t border-line p-5 md:gap-6 md:p-8 lg:grid-cols-2 lg:p-10">
            {team.map((member, index) => <TeamCard key={member.slug} member={member} index={index} />)}
          </div>
          <div className="border-t border-line p-5 md:px-10">
            <ButtonLink href="/team" variant="text">
              Full profiles, background and credentials →
            </ButtonLink>
          </div>
        </Section>
      </Container>

      <CTASection />
    </main>
  );
}
