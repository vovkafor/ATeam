/**
 * Minimal RFC 5545 generator. Attaching a real invite is what makes the
 * booking land in both calendars — without it a static meeting room link is
 * just text in an email.
 */

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/** RFC 5545 caps content lines at 75 octets; continuations start with a space. */
function fold(line: string) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const output: string[] = [];
  let current = "";
  let length = 0;

  for (const character of line) {
    const size = encoder.encode(character).length;
    if (length + size > (output.length === 0 ? 75 : 74)) {
      output.push(current);
      current = "";
      length = 0;
    }
    current += character;
    length += size;
  }
  output.push(current);

  return output.join("\r\n ");
}

export type CalendarInvite = {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
};

export function buildIcs(invite: CalendarInvite) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//A-Team//QA Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${invite.uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(invite.start)}`,
    `DTEND:${toIcsDate(invite.end)}`,
    `SUMMARY:${escapeText(invite.summary)}`,
    `DESCRIPTION:${escapeText(invite.description)}`,
    `LOCATION:${escapeText(invite.location)}`,
    `URL:${invite.location}`,
    `ORGANIZER;CN=${escapeText(invite.organizerName)}:mailto:${invite.organizerEmail}`,
    `ATTENDEE;CN=${escapeText(invite.attendeeName)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${invite.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(fold).join("\r\n")}\r\n`;
}

/** "Add to Google Calendar" template URL for the success screen. */
export function googleCalendarUrl(invite: Pick<CalendarInvite, "start" | "end" | "summary" | "description" | "location">) {
  const stamp = (date: Date) => toIcsDate(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: invite.summary,
    dates: `${stamp(invite.start)}/${stamp(invite.end)}`,
    details: invite.description,
    location: invite.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
