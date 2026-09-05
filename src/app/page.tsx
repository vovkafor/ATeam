import type { CSSProperties } from "react";
import { TrackLink } from "@/components/analytics/track-link";
import { TeamCard } from "@/components/cards/team-card";
import { TextRise } from "@/components/motion/text-rise";
import { CTASection } from "@/components/sections/cta-section";
import { ClientWall } from "@/components/sections/client-wall";
import { ServicesBento } from "@/components/sections/services-bento";
import { TrustSignals } from "@/components/sections/trust-signals";
import { ButtonLink } from "@/components/ui/button-link";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/primitives";
import { ManualVsAuto } from "@/components/visuals/manual-vs-auto";
import { ProcessGraph } from "@/components/visuals/process-graph";
import { processStages } from "@/content/process";
import { team } from "@/content/team";

export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <Container className="border-x-0 md:border-x">
        <section className="px-5 pt-24 pb-20 md:px-12 md:pt-36 md:pb-28 lg:px-16">
          <Eyebrow className="fade-up-delayed">A-TEAM / TEST AUTOMATION</Eyebrow>

          <h1 className="mt-12 max-w-[15ch] text-hero font-medium leading-[0.92] tracking-[-0.055em] md:mt-16">
            <TextRise text="We make your product test itself." delay={120} />
          </h1>

          <p
            className="fade-up-delayed mt-10 max-w-xl text-lg leading-8 text-muted md:text-xl"
            style={{ "--rise-delay": "520ms" } as CSSProperties}
          >
            A small QA team that takes the checks your product needs before every release — and turns them into
            something a machine does in minutes, on every change.
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
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1"
              >
                →
              </span>
            </TrackLink>
            <ButtonLink href="#how" variant="text" className="text-[15px] text-muted hover:text-ink">
              Show me what that means
            </ButtonLink>
          </div>
        </section>
      </Container>

      {/* The whole pitch in one screen, for someone who has only seen testing
          done by hand. Everything below is detail. */}
      <Container>
        <Section id="how">
          <SectionHeader
            eyebrow="WHAT AUTOMATION ACTUALLY IS"
            title="The same checks. Done by a machine."
            description="If your team still clicks through the app before every release, this is the difference — side by side, running as you read."
          />
          <ManualVsAuto />
        </Section>
      </Container>

      {/* Proof before the pitch: who we have done this for, and with what. */}
      <Container>
        <Section id="clients">
          <SectionHeader
            eyebrow="WHERE WE'VE WORKED"
            title="Products people actually use."
            description="Point at a company to see the skills that engagement used — the tools, the layer, the part that was hard."
          />
          <ClientWall />
        </Section>
      </Container>

      <Container>
        <Section id="services">
          <SectionHeader
            eyebrow="WHAT WE DO"
            title="Three things, done properly."
            description="Point at any of them to see what it looks like in practice."
          />
          <div className="px-5 pb-20 md:px-10 md:pb-28">
            <ServicesBento />
          </div>
        </Section>
      </Container>

      <Container>
        <Section id="process">
          <SectionHeader
            eyebrow="HOW WE WORK"
            title="Four steps, no mystery."
            description="You see working tests in the first weeks, and everything we write stays in your repository."
          />
          <div className="px-5 pb-20 md:px-10 md:pb-28" data-reveal="scale">
            <ProcessGraph stages={processStages} />
          </div>
        </Section>
      </Container>

      <Container>
        <Section id="team">
          <SectionHeader
            eyebrow="WHO YOU WORK WITH"
            title="The people doing the work."
            description="Two senior engineers on the team today, and growing. You talk to whoever writes your tests — never to an account manager who forwards it."
          />
          <div className="grid items-start gap-5 border-t border-line p-5 md:gap-6 md:p-8 lg:grid-cols-2 lg:p-10">
            {team.map((member, index) => (
              <TeamCard key={member.slug} member={member} index={index} />
            ))}
          </div>
          <div className="border-t border-line p-5 md:px-10">
            <ButtonLink href="/team" variant="text">
              Full profiles and background →
            </ButtonLink>
          </div>
        </Section>
      </Container>

      <Container>
        <TrustSignals />
      </Container>

      <CTASection />
    </main>
  );
}
