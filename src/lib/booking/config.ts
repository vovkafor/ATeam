/**
 * Single source of truth for the booking domain. Imported by both the client
 * form and the server action, so it must stay free of runtime-specific APIs.
 */

/** Slots are authored in the team's own timezone and converted for display. */
export const BUSINESS_TIMEZONE = process.env.NEXT_PUBLIC_BOOKING_TIMEZONE || "Europe/Rome";

/** Start times, in `BUSINESS_TIMEZONE`. */
export const TIME_SLOTS = ["09:00", "11:30", "14:00", "16:30"] as const;

export const MEETING_DURATION_MINUTES = 30;

/** How far ahead a slot may be booked. */
export const MAX_LEAD_DAYS = 180;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "text/plain": [".txt"],
} as const;

export const ACCEPT_ATTRIBUTE = Object.entries(ACCEPTED_FILE_TYPES)
  .flatMap(([mime, extensions]) => [mime, ...extensions])
  .join(",");

export const FILE_HINT = "PDF, PNG, JPG or TXT · up to 10 MB";

/** Timezones offered in the picker, on top of the visitor's detected zone. */
export const TIMEZONE_OPTIONS = [
  "Europe/Rome",
  "Europe/London",
  "Europe/Kyiv",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC",
] as const;

export const AGENDA = [
  "Current QA process",
  "Automation opportunities",
  "Existing pain points",
  "Potential next steps",
] as const;
