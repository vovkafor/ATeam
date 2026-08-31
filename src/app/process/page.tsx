import type { Metadata } from "next";
import { CTASection } from "@/components/sections/cta-section";
import { Container, Eyebrow, PageHero } from "@/components/ui/primitives";
import { PipelineDiagram } from "@/components/visuals/pipeline-diagram";
import { processStages } from "@/content/process";

export const metadata: Metadata = {
  title: "Process",
  description: "A six-stage QA automation process from discovery and architecture through CI/CD and continuous improvement.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero eyebrow="PROCESS" title={<>Automation is a system,<br />not a collection of tests.</>} description="The work moves from evidence to strategy, architecture, implementation, delivery integration, and measurable improvement." />
        <section className="grid border-b border-line lg:grid-cols-[0.65fr_1.35fr]">
          <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
            <Eyebrow>ENGINEERING PIPELINE</Eyebrow>
            <h2 className="mt-7 text-3xl font-medium tracking-[-0.04em]">Signals where release decisions happen.</h2>
          </div>
          <div className="p-5 md:p-10"><PipelineDiagram /></div>
        </section>
        <ol>
          {processStages.map((stage) => (
            <li key={stage.number} className="grid border-b border-line lg:grid-cols-[0.28fr_0.72fr]">
              <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
                <p className="font-mono text-sm text-accent">{stage.number}</p>
                <h2 className="mt-7 text-3xl font-medium tracking-[-0.04em]">{stage.title}</h2>
                <p className="mt-5 leading-7 text-muted">{stage.description}</p>
              </div>
              <dl className="grid sm:grid-cols-3">
                <ProcessDetail label="Required information" value={stage.inputs} />
                <ProcessDetail label="Client receives" value={stage.deliverable} />
                <ProcessDetail label="Expected outcome" value={stage.outcome} />
              </dl>
            </li>
          ))}
        </ol>
      </Container>
      <CTASection title="Put quality into the release path." description="Start with the current workflow, the decisions it cannot support, and the risks that matter most." />
    </main>
  );
}

function ProcessDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-8">
      <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-6 leading-7">{value}</dd>
    </div>
  );
}
