import { bareAddress, sendViaSmtp, type SmtpConfig } from "@/lib/booking/smtp";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type EmailAttachment = {
  filename: string;
  /** Base64 payload. */
  content: string;
  contentType?: string;
};

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

export type MailerResult = { delivered: boolean; skipped: boolean };

type Transport =
  | { kind: "smtp"; config: SmtpConfig; from: string }
  | { kind: "resend"; apiKey: string; from: string }
  | { kind: "none" };

/**
 * Picks a transport from the environment.
 *
 * SMTP wins when configured, because it works with an ordinary mailbox and an
 * app password — no domain to verify, which is the fastest route to real
 * delivery. Resend is the better long-term option once a sending domain
 * exists, so both stay supported.
 */
function resolveTransport(): Transport {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPassword = process.env.SMTP_PASSWORD?.trim();

  if (smtpHost && smtpUser && smtpPassword) {
    return {
      kind: "smtp",
      config: {
        host: smtpHost,
        port: Number(process.env.SMTP_PORT?.trim() || 465),
        user: smtpUser,
        password: smtpPassword,
      },
      // Most providers, Gmail included, require From to match the account.
      from: process.env.BOOKING_FROM_EMAIL?.trim() || `A-Team <${smtpUser}>`,
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BOOKING_FROM_EMAIL?.trim();
  if (apiKey && from) return { kind: "resend", apiKey, from };

  return { kind: "none" };
}

export function mailerIsConfigured() {
  return resolveTransport().kind !== "none";
}

export function adminRecipient() {
  return process.env.BOOKING_ADMIN_EMAIL?.trim() ?? "";
}

async function sendViaResend(apiKey: string, from: string, message: EmailMessage) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Retrying the same submission must not send duplicate mail.
      "Idempotency-Key": `${message.to}:${message.subject}`.slice(0, 256),
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : null),
      ...(message.attachments?.length
        ? {
            attachments: message.attachments.map((attachment) => ({
              filename: attachment.filename,
              content: attachment.content,
              ...(attachment.contentType ? { content_type: attachment.contentType } : null),
            })),
          }
        : null),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

/**
 * Delivers every message. Without credentials the messages are logged instead
 * of sent, so the whole flow stays testable locally before any keys exist.
 */
export async function sendEmails(messages: EmailMessage[]): Promise<MailerResult> {
  const transport = resolveTransport();

  if (transport.kind === "none") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Email is not configured: set SMTP_HOST/SMTP_USER/SMTP_PASSWORD, or RESEND_API_KEY with BOOKING_FROM_EMAIL.",
      );
    }
    for (const message of messages) {
      console.info(`[booking] email not sent (no transport configured) → ${message.to}: ${message.subject}`);
    }
    return { delivered: false, skipped: true };
  }

  const results = await Promise.allSettled(
    messages.map(async (message) => {
      if (transport.kind === "smtp") {
        await sendViaSmtp(transport.config, {
          from: transport.from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
          replyTo: message.replyTo ? bareAddress(message.replyTo) : undefined,
          attachments: (message.attachments ?? []).map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType ?? "application/octet-stream",
          })),
        });
        return;
      }

      await sendViaResend(transport.apiKey, transport.from, message);
    }),
  );

  const failures = results.filter((result) => result.status === "rejected");
  for (const failure of failures) {
    console.error("[booking] email delivery failed:", (failure as PromiseRejectedResult).reason);
  }

  // The client message is sent first; if every send failed the caller should
  // surface an error rather than a confirmation.
  if (failures.length === results.length) {
    throw new Error("Email delivery failed.");
  }

  return { delivered: true, skipped: false };
}
