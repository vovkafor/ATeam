/**
 * Timezone helpers built on `Intl` — no dependency, and identical results on
 * the server and in the browser.
 *
 * The booking flow needs one thing the platform does not give directly:
 * turning a *wall-clock* time in a named zone ("14:00 in Europe/Rome on
 * 2026-09-15") into an absolute instant. Everything else is formatting.
 */

/** Milliseconds to add to a UTC instant to get wall-clock time in `timeZone`. */
function zoneOffset(timestamp: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(timestamp);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second),
  );

  return asUtc - timestamp;
}

/**
 * Resolves a wall-clock time in `timeZone` to the absolute instant it names.
 *
 * The offset depends on the instant we are solving for, so this guesses once
 * and corrects — which also settles DST transition days, where the naive
 * single-pass answer lands an hour out.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  timeZone: string,
) {
  const guess = Date.UTC(year, month, day, hours, minutes);
  const firstPass = guess - zoneOffset(guess, timeZone);
  const corrected = guess - zoneOffset(firstPass, timeZone);
  return new Date(corrected);
}

export function isValidTimeZone(timeZone: string) {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function formatInTimeZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(date);
}

/** Short zone name for a given instant, e.g. `CEST`, `GMT+2`. */
export function timeZoneLabel(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

/** `Tuesday, September 15, 2026` */
export function formatLongDate(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** `14:00` */
export function formatTime(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/** `Tuesday, September 15 · 14:00–14:30 CEST` */
export function formatSlot(start: Date, end: Date, timeZone: string) {
  const day = formatInTimeZone(start, timeZone, { weekday: "long", month: "long", day: "numeric" });
  return `${day} · ${formatTime(start, timeZone)}–${formatTime(end, timeZone)} ${timeZoneLabel(start, timeZone)}`;
}

/** `2026-09-15` in the given zone — the calendar key the form submits. */
export function toDateKey(date: Date, timeZone?: string) {
  if (!timeZone) {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts;
}
