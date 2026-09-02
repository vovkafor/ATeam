const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type EmailAttachment = {
  filename: string;
  /** Base64 payload, as the Resend REST API expects. */
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

function mailerConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim(),
    from: process.env.BOOKING_FROM_EMAIL?.trim(),
    admin: process.env.BOOKING_ADMIN_EMAIL?.trim(),
  };
}

export function mailerIsConfigured() {
  const { apiKey, from, admin } = mailerConfig();
  return Boolean(apiKey && from && admin);
}

export function adminRecipient() {
  return mailerConfig().admin ?? "";
}

/**
 * Sends through the Resend REST API directly — the payload is small enough
 * that the SDK earns nothing, and this keeps the dependency list unchanged.
 *
 * Without credentials the messages are logged instead of sent, so the whole
 * flow stays testable locally before any keys exist.
 */
export async function sendEmails(messages: EmailMessage[]): Promise<MailerResult> {
  const { apiKey, from } = mailerConfig();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured: set RESEND_API_KEY, BOOKING_FROM_EMAIL and BOOKING_ADMIN_EMAIL.");
    }
    for (const message of messages) {
      console.info(`[booking] email not sent (no RESEND_API_KEY) → ${message.to}: ${message.subject}`);
    }
    return { delivered: false, skipped: true };
  }

  const results = await Promise.allSettled(
    messages.map(async (message) => {
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
