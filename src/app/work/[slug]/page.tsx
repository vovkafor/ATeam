import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/sections/cta-section";
import { Container, Eyebrow, MetricGrid, TechBadge } from "@/components/ui/primitives";
import { PipelineDiagram } from "@/components/visuals/pipeline-diagram";
import { getProject, projects } from "@/content/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.clientType,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, images: [] },
    twitter: { title: project.title, description: project.summary, images: [] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main id="main-content">
      <Container>
        <article>
          <header className="grid border-b border-line lg:grid-cols-[0.65fr_1.35fr]">
            <div className="flex flex-col justify-between border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
              <Eyebrow>CASE STUDY / {project.number}</Eyebrow>
              <div className="pt-24">
                <p className="text-muted">{project.clientType}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Demonstration content</p>
              </div>
            </div>
            <div className="p-5 py-16 md:p-10 md:py-24">
              <h1 className="max-w-5xl text-hero font-medium leading-[0.98] tracking-[-0.055em]">{project.title}</h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{project.summary}</p>
            </div>
          </header>
          <MetricGrid metrics={project.metrics} />
          <CaseSection number="01" title="Challenge"><p>{project.challenge}</p></CaseSection>
          <CaseSection number="02" title="System before"><p>{project.before}</p></CaseSection>
          <CaseSection number="03" title="Approach"><BulletList items={project.approach} /></CaseSection>
          <CaseSection number="04" title="Implementation"><BulletList items={project.implementation} /></CaseSection>
          <section className="grid border-b border-line lg:grid-cols-2">
            <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
              <Eyebrow>SYSTEM / AFTER</Eyebrow>
              <h2 className="mt-7 text-3xl font-medium tracking-[-0.04em]">Quality signal in the delivery path.</h2>
              <div className="mt-10 flex flex-wrap gap-2">{project.technologies.map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}</div>
            </div>
            <div className="p-5 md:p-10"><PipelineDiagram /></div>
          </section>
          <CaseSection number="05" title="Result"><p>{project.result}</p></CaseSection>
          <CaseSection number="06" title="Lessons & improvements"><BulletList items={project.lessons} /></CaseSection>
        </article>
      </Container>
      <CTASection title="Build the next release signal." description="Use this demonstration structure as a starting point for a verified engagement and measurable outcomes." />
    </main>
  );
}

function CaseSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid border-b border-line lg:grid-cols-[0.65fr_1.35fr]">
      <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
        <Eyebrow>{number} / {title.toUpperCase()}</Eyebrow>
        <h2 className="mt-7 text-3xl font-medium tracking-[-0.04em]">{title}</h2>
      </div>
      <div className="max-w-3xl p-5 text-lg leading-8 text-muted md:p-10">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="space-y-4">{items.map((item) => <li key={item} className="border-t border-line pt-4 first:border-t-0 first:pt-0">{item}</li>)}</ul>;
}
