import type { Metadata } from "next";
import { Check, Clock3, Paperclip, Video } from "lucide-react";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { AGENDA, FILE_HINT, MEETING_DURATION_MINUTES } from "@/lib/booking/config";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Book a 30-minute conversation about your testing infrastructure, automation opportunities, and next steps.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <main id="main-content">
      <Container>
        <section className="grid border-b border-line lg:grid-cols-[0.65fr_1.35fr]">
          <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <Eyebrow>BOOK / {MEETING_DURATION_MINUTES} MINUTES</Eyebrow>
            <h1 className="mt-14 text-hero font-medium leading-[0.98] tracking-[-0.055em]">
              Let&apos;s talk about your testing infrastructure.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
              Book a focused conversation about where release confidence breaks down and where automation can create
              the strongest signal.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-5 text-sm text-muted">
              <span className="flex items-center gap-2">
                <Clock3 aria-hidden="true" size={15} /> {MEETING_DURATION_MINUTES} minutes
              </span>
              <span className="flex items-center gap-2">
                <Video aria-hidden="true" size={15} /> Video call
              </span>
            </div>

            <h2 className="mt-10 font-medium">We&apos;ll discuss</h2>
            <ul className="mt-5 space-y-3">
              {AGENDA.map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted">
                  <Check aria-hidden="true" className="shrink-0 text-accent" size={15} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-line bg-panel/60 p-5">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                <Paperclip aria-hidden="true" size={13} className="text-accent" /> Bring context
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Attach requirements, an architecture diagram or a recent test report and we&apos;ll review it before
                the call. {FILE_HINT}.
              </p>
            </div>
          </div>

          <div className="surface p-5 md:p-8 lg:p-10">
            <BookingCalendar provider="calcom" />
          </div>
        </section>
      </Container>
    </main>
  );
}
