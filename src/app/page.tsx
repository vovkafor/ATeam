import { Braces, Gauge, GitBranch, MonitorCheck } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { ProjectCard } from "@/components/cards/project-card";
import { ServiceCard } from "@/components/cards/service-card";
import { TeamCard } from "@/components/cards/team-card";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button-link";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
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
        <section className="flex min-h-[560px] flex-col justify-between border-b border-line p-5 md:p-10 lg:min-h-[650px]">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-accent" />
            AUTOMATED QUALITY / CONTINUOUS DELIVERY
          </p>
          <div className="py-16 lg:py-8">
            <h1 className="max-w-[1050px] text-hero font-medium leading-[0.96] tracking-[-0.055em]">Testing infrastructure built to ship.</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted md:text-xl">We design and build automated testing systems that help engineering teams release reliable software faster.</p>
            <div className="mt-10 flex flex-col gap-3 min-[420px]:flex-row">
              <TrackLink href="/book" event="book_call_clicked" properties={{ location: "homepage_hero" }} className="inline-flex min-h-12 items-center justify-center border border-accent bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Book a call</TrackLink>
              <ButtonLink href="/work" variant="secondary">See our work</ButtonLink>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[10px] tracking-[0.12em] text-muted">
            <span>CI STATUS / PASSING</span>
            <span>RELEASE / READY</span>
          </div>
        </section>
      </Container>

      <Container>
        <Section className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
            <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.04em]">Built for teams that ship software, not test reports.</h2>
            <p className="mt-6 max-w-lg leading-7 text-muted">We build test automation around your engineering workflow, product architecture, and release process.</p>
          </div>
          <div className="grid sm:grid-cols-2">
            {capabilities.map(({ title, technologies, icon: Icon }) => (
              <div key={title} className="border-b border-line p-5 even:border-l sm:p-8 [&:nth-last-child(-n+2)]:border-b-0">
                <Icon aria-hidden="true" size={21} strokeWidth={1.5} />
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
            {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
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
            {processStages.map((stage) => (
              <li key={stage.number} className="relative border-b border-line p-5 last:border-b-0 md:border-r md:last:border-r-0 lg:border-b-0 lg:p-6">
                <span className="font-mono text-[10px] tracking-[0.12em] text-accent">{stage.number}</span>
                <h3 className="mt-12 text-lg font-medium tracking-[-0.03em]">{stage.shortTitle}</h3>
                <p className="mt-4 text-sm leading-6 text-muted">{stage.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      </Container>

      <Container>
        <Section>
          <SectionHeader eyebrow="TEAM / 04" title="Small team. Engineering first." description="Placeholder profiles keep the team structure ready for real biographies and photography." />
          <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => <TeamCard key={member.name} member={member} />)}
          </div>
        </Section>
      </Container>

      <CTASection />
    </main>
  );
}
