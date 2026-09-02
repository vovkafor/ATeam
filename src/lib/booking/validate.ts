import {
  ACCEPTED_FILE_TYPES,
  BUSINESS_TIMEZONE,
  MAX_FILE_BYTES,
  MAX_LEAD_DAYS,
  TIME_SLOTS,
} from "@/lib/booking/config";
import { isValidTimeZone, zonedTimeToUtc } from "@/lib/booking/timezone";
import type { BookingFieldErrors } from "@/lib/booking/types";

const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/;

export type ValidatedAttachment = {
  filename: string;
  contentType: keyof typeof ACCEPTED_FILE_TYPES;
  bytes: Uint8Array;
  size: number;
};

export type ValidatedBooking = {
  name: string;
  email: string;
  company: string;
  challenge: string;
  /** `YYYY-MM-DD` in the business timezone. */
  date: string;
  /** `HH:MM` in the business timezone. */
  time: string;
  clientTimeZone: string;
  start: Date;
  attachment?: ValidatedAttachment;
};

export type ValidationOutcome =
  | { ok: true; value: ValidatedBooking }
  | { ok: false; message: string; fieldErrors: BookingFieldErrors };

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Content sniffing. A declared MIME type is caller-supplied and trivially
 * spoofed, so the first bytes have to agree with it before anything is
 * forwarded to the mail provider.
 */
function detectType(bytes: Uint8Array): keyof typeof ACCEPTED_FILE_TYPES | null {
  const startsWith = (signature: number[]) =>
    signature.length <= bytes.length && signature.every((byte, index) => bytes[index] === byte);

  if (startsWith([0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf"; // %PDF-
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";

  // Plain text has no signature: accept it only if it decodes as UTF-8 and
  // carries no NUL or stray control bytes, which is what binaries look like.
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
  const suspicious = bytes.some(
    (byte) => byte === 0 || (byte < 0x09) || (byte > 0x0d && byte < 0x20 && byte !== 0x1b),
  );
  return suspicious ? null : "text/plain";
}

/** Strips directories and anything that could confuse a mail client. */
function safeFilename(raw: string, contentType: keyof typeof ACCEPTED_FILE_TYPES) {
  const base = raw.split(/[\\/]/).pop() || "attachment";
  const cleaned = base
    .replace(/[^\w.\- ]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[.\-\s]+/, "")
    .slice(0, 120);

  const allowed = ACCEPTED_FILE_TYPES[contentType];
  const hasValidExtension = allowed.some((extension) => cleaned.toLowerCase().endsWith(extension));
  return hasValidExtension ? cleaned : `${cleaned || "attachment"}${allowed[0]}`;
}

export async function validateBooking(form: FormData): Promise<ValidationOutcome> {
  const fieldErrors: BookingFieldErrors = {};

  // Bots fill every input they find; humans never see this one.
  if (text(form, "company_website")) {
    return { ok: false, message: "Submission rejected.", fieldErrors: {} };
  }

  const name = text(form, "name");
  if (name.length < 2 || name.length > 80) fieldErrors.name = "Enter your name (2–80 characters).";

  const email = text(form, "email");
  if (!EMAIL_PATTERN.test(email) || email.length > 254) fieldErrors.email = "Enter a valid email address.";

  const company = text(form, "company").slice(0, 80);

  const challenge = text(form, "challenge");
  if (challenge.length < 10) fieldErrors.challenge = "Tell us a little more — at least 10 characters.";
  if (challenge.length > 2000) fieldErrors.challenge = "Please keep this under 2000 characters.";

  const date = text(form, "date");
  const time = text(form, "time");

  let start: Date | null = null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fieldErrors.date = "Select a date.";
  } else if (!(TIME_SLOTS as readonly string[]).includes(time)) {
    fieldErrors.time = "Select an available time slot.";
  } else {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    start = zonedTimeToUtc(year, month - 1, day, hours, minutes, BUSINESS_TIMEZONE);

    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    if (weekday === 0 || weekday === 6) {
      fieldErrors.date = "Pick a weekday.";
    } else if (start.getTime() <= Date.now()) {
      fieldErrors.date = "That slot is in the past.";
    } else if (start.getTime() > Date.now() + MAX_LEAD_DAYS * 86_400_000) {
      fieldErrors.date = "Please pick a date within the next six months.";
    }
  }

  const requestedZone = text(form, "timezone");
  const clientTimeZone = isValidTimeZone(requestedZone) ? requestedZone : BUSINESS_TIMEZONE;

  let attachment: ValidatedAttachment | undefined;
  const uploaded = form.get("attachment");
  if (uploaded instanceof File && uploaded.size > 0) {
    if (uploaded.size > MAX_FILE_BYTES) {
      fieldErrors.file = "That file is larger than 10 MB.";
    } else {
      const bytes = new Uint8Array(await uploaded.arrayBuffer());
      const contentType = detectType(bytes);

      if (!contentType) {
        fieldErrors.file = "Unsupported file. Attach a PDF, PNG, JPG or TXT file.";
      } else if (uploaded.type && uploaded.type !== contentType && !(contentType === "image/jpeg" && uploaded.type === "image/jpg")) {
        fieldErrors.file = "The file contents do not match its type.";
      } else {
        attachment = {
          filename: safeFilename(uploaded.name, contentType),
          contentType,
          bytes,
          size: uploaded.size,
        };
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0 || !start) {
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  return {
    ok: true,
    value: { name, email, company, challenge, date, time, clientTimeZone, start, attachment },
  };
}
