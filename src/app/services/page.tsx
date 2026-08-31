import type { Metadata } from "next";
import { Check } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { CTASection } from "@/components/sections/cta-section";
import { Container, PageHero, TechBadge } from "@/components/ui/primitives";
import { TestExecutionGrid } from "@/components/visuals/test-execution-grid";
import { faqItems } from "@/content/faq";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: "UI, API, CI/CD, performance, and QA architecture services designed around reliable software delivery.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHero eyebrow="SERVICES" title={<>Testing infrastructure<br />for modern software teams.</>} description="From audit to implementation, each engagement is designed around the release decision your team needs to make." />
        <div>
          {services.map((service, index) => (
            <section id={service.slug} key={service.slug} className="grid scroll-mt-24 border-b border-line lg:grid-cols-2">
              <div className={`p-5 md:p-10 lg:p-14 ${index % 2 ? "lg:order-2 lg:border-l" : "lg:border-r"}`}>
                <p className="font-mono text-[11px] tracking-[0.12em] text-accent">SERVICE / {service.number}</p>
                <h2 className="mt-8 text-section font-medium leading-[1.02] tracking-[-0.05em]">{service.title}</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{service.description}</p>
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-3 border-t border-line pt-3 text-sm leading-6">
                      <Check aria-hidden="true" className="mt-1 shrink-0 text-accent" size={14} /> {capability}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-2">
                  {service.technologies.map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
                </div>
                <p className="mt-10 border-l-2 border-accent pl-5 font-medium leading-7">{service.outcome}</p>
                <TrackLink href="/book" event="book_call_clicked" properties={{ location: `service_${service.slug}` }} className="mt-9 inline-flex min-h-12 items-center border border-accent bg-accent px-5 font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Discuss this service</TrackLink>
              </div>
              <div className={`flex items-center bg-panel p-5 md:p-10 ${index % 2 ? "lg:order-1" : ""}`}>
                <TestExecutionGrid label={`${service.title.toUpperCase()} / SIGNAL`} />
              </div>
            </section>
          ))}
        </div>
        <section className="border-b border-line p-5 md:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">FAQ / 05</p>
              <h2 className="mt-7 text-section font-medium tracking-[-0.05em]">Practical questions.</h2>
            </div>
            <div className="border-t border-line">
              {faqItems.map((item) => (
                <details key={item.question} className="group border-b border-line py-6">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-medium marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{item.question}<span className="float-right font-mono text-muted group-open:rotate-45">+</span></summary>
                  <p className="mt-5 max-w-2xl leading-7 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </Container>
      <CTASection title="Need a clearer automation plan?" description="Start with the release risks, suite health, and engineering constraints you have today." />
    </main>
  );
}
