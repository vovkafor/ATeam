import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/primitives";

export function CTASection({
  title = "Have a testing problem worth solving?",
  description = "Let’s review your testing infrastructure and identify where automation can create the strongest release signal.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Container>
      <section className="grid border-b border-line bg-ink text-white lg:grid-cols-[1.35fr_0.65fr]">
        <div className="p-5 md:p-10 lg:p-16">
          <p className="font-mono text-[11px] tracking-[0.12em] text-white/55">NEXT RELEASE / START HERE</p>
          <h2 className="mt-12 max-w-4xl text-section font-medium leading-[1.02] tracking-[-0.05em]">{title}</h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{description}</p>
        </div>
        <div className="flex items-end border-t border-white/15 p-5 md:p-10 lg:border-l lg:border-t-0 lg:p-16">
          <ButtonLink href="/book" variant="inverse" className="w-full">
            Book a 30-minute call
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}
