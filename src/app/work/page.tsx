import type { Metadata } from "next";
import { ProjectCard } from "@/components/cards/project-card";
import { CTASection } from "@/components/sections/cta-section";
import { Container, PageHero } from "@/components/ui/primitives";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Demonstration QA automation case studies focused on release, integration, and performance outcomes.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero eyebrow="WORK" title={<>Automation measured<br />in outcomes.</>} description="Three demonstration engagements show how architecture, implementation, and delivery integration connect to measurable release signals." />
        <p className="border-b border-line p-5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted md:px-10">Demonstration content / replace with verified client outcomes before publication</p>
        {projects.map((project) => <ProjectCard key={project.slug} project={project} headingLevel="h2" />)}
      </Container>
      <CTASection />
    </main>
  );
}
