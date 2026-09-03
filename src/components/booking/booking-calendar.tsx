"use client";

import Cal from "@calcom/embed-react";
import { ChevronLeft, ChevronRight, Clock3, Globe } from "lucide-react";
import { useActionState, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { submitBooking } from "@/app/book/actions";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingSuccess } from "@/components/booking/booking-success";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import {
  BUSINESS_TIMEZONE,
  MEETING_DURATION_MINUTES,
  TIMEZONE_OPTIONS,
  TIME_SLOTS,
} from "@/lib/booking/config";
import {
  browserTimeZone,
  formatSlot,
  formatTime,
  toDateKey,
  zonedTimeToUtc,
} from "@/lib/booking/timezone";
import type { BookingState } from "@/lib/booking/types";

type BookingCalendarProps = { provider?: "calcom" };

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const initialState: BookingState = { status: "idle" };

function getCalLink(bookingUrl: string) {
  try {
    const url = new URL(bookingUrl);
    if (!url.hostname.endsWith("cal.com")) return "";
    return url.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return bookingUrl.replace(/^https?:\/\/cal\.com\//, "").replace(/\/$/, "");
  }
}

/**
 * Calendar cells are plain year/month/day tuples, not instants — the day a
 * client picks is a day in the team's timezone, and the slot is resolved to a
 * real instant only when a time is attached to it.
 */
function businessToday() {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  return toDateKey(date);
}

function isWeekday(date: Date) {
  return date.getDay() !== 0 && date.getDay() !== 6;
}

function nextAvailableDate(from: Date) {
  const date = new Date(from);
  date.setDate(date.getDate() + 1);
  while (!isWeekday(date)) date.setDate(date.getDate() + 1);
  return date;
}

function firstAvailableDateInMonth(month: Date, today: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const date = first < today ? new Date(today) : first;
  while (!isWeekday(date)) date.setDate(date.getDate() + 1);
  return date;
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - offset + 1;
    return day > 0 && day <= daysInMonth ? new Date(month.getFullYear(), month.getMonth(), day) : null;
  });
}

/** `useSyncExternalStore` reads the browser zone without a render-phase call. */
function subscribeToNothing() {
  return () => undefined;
}

/** Absolute instant for a business-local date + slot. */
function slotInstant(date: Date, slot: string) {
  const [hours, minutes] = slot.split(":").map(Number);
  return zonedTimeToUtc(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, BUSINESS_TIMEZONE);
}

function BookingPlanner() {
  const [today] = useState(businessToday);
  // Read once at mount: a render-phase clock would make the output unstable.
  const [mountedAt] = useState(() => Date.now());
  const [selectedDate, setSelectedDate] = useState(() => nextAvailableDate(businessToday()));
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);
  const [chosenTimeZone, setChosenTimeZone] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [dismissedReference, setDismissedReference] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(submitBooking, initialState);

  // The server has no browser zone, so it renders business time and the client
  // swaps to the detected zone on hydration. An explicit pick always wins.
  const detectedTimeZone = useSyncExternalStore(
    subscribeToNothing,
    browserTimeZone,
    () => BUSINESS_TIMEZONE,
  );
  const timeZone = chosenTimeZone ?? detectedTimeZone;

  useEffect(() => {
    trackEvent("booking_calendar_loaded", { provider: "email" });
  }, []);

  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoBack = visibleMonth > currentMonth;

  const timezoneChoices = useMemo(
    () => Array.from(new Set([timeZone, ...TIMEZONE_OPTIONS])),
    [timeZone],
  );

  /** Slots for the selected day, converted into the viewer's zone. */
  const slots = useMemo(() => {
    return TIME_SLOTS.map((slot) => {
      const start = slotInstant(selectedDate, slot);
      const viewerDay = toDateKey(start, timeZone);
      const businessDay = toDateKey(start, BUSINESS_TIMEZONE);
      const dayShift =
        viewerDay === businessDay ? 0 : new Date(viewerDay).getTime() > new Date(businessDay).getTime() ? 1 : -1;

      return {
        slot,
        start,
        label: formatTime(start, timeZone),
        dayShift,
        past: start.getTime() <= mountedAt,
      };
    });
  }, [mountedAt, selectedDate, timeZone]);

  const activeSlot = slots.find((entry) => entry.slot === selectedTime) ?? slots.find((entry) => !entry.past);
  const slotSummary = activeSlot
    ? formatSlot(
        activeSlot.start,
        new Date(activeSlot.start.getTime() + MEETING_DURATION_MINUTES * 60_000),
        timeZone,
      )
    : dateFormatter.format(selectedDate);

  const showSuccess =
    state.status === "success" && dismissedReference !== state.confirmation.reference;

  function changeMonth(direction: -1 | 1) {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1);
    if (nextMonth < currentMonth) return;

    setVisibleMonth(nextMonth);
    setSelectedDate(firstAvailableDateInMonth(nextMonth, today));
    setSelectedTime(TIME_SLOTS[0]);
  }

  function handleAction(payload: FormData) {
    trackEvent("booking_started", {
      date: dateKey(selectedDate),
      time: selectedTime,
      timezone: timeZone,
      attachment: payload.get("attachment") instanceof File && (payload.get("attachment") as File).size > 0,
    });
    formAction(payload);
  }

  if (showSuccess && state.status === "success") {
    return (
      <div className="overflow-hidden border border-line" data-testid="booking-planner">
        <BookingSuccess
          confirmation={state.confirmation}
          onReset={() => {
            setDismissedReference(state.confirmation.reference);
            setFormKey((key) => key + 1);
          }}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-line" data-testid="booking-planner">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div>
          <p className="font-mono text-[10px] tracking-[0.12em] text-accent">SELECT A TIME</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em]">Reserve your QA consultation</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock3 aria-hidden="true" size={16} /> {MEETING_DURATION_MINUTES} minutes
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
                className="inline-flex h-11 w-11 items-center justify-center border border-line transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                <ChevronLeft aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-line transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white"
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
                  disabled={!available || pending}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square min-h-10 border text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? "border-accent bg-accent font-medium text-white" : "border-transparent hover:border-ink hover:bg-panel"} disabled:cursor-not-allowed disabled:text-strong disabled:hover:border-transparent disabled:hover:bg-transparent`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Available slots</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
              {slots.map((entry) => (
                <button
                  key={entry.slot}
                  type="button"
                  aria-pressed={selectedTime === entry.slot}
                  disabled={entry.past || pending}
                  onClick={() => setSelectedTime(entry.slot)}
                  className={`min-h-11 border px-3 font-mono text-[11px] transition-colors duration-300 ${selectedTime === entry.slot ? "border-ink bg-ink text-white" : "border-line bg-transparent text-muted hover:border-ink hover:text-ink"} disabled:cursor-not-allowed disabled:border-line disabled:opacity-40 disabled:text-strong disabled:hover:text-strong`}
                >
                  {entry.label}
                  {entry.dayShift !== 0 ? (
                    <span className="ml-1 text-[9px] opacity-70">{entry.dayShift > 0 ? "+1d" : "−1d"}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <label
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                htmlFor="booking-timezone"
              >
                <Globe aria-hidden="true" size={13} /> Times shown in
              </label>
              <select
                id="booking-timezone"
                value={timeZone}
                disabled={pending}
                onChange={(event) => setChosenTimeZone(event.target.value)}
                className="mt-2 min-h-11 w-full border border-line bg-transparent px-3 text-sm outline-none transition-[border-color,box-shadow] duration-500 focus:border-accent focus:ring-1 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timezoneChoices.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone.replace("_", " ")}
                  </option>
                ))}
              </select>
              {timeZone !== BUSINESS_TIMEZONE && activeSlot ? (
                <p className="mt-3 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-muted">
                  {formatTime(activeSlot.start, BUSINESS_TIMEZONE)} our time / {BUSINESS_TIMEZONE.replace("_", " ")}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <BookingForm
          key={formKey}
          action={handleAction}
          state={state}
          pending={pending}
          dateValue={dateKey(selectedDate)}
          timeValue={selectedTime}
          timeZone={timeZone}
          slotSummary={slotSummary}
        />
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
