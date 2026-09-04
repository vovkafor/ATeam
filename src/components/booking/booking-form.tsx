"use client";

import { CalendarDays, Loader2, Send } from "lucide-react";
import { BookingFileInput } from "@/components/booking/booking-file-input";
import type { BookingState } from "@/lib/booking/types";

const fieldClass =
  "mt-2 min-h-12 w-full border border-line bg-transparent px-4 text-sm outline-none transition-[border-color,box-shadow] duration-500 placeholder:text-strong focus:border-accent focus:ring-1 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50";

const labelClass = "block font-mono text-[10px] uppercase tracking-[0.12em] text-strong";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs leading-5 text-signal-fail">
      {message}
    </p>
  );
}

export function BookingForm({
  action,
  state,
  pending,
  dateValue,
  timeValue,
  timeZone,
  slotSummary,
}: {
  action: (payload: FormData) => void;
  state: BookingState;
  pending: boolean;
  /** `YYYY-MM-DD` in the team's timezone. */
  dateValue: string;
  timeValue: string;
  timeZone: string;
  slotSummary: string;
}) {
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const formError = state.status === "error" && Object.keys(errors).length === 0 ? state.message : undefined;

  return (
    <form className="p-6 md:p-8" action={action} noValidate>
      {/* The slot lives in the calendar panel; these carry it with the submission. */}
      <input type="hidden" name="date" value={dateValue} />
      <input type="hidden" name="time" value={timeValue} />
      <input type="hidden" name="timezone" value={timeZone} />
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
        defaultValue=""
      />

      <div className="flex items-start gap-3 border-b border-line pb-5">
        <CalendarDays aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={19} strokeWidth={1.5} />
        <div>
          <p className="font-medium">{slotSummary}</p>
          <p className="mt-1 text-sm text-muted">{timeZone.replace("_", " ")}</p>
        </div>
      </div>

      <div className="mt-6">
        <label className={labelClass} htmlFor="booking-name">Name</label>
        <input
          id="booking-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          disabled={pending}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "booking-name-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="booking-name-error" message={errors.name} />
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="booking-email">Email</label>
        <input
          id="booking-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "booking-email-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="booking-email-error" message={errors.email} />
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="booking-company">
          Company <span className="text-strong">(optional)</span>
        </label>
        <input
          id="booking-company"
          name="company"
          autoComplete="organization"
          placeholder="Where you work"
          disabled={pending}
          className={fieldClass}
        />
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="booking-challenge">What does your team check by hand today?</label>
        <textarea
          id="booking-challenge"
          name="challenge"
          required
          rows={4}
          placeholder="Sign-up, checkout, the admin panel before every release…"
          disabled={pending}
          aria-invalid={Boolean(errors.challenge)}
          aria-describedby={errors.challenge ? "booking-challenge-error" : undefined}
          className="mt-2 w-full resize-y border border-line bg-transparent p-4 text-sm leading-6 outline-none transition-[border-color,box-shadow] duration-500 placeholder:text-strong focus:border-accent focus:ring-1 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <FieldError id="booking-challenge-error" message={errors.challenge} />
      </div>

      <BookingFileInput disabled={pending} serverError={errors.file} />

      <button
        type="submit"
        disabled={pending}
        className="group/btn relative mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden bg-accent px-5 font-medium text-white transition-[background-color,opacity] duration-500 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50"
      >
        {pending ? null : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
          />
        )}
        {pending ? (
          <Loader2 aria-hidden="true" size={16} className="relative animate-spin" />
        ) : (
          <Send aria-hidden="true" size={16} className="relative" />
        )}
        <span className="relative">{pending ? "Confirming your slot…" : "Confirm booking"}</span>
      </button>

      <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs leading-5 text-muted">
        {pending ? "Sending your confirmation and calendar invite…" : "You'll get a confirmation email with the meeting link and a calendar invite."}
      </p>

      {formError ? (
        <p role="alert" className="mt-3 border border-signal-fail/30 bg-signal-fail/[0.06] p-3 text-center text-sm leading-6 text-signal-fail">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
