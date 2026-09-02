"use client";

import { CalendarPlus, Check, Copy, Paperclip, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { AGENDA } from "@/lib/booking/config";
import { googleCalendarUrl } from "@/lib/booking/ics";
import type { BookingConfirmation } from "@/lib/booking/types";
import { trackEvent } from "@/lib/analytics";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-4 last:border-b-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-2 text-[15px] leading-6">{children}</dd>
    </div>
  );
}

export function BookingSuccess({
  confirmation,
  onReset,
}: {
  confirmation: BookingConfirmation;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent("booking_completed", {
      reference: confirmation.reference,
      provider: confirmation.meetingProvider,
      attachment: Boolean(confirmation.attachmentName),
    });
  }, [confirmation]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const calendarLink = googleCalendarUrl({
    start: new Date(confirmation.startsAt),
    end: new Date(confirmation.endsAt),
    summary: `QA consultation — A-Team × ${confirmation.name}`,
    description: `30-minute QA consultation.\n\nJoin: ${confirmation.meetingUrl}`,
    location: confirmation.meetingUrl,
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(confirmation.meetingUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="p-5 md:p-7" data-testid="booking-success">
      <div className="flex items-start gap-4 border-b border-line pb-6">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-gradient-to-br from-accent to-[#4a72ff] text-white shadow-[0_10px_24px_-12px_rgba(36,85,255,0.9)]"
        >
          <Check size={18} strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Booking confirmed</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em]" role="status">
            You&apos;re booked in, {confirmation.name.split(" ")[0]}.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {confirmation.emailsSkipped
              ? "Email delivery is not configured on this environment, so no confirmation was sent — the details are below."
              : `A confirmation with the calendar invite is on its way to ${confirmation.email}.`}
          </p>
        </div>
      </div>

      <dl className="mt-2">
        <Detail label="When">
          {confirmation.clientSlot}
          <span className="mt-1 block text-sm text-muted">
            {confirmation.businessSlot} — our time ({confirmation.businessTimeZone.replace("_", " ")})
          </span>
        </Detail>

        <Detail label={`${confirmation.meetingProvider} link`}>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={confirmation.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 break-all font-medium text-accent transition-colors duration-300 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Video aria-hidden="true" size={15} className="shrink-0" />
              {confirmation.meetingUrl}
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex min-h-8 items-center gap-1.5 border border-line px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              <Copy aria-hidden="true" size={12} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </Detail>

        {confirmation.attachmentName ? (
          <Detail label="Attachment received">
            <span className="inline-flex items-center gap-2 text-muted">
              <Paperclip aria-hidden="true" size={14} className="text-accent" />
              {confirmation.attachmentName}
            </span>
          </Detail>
        ) : null}

        <Detail label="Reference">
          <span className="font-mono text-sm">{confirmation.reference}</span>
        </Detail>
      </dl>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={calendarLink}
          target="_blank"
          rel="noreferrer"
          className="group/btn relative inline-flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden border border-accent bg-gradient-to-r from-accent to-[#4a72ff] px-5 font-medium text-white shadow-[0_10px_30px_-14px_rgba(36,85,255,0.95)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-14px_rgba(36,85,255,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
          />
          <CalendarPlus aria-hidden="true" size={16} className="relative" />
          <span className="relative">Add to calendar</span>
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-12 items-center justify-center border border-strong px-5 font-medium transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Book another slot
        </button>
      </div>

      <p className="mt-6 border-t border-line pt-5 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-muted">
        On the call: {AGENDA.join(" · ")}
      </p>
    </div>
  );
}
