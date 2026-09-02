import type { CSSProperties } from "react";
import { Braces, Gauge, GitBranch, MonitorCheck } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { ProjectCard } from "@/components/cards/project-card";
import { ServiceCard } from "@/components/cards/service-card";
import { TeamCard } from "@/components/cards/team-card";
import { ParallaxScene } from "@/components/motion/parallax-scene";
import { TextRise } from "@/components/motion/text-rise";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button-link";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/primitives";
import { HeroInstruments } from "@/components/visuals/hero-instruments";
import { processStages } from "@/content/process";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
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
      <Container>
        <ParallaxScene className="flex min-h-[560px] flex-col justify-between border-b border-line lg:min-h-[720px]">
          <section className="flex flex-1 flex-col justify-between p-5 md:p-10">
            <Eyebrow className="fade-up-delayed">AUTOMATED QUALITY / CONTINUOUS DELIVERY</Eyebrow>

            <div className="py-16 lg:py-10">
              <h1 className="max-w-[1050px] text-hero font-medium leading-[0.96] tracking-[-0.055em]">
                <TextRise text="Testing infrastructure built to ship." delay={120} />
              </h1>
              <p
                className="fade-up-delayed mt-8 max-w-xl text-lg leading-8 text-muted md:text-xl"
                style={{ "--rise-delay": "520ms" } as CSSProperties}
              >
                We design and build automated testing systems that help engineering teams release reliable software
                faster.
              </p>
              <div
                className="fade-up-delayed mt-10 flex flex-col gap-3 min-[420px]:flex-row"
                style={{ "--rise-delay": "660ms" } as CSSProperties}
              >
                <TrackLink
                  href="/book"
                  event="book_call_clicked"
                  properties={{ location: "homepage_hero" }}
                  className="group/btn relative inline-flex min-h-12 items-center justify-center overflow-hidden border border-accent bg-gradient-to-r from-accent to-[#4a72ff] px-5 font-medium text-white shadow-[0_10px_30px_-14px_rgba(36,85,255,0.95)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-14px_rgba(36,85,255,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
                  />
                  <span className="relative">Book a call</span>
                </TrackLink>
                <ButtonLink href="/work" variant="secondary">See our work</ButtonLink>
              </div>
            </div>
          </section>

          <div className="fade-up-delayed" style={{ "--rise-delay": "820ms" } as CSSProperties}>
            <HeroInstruments />
          </div>
        </ParallaxScene>
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
          <div className="grid border-t border-line lg:grid-cols-5">
            {services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
          </div>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="SELECTED WORK / 03" title="Automation measured in outcomes." description="Demonstration case studies showing how we structure release, integration, and performance engagements." />
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
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
          <div className="grid border-t border-line lg:grid-cols-2">
            {team.map((member, index) => <TeamCard key={member.name} member={member} index={index} />)}
          </div>
        </Section>
      </Container>

      <CTASection />
    </main>
  );
}
