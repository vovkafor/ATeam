import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { TrackLink } from "@/components/analytics/track-link";
import { CTASection } from "@/components/sections/cta-section";
import { Container, PageHero, TechBadge } from "@/components/ui/primitives";
import { ServiceVisual } from "@/components/visuals/service-visual";
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
        <PageHero
          eyebrow="SERVICES"
          title={<>Testing infrastructure<br />for modern software teams.</>}
          description="From audit to implementation, each engagement is designed around the release decision your team needs to make."
        />

        {/* Sticky service index — keeps all five reachable while reading one. */}
        <nav
          aria-label="Services index"
          className="glass sticky top-18 z-30 border-b border-line"
        >
          <ol className="flex overflow-x-auto">
            {services.map((service) => (
              <li key={service.slug} className="shrink-0 border-r border-line last:border-r-0">
                <a
                  href={`#${service.slug}`}
                  className="group flex items-center gap-2.5 px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors duration-500 hover:bg-accent/[0.06] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  <span aria-hidden="true" className="text-accent">{service.number}</span>
                  {service.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {services.map((service, index) => (
            <section id={service.slug} key={service.slug} className="grid scroll-mt-32 border-b border-line lg:grid-cols-2">
              <div className={`p-5 md:p-10 lg:p-14 ${index % 2 ? "lg:order-2 lg:border-l" : "lg:border-r"}`}>
                <p data-reveal className="font-mono text-[11px] tracking-[0.12em] text-accent">SERVICE / {service.number}</p>
                <h2 data-reveal className="mt-8 text-section font-medium leading-[1.02] tracking-[-0.05em]">{service.title}</h2>
                <p data-reveal style={{ "--reveal-delay": "90ms" } as CSSProperties} className="mt-7 max-w-xl text-lg leading-8 text-muted">
                  {service.description}
                </p>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {service.capabilities.map((capability, capabilityIndex) => (
                    <li
                      key={capability}
                      data-reveal
                      style={{ "--reveal-delay": `${capabilityIndex * 70}ms` } as CSSProperties}
                      className="group flex items-start gap-3 border-t border-line pt-3 text-sm leading-6 transition-colors duration-500 hover:border-accent/50"
                    >
                      <Check aria-hidden="true" className="mt-1 shrink-0 text-accent transition-transform duration-500 group-hover:scale-110" size={14} />
                      {capability}
                    </li>
                  ))}
                </ul>

                <div data-reveal className="mt-10 flex flex-wrap gap-2">
                  {service.technologies.map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
                </div>

                <p data-reveal className="mt-10 border-l-2 border-accent pl-5 font-medium leading-7">{service.outcome}</p>
              </div>

              {/* The visual column is sticky, so the infographic and its call to
                  action stay in view for the whole section without ever
                  overlapping the copy on the left. */}
              <div className={`surface flex items-start p-5 md:p-10 ${index % 2 ? "lg:order-1" : ""}`}>
                <div data-reveal={index % 2 ? "left" : "right"} className="w-full lg:sticky lg:top-32">
                  <ServiceVisual slug={service.slug} />

                  <TrackLink
                    href="/book"
                    event="book_call_clicked"
                    properties={{ location: `service_${service.slug}` }}
                    className="group/btn relative mt-5 inline-flex min-h-12 items-center overflow-hidden border border-accent bg-gradient-to-r from-accent to-[#4a72ff] px-5 font-medium text-white shadow-[0_12px_32px_-14px_rgba(36,85,255,0.95)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-14px_rgba(36,85,255,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
                    />
                    <span className="relative">Discuss this service</span>
                  </TrackLink>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="border-b border-line p-5 md:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div data-reveal>
              <p className="eyebrow">FAQ / 05</p>
              <h2 className="mt-7 text-section font-medium tracking-[-0.05em]">Practical questions.</h2>
            </div>
            <div className="border-t border-line">
              {faqItems.map((item, index) => (
                <details
                  key={item.question}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
                  className="group border-b border-line py-6 transition-colors duration-500 hover:border-accent/40"
                >
                  <summary className="cursor-pointer list-none pr-8 text-lg font-medium transition-colors duration-500 marker:hidden group-open:text-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    {item.question}
                    <span className="float-right font-mono text-muted transition-transform duration-500 group-open:rotate-45">+</span>
                  </summary>
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
