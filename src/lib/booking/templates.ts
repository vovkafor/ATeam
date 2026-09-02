import { AGENDA } from "@/lib/booking/config";

const ACCENT = "#2455ff";
const INK = "#090909";
const MUTED = "#666666";
const LINE = "#e5e5e5";

export type TemplateInput = {
  name: string;
  email: string;
  company: string;
  challenge: string;
  clientSlot: string;
  clientTimeZone: string;
  businessSlot: string;
  businessTimeZone: string;
  meetingUrl: string;
  meetingProvider: string;
  reference: string;
  attachmentName?: string;
  attachmentSize?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${LINE};font:500 11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:14px 0;border-bottom:1px solid ${LINE};font:400 15px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};vertical-align:top;">${value}</td>
    </tr>`;
}

function shell(title: string, eyebrow: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:32px 16px;background:#f5f5f7;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid ${LINE};">
    <tr><td style="padding:32px 32px 0;">
      <p style="margin:0;font:500 11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};">${escapeHtml(eyebrow)}</p>
      <h1 style="margin:20px 0 0;font:500 28px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:-0.03em;color:${INK};line-height:1.15;">${escapeHtml(title)}</h1>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">${body}</td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid ${LINE};background:#fafafa;">
      <p style="margin:0;font:400 12px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.06em;color:${MUTED};">A-Team — automated testing systems designed around your release process.</p>
    </td></tr>
  </table>
</body></html>`;
}

function meetingButton(url: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr>
    <td style="background:${ACCENT};">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 24px;font:500 15px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
    </td>
  </tr></table>`;
}

export function clientEmail(input: TemplateInput) {
  const details = `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${row("When", `${escapeHtml(input.clientSlot)}<br><span style="color:${MUTED};font-size:13px;">${escapeHtml(input.businessSlot)} — our time</span>`)}
      ${row("Format", `30-minute ${escapeHtml(input.meetingProvider.toLowerCase())}`)}
      ${row("Join link", `<a href="${escapeHtml(input.meetingUrl)}" style="color:${ACCENT};word-break:break-all;">${escapeHtml(input.meetingUrl)}</a>`)}
      ${row("Reference", escapeHtml(input.reference))}
    </table>`;

  const agenda = AGENDA.map(
    (item) =>
      `<li style="margin:0 0 8px;font:400 15px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">${escapeHtml(item)}</li>`,
  ).join("");

  const body = `
    <p style="margin:0 0 24px;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">
      Hi ${escapeHtml(input.name.split(" ")[0])}, your QA consultation is confirmed. The calendar invite is attached — open it to add the call to your calendar.
    </p>
    ${details}
    ${meetingButton(input.meetingUrl, `Join the ${input.meetingProvider.toLowerCase()}`)}
    <h2 style="margin:36px 0 12px;font:500 17px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">What we'll cover</h2>
    <ul style="margin:0;padding-left:20px;">${agenda}</ul>
    ${
      input.attachmentName
        ? `<p style="margin:28px 0 0;font:400 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">We received <strong style="color:${INK};">${escapeHtml(input.attachmentName)}</strong> and will review it before the call.</p>`
        : ""
    }
    <p style="margin:28px 0 0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">
      Need to move it? Just reply to this email.
    </p>`;

  const text = [
    `Hi ${input.name.split(" ")[0]}, your QA consultation is confirmed.`,
    "",
    `When: ${input.clientSlot}`,
    `Our time: ${input.businessSlot}`,
    `Join: ${input.meetingUrl}`,
    `Reference: ${input.reference}`,
    "",
    "We'll cover:",
    ...AGENDA.map((item) => `- ${item}`),
    input.attachmentName ? `\nWe received ${input.attachmentName} and will review it before the call.` : "",
    "",
    "Need to move it? Just reply to this email.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `QA consultation confirmed — ${input.clientSlot}`,
    html: shell("Your consultation is confirmed.", "BOOKING / CONFIRMED", body),
    text,
  };
}

export function adminEmail(input: TemplateInput) {
  const details = `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${row("When (your time)", escapeHtml(input.businessSlot))}
      ${row("Client's time", `${escapeHtml(input.clientSlot)}<br><span style="color:${MUTED};font-size:13px;">${escapeHtml(input.clientTimeZone)}</span>`)}
      ${row("Name", escapeHtml(input.name))}
      ${row("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${ACCENT};">${escapeHtml(input.email)}</a>`)}
      ${input.company ? row("Company", escapeHtml(input.company)) : ""}
      ${row("Join link", `<a href="${escapeHtml(input.meetingUrl)}" style="color:${ACCENT};word-break:break-all;">${escapeHtml(input.meetingUrl)}</a>`)}
      ${row("Attachment", input.attachmentName ? `${escapeHtml(input.attachmentName)} <span style="color:${MUTED};">(${escapeHtml(input.attachmentSize || "")})</span>` : `<span style="color:${MUTED};">none</span>`)}
      ${row("Reference", escapeHtml(input.reference))}
    </table>`;

  const body = `
    <p style="margin:0 0 24px;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${MUTED};">
      Accept the attached invite to put this on your calendar. Replying goes straight to the client.
    </p>
    ${details}
    <h2 style="margin:36px 0 12px;font:500 17px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">What they want automated</h2>
    <p style="margin:0;padding:16px;border-left:2px solid ${ACCENT};background:#fafafa;font:400 15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};white-space:pre-wrap;">${escapeHtml(input.challenge)}</p>`;

  const text = [
    `New booking — ${input.name}${input.company ? ` (${input.company})` : ""}`,
    "",
    `When (your time): ${input.businessSlot}`,
    `Client's time: ${input.clientSlot} (${input.clientTimeZone})`,
    `Email: ${input.email}`,
    `Join: ${input.meetingUrl}`,
    `Attachment: ${input.attachmentName ? `${input.attachmentName} (${input.attachmentSize})` : "none"}`,
    `Reference: ${input.reference}`,
    "",
    "What they want automated:",
    input.challenge,
  ].join("\n");

  return {
    subject: `New booking — ${input.name}${input.company ? ` · ${input.company}` : ""} · ${input.businessSlot}`,
    html: shell(`New booking from ${input.name}.`, "BOOKING / NEW REQUEST", body),
    text,
  };
}
