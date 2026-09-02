export type MeetingRoom = {
  url: string;
  /** Human label for the room's platform, used in emails and on the page. */
  provider: string;
};

function providerFor(hostname: string) {
  if (hostname === "meet.google.com") return "Google Meet";
  if (hostname.endsWith("zoom.us")) return "Zoom";
  if (hostname.endsWith("teams.microsoft.com")) return "Microsoft Teams";
  if (hostname.endsWith("whereby.com")) return "Whereby";
  return "Video call";
}

/**
 * Resolves the standing meeting room from `MEET_ROOM_URL`.
 *
 * Deliberately a permanent room rather than a per-booking link: a real, unique
 * Google Meet or Zoom URL can only be created through their APIs, and a
 * hand-assembled `meet.google.com/xxx-xxxx-xxx` string is a dead link that
 * fails in front of the client. Swapping this function for a Calendar API or
 * Zoom Server-to-Server call is the only change needed to move to per-booking
 * links later — every caller already treats the room as opaque.
 */
export function resolveMeetingRoom(): MeetingRoom | null {
  const configured = process.env.MEET_ROOM_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:") return null;
    return { url: url.toString(), provider: providerFor(url.hostname) };
  } catch {
    return null;
  }
}
