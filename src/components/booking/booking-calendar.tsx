"use client";

import Cal from "@calcom/embed-react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Mail } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

type BookingCalendarProps = {
  provider?: "calcom";
};

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const timeSlots = ["09:00", "11:30", "14:00", "16:30"];

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function getCalLink(bookingUrl: string) {
  try {
    const url = new URL(bookingUrl);
    if (!url.hostname.endsWith("cal.com")) return "";
    return url.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return bookingUrl.replace(/^https?:\/\/cal\.com\//, "").replace(/\/$/, "");
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isWeekday(date: Date) {
  return date.getDay() !== 0 && date.getDay() !== 6;
}

function nextAvailableDate(from: Date) {
  const date = startOfDay(from);
  date.setDate(date.getDate() + 1);
  while (!isWeekday(date)) date.setDate(date.getDate() + 1);
  return date;
}

function firstAvailableDateInMonth(month: Date, today: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const date = first < today ? startOfDay(today) : first;
  while (!isWeekday(date)) date.setDate(date.getDate() + 1);
  return date;
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - offset + 1;
    return day > 0 && day <= daysInMonth
      ? new Date(month.getFullYear(), month.getMonth(), day)
      : null;
  });
}

function subscribeToTimezone() {
  return () => undefined;
}

function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
}

function BookingPlanner() {
  const [today] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => nextAvailableDate(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [requestStarted, setRequestStarted] = useState(false);
  const timezone = useSyncExternalStore(subscribeToTimezone, getBrowserTimezone, () => "Local time");

  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoBack = visibleMonth > currentMonth;

  useEffect(() => {
    trackEvent("booking_calendar_loaded", { provider: "email" });
  }, []);

  function changeMonth(direction: -1 | 1) {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1);
    if (nextMonth < currentMonth) return;

    setVisibleMonth(nextMonth);
    setSelectedDate(firstAvailableDateInMonth(nextMonth, today));
    setSelectedTime(timeSlots[0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const challenge = String(form.get("challenge") || "").trim();

    const subject = `QA consultation request — ${dateFormatter.format(selectedDate)}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Requested slot: ${dateFormatter.format(selectedDate)} at ${selectedTime}`,
      `Timezone: ${timezone}`,
      "",
      "QA challenge:",
      challenge,
    ].join("\n");

    trackEvent("booking_started", {
      date: dateKey(selectedDate),
      time: selectedTime,
      provider: "email",
    });
    setRequestStarted(true);
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="overflow-hidden border border-line bg-white" data-testid="booking-planner">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div>
          <p className="font-mono text-[10px] tracking-[0.12em] text-accent">SELECT A TIME</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em]">Reserve your QA consultation</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock3 aria-hidden="true" size={16} /> 30 minutes
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.05fr_0.95fr]">
        <section className="border-b border-line p-5 md:p-7 xl:border-b-0 xl:border-r" aria-labelledby="calendar-heading">
          <div className="flex items-center justify-between">
            <div>
              <p id="calendar-heading" className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Select a date</p>
              <p className="mt-2 text-lg font-medium" aria-live="polite">{monthFormatter.format(visibleMonth)}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous month"
                disabled={!canGoBack}
                onClick={() => changeMonth(-1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                <ChevronLeft aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-7 text-center font-mono text-[9px] tracking-[0.08em] text-muted" aria-hidden="true">
            {weekdays.map((weekday) => <span key={weekday} className="py-2">{weekday}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthFormatter.format(visibleMonth)}>
            {calendarDays.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} className="aspect-square" aria-hidden="true" />;

              const available = date >= today && isWeekday(date);
              const selected = dateKey(date) === dateKey(selectedDate);
              return (
                <button
                  key={dateKey(date)}
                  type="button"
                  role="gridcell"
                  aria-label={dateFormatter.format(date)}
                  aria-selected={selected}
                  disabled={!available}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square min-h-10 border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? "border-accent bg-accent font-medium text-white" : "border-transparent hover:border-ink hover:bg-panel"} disabled:cursor-not-allowed disabled:text-strong disabled:hover:border-transparent disabled:hover:bg-transparent`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Available slots</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  aria-pressed={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                  className={`min-h-11 border px-3 font-mono text-[11px] transition-colors ${selectedTime === time ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-ink hover:text-ink"}`}
                >
                  {time}
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">Timezone / {timezone}</p>
          </div>
        </section>

        <form className="bg-canvas p-5 md:p-7" onSubmit={handleSubmit}>
          <div className="flex items-start gap-3 border-b border-line pb-5">
            <CalendarDays aria-hidden="true" className="mt-0.5 text-accent" size={19} strokeWidth={1.5} />
            <div>
              <p className="font-medium">{dateFormatter.format(selectedDate)}</p>
              <p className="mt-1 text-sm text-muted">{selectedTime} · {timezone}</p>
            </div>
          </div>

          <label className="mt-6 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted" htmlFor="booking-name">Name</label>
          <input id="booking-name" name="name" required autoComplete="name" placeholder="Your name" className="mt-2 min-h-12 w-full border border-line bg-white px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15" />

          <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted" htmlFor="booking-email">Email</label>
          <input id="booking-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="mt-2 min-h-12 w-full border border-line bg-white px-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15" />

          <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted" htmlFor="booking-challenge">What should we help you automate?</label>
          <textarea id="booking-challenge" name="challenge" required rows={4} placeholder="Regression QA, API coverage, release confidence…" className="mt-2 w-full resize-y border border-line bg-white p-4 text-sm leading-6 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15" />

          <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-accent bg-accent px-5 font-medium text-white transition-colors hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <Mail aria-hidden="true" size={16} /> Confirm booking
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-muted">Opens a pre-filled email so the team can confirm the selected slot.</p>
          {requestStarted ? <p className="mt-3 text-center text-sm font-medium text-accent" role="status">Your booking request is ready in your email app.</p> : null}
        </form>
      </div>
    </div>
  );
}

export function BookingCalendar({ provider = "calcom" }: BookingCalendarProps) {
  const calLink = useMemo(() => getCalLink(siteConfig.bookingUrl), []);

  useEffect(() => {
    if (calLink) trackEvent("booking_calendar_loaded", { provider });
  }, [calLink, provider]);

  if (!calLink) return <BookingPlanner />;

  return (
    <div className="relative min-h-[720px] overflow-hidden border border-line bg-white" data-testid="booking-calendar">
      <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-accent" aria-hidden="true" />
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "720px", overflow: "auto" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
