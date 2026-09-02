"use server";

import { headers } from "next/headers";
import { MEETING_DURATION_MINUTES, BUSINESS_TIMEZONE } from "@/lib/booking/config";
import { adminRecipient, mailerIsConfigured, sendEmails } from "@/lib/booking/email";
import { buildIcs } from "@/lib/booking/ics";
import { resolveMeetingRoom } from "@/lib/booking/meeting";
import { allowRequest } from "@/lib/booking/rate-limit";
import { adminEmail, clientEmail } from "@/lib/booking/templates";
import { formatSlot } from "@/lib/booking/timezone";
import type { BookingState } from "@/lib/booking/types";
import { validateBooking } from "@/lib/booking/validate";

function formatBytes(size: number) {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;
}

async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "anonymous";
}

/**
 * Handles a booking submission end to end: validate, resolve the meeting room,
 * build the calendar invite, and send the confirmation to the client plus a
 * copy — with their attachment — to the organiser.
 */
export async function submitBooking(_previous: BookingState, form: FormData): Promise<BookingState> {
  if (!allowRequest(await clientKey())) {
    return { status: "error", message: "Too many booking attempts. Please try again in a few minutes." };
  }

  const validation = await validateBooking(form);
  if (!validation.ok) {
    return { status: "error", message: validation.message, fieldErrors: validation.fieldErrors };
  }

  const booking = validation.value;

  const room = resolveMeetingRoom();
  if (!room) {
    console.error("[booking] MEET_ROOM_URL is not set or is not a valid https URL.");
    return {
      status: "error",
      message: "Booking is temporarily unavailable. Please email us directly and we'll confirm the slot.",
    };
  }

  const start = booking.start;
  const end = new Date(start.getTime() + MEETING_DURATION_MINUTES * 60_000);

  const clientSlot = formatSlot(start, end, booking.clientTimeZone);
  const businessSlot = formatSlot(start, end, BUSINESS_TIMEZONE);
  const reference = `AT-${start.toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const templateInput = {
    name: booking.name,
    email: booking.email,
    company: booking.company,
    challenge: booking.challenge,
    clientSlot,
    clientTimeZone: booking.clientTimeZone,
    businessSlot,
    businessTimeZone: BUSINESS_TIMEZONE,
    meetingUrl: room.url,
    meetingProvider: room.provider,
    reference,
    attachmentName: booking.attachment?.filename,
    attachmentSize: booking.attachment ? formatBytes(booking.attachment.size) : undefined,
  };

  const organiser = adminRecipient();
  const invite = buildIcs({
    uid: `${reference.toLowerCase()}@a-team.booking`,
    start,
    end,
    summary: `QA consultation — A-Team × ${booking.name}`,
    description: `30-minute QA consultation.\n\nJoin: ${room.url}\n\nTopic: ${booking.challenge}`,
    location: room.url,
    organizerName: "A-Team",
    organizerEmail: organiser || booking.email,
    attendeeName: booking.name,
    attendeeEmail: booking.email,
  });

  const icsAttachment = {
    filename: "qa-consultation.ics",
    content: Buffer.from(invite, "utf-8").toString("base64"),
    contentType: "text/calendar; charset=utf-8; method=REQUEST",
  };

  const forClient = clientEmail(templateInput);
  const forAdmin = adminEmail(templateInput);

  let emailsSkipped = false;
  try {
    const result = await sendEmails([
      { to: booking.email, ...forClient, replyTo: organiser || undefined, attachments: [icsAttachment] },
      ...(organiser
        ? [
            {
              to: organiser,
              ...forAdmin,
              // Replying to the notification writes straight to the client.
              replyTo: booking.email,
              attachments: [
                icsAttachment,
                ...(booking.attachment
                  ? [
                      {
                        filename: booking.attachment.filename,
                        content: Buffer.from(booking.attachment.bytes).toString("base64"),
                        contentType: booking.attachment.contentType,
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ]);
    emailsSkipped = result.skipped;
  } catch (error) {
    console.error("[booking] submission failed:", error);
    return {
      status: "error",
      message: "We couldn't send the confirmation. Please try again, or email us directly.",
    };
  }

  if (!mailerIsConfigured()) emailsSkipped = true;

  return {
    status: "success",
    confirmation: {
      reference,
      name: booking.name,
      email: booking.email,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      clientSlot,
      clientTimeZone: booking.clientTimeZone,
      businessSlot,
      businessTimeZone: BUSINESS_TIMEZONE,
      meetingUrl: room.url,
      meetingProvider: room.provider,
      attachmentName: booking.attachment?.filename,
      emailsSkipped,
    },
  };
}
