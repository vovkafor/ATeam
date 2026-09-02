import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/booking/ics";
import { formatTime, zonedTimeToUtc } from "@/lib/booking/timezone";
import { validateBooking } from "@/lib/booking/validate";

function form(fields: Record<string, string>, file?: File) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  if (file) data.append("attachment", file);
  return data;
}

/** A weekday comfortably in the future, so validation never trips on the clock. */
function futureWeekday() {
  const date = new Date(Date.now() + 21 * 86_400_000);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

const valid = () => ({
  name: "Dana Reeves",
  email: "dana@example.com",
  challenge: "Our regression suite takes four hours and blocks every release.",
  date: futureWeekday(),
  time: "14:00",
  timezone: "America/New_York",
});

describe("timezone conversion", () => {
  it("resolves a wall-clock time in a named zone to the right instant", () => {
    // 14:00 in Rome on 15 July 2026 is CEST (UTC+2) → 12:00 UTC.
    const instant = zonedTimeToUtc(2026, 6, 15, 14, 0, "Europe/Rome");
    expect(instant.toISOString()).toBe("2026-07-15T12:00:00.000Z");
  });

  it("stays correct on both sides of a DST boundary", () => {
    // Winter in Rome is CET (UTC+1).
    expect(zonedTimeToUtc(2026, 0, 15, 14, 0, "Europe/Rome").toISOString()).toBe("2026-01-15T13:00:00.000Z");
    // Round-tripping the instant back through the zone must return the input.
    expect(formatTime(zonedTimeToUtc(2026, 0, 15, 14, 0, "Europe/Rome"), "Europe/Rome")).toBe("14:00");
    expect(formatTime(zonedTimeToUtc(2026, 6, 15, 14, 0, "Europe/Rome"), "Europe/Rome")).toBe("14:00");
  });
});

describe("booking validation", () => {
  it("accepts a complete submission", async () => {
    const result = await validateBooking(form(valid()));
    expect(result.ok).toBe(true);
  });

  it("rejects a malformed email and a too-short brief", async () => {
    const result = await validateBooking(form({ ...valid(), email: "dana@", challenge: "help" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors.email).toBeDefined();
    expect(result.fieldErrors.challenge).toBeDefined();
  });

  it("rejects a slot that is not on the published list", async () => {
    const result = await validateBooking(form({ ...valid(), time: "03:15" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.time).toBeDefined();
  });

  it("rejects a date in the past", async () => {
    const result = await validateBooking(form({ ...valid(), date: "2020-01-06" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.date).toBeDefined();
  });

  it("silently rejects submissions that fill the honeypot", async () => {
    const result = await validateBooking(form({ ...valid(), company_website: "https://spam.example" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors).toEqual({});
  });

  it("falls back to the business timezone when the client sends a bogus one", async () => {
    const result = await validateBooking(form({ ...valid(), timezone: "Mars/Olympus_Mons" }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.clientTimeZone).toBe("Europe/Rome");
  });

  it("accepts a real PDF and normalises its filename", async () => {
    const pdf = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])], "../../etc/spec v2.pdf", {
      type: "application/pdf",
    });
    const result = await validateBooking(form(valid(), pdf));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.attachment?.filename).toBe("spec v2.pdf");
  });

  it("rejects an executable disguised as a PNG", async () => {
    const fake = new File([new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00])], "diagram.png", { type: "image/png" });
    const result = await validateBooking(form(valid(), fake));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.file).toBeDefined();
  });

  it("rejects a file above the size limit", async () => {
    const huge = new File([new Uint8Array(11 * 1024 * 1024)], "dump.txt", { type: "text/plain" });
    const result = await validateBooking(form(valid(), huge));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.file).toContain("10 MB");
  });
});

describe("calendar invite", () => {
  it("produces a REQUEST event with CRLF line endings and both parties", () => {
    const ics = buildIcs({
      uid: "at-test@a-team.booking",
      start: new Date("2026-07-15T12:00:00.000Z"),
      end: new Date("2026-07-15T12:30:00.000Z"),
      summary: "QA consultation — A-Team × Dana Reeves",
      description: "Line one\nLine two; with, separators",
      location: "https://meet.google.com/abc-defg-hij",
      organizerName: "A-Team",
      organizerEmail: "hello@a-team.test",
      attendeeName: "Dana Reeves",
      attendeeEmail: "dana@example.com",
    });

    expect(ics).toContain("METHOD:REQUEST");
    expect(ics).toContain("DTSTART:20260715T120000Z");
    expect(ics).toContain("DTEND:20260715T123000Z");
    expect(ics).toContain("mailto:dana@example.com");
    expect(ics).toContain("DESCRIPTION:Line one\\nLine two\\; with\\, separators");
    expect(ics.split("\r\n").every((line) => new TextEncoder().encode(line).length <= 75)).toBe(true);
  });
});
