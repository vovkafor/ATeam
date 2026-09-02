import { connect, type TLSSocket } from "node:tls";

/**
 * Minimal SMTP-over-TLS client and MIME builder.
 *
 * Deliberately dependency-free: the booking flow sends two well-formed
 * messages to a known server, which is a small enough surface that pulling in
 * a mail library would cost more than it saves. Implicit TLS on port 465 also
 * means no STARTTLS negotiation to get wrong.
 *
 * Works with any SMTP server; Gmail needs an App Password rather than the
 * account password, because plain-password auth is disabled.
 */

export type SmtpAttachment = {
  filename: string;
  /** Base64 payload. */
  content: string;
  contentType: string;
};

export type SmtpMessage = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: SmtpAttachment[];
};

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
};

/** RFC 2047 encoded-word, so non-ASCII subjects survive the transport. */
function encodeHeader(value: string) {
  if (/^[\x20-\x7E]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf-8").toString("base64")}?=`;
}

/** Splits base64 into the 76-character lines RFC 2045 requires. */
function wrapBase64(value: string) {
  return value.replace(/(.{76})/g, "$1\r\n").trimEnd();
}

function toBase64(value: string) {
  return wrapBase64(Buffer.from(value, "utf-8").toString("base64"));
}

/** Bare address for the SMTP envelope, from a possibly display-named header. */
export function bareAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim();
}

function randomBoundary(prefix: string) {
  return `----=_${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function buildMimeMessage(message: SmtpMessage) {
  const mixed = randomBoundary("mixed");
  const alternative = randomBoundary("alt");
  const attachments = message.attachments ?? [];

  const headers = [
    `From: ${message.from}`,
    `To: ${message.to}`,
    ...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
    `Subject: ${encodeHeader(message.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}@a-team.booking>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
  ];

  const body = [
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alternative}"`,
    "",
    `--${alternative}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(message.text),
    `--${alternative}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(message.html),
    `--${alternative}--`,
  ];

  for (const attachment of attachments) {
    // RFC 2231 for the filename, so Cyrillic and other non-ASCII names survive.
    const encodedName = encodeURIComponent(attachment.filename);
    body.push(
      `--${mixed}`,
      `Content-Type: ${attachment.contentType}; name="${encodedName}"`,
      `Content-Disposition: attachment; filename*=UTF-8''${encodedName}`,
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(attachment.content),
    );
  }

  body.push(`--${mixed}--`, "");

  return [...headers, ...body].join("\r\n");
}

class SmtpError extends Error {}

/** Sends one message and closes the connection. */
export async function sendViaSmtp(config: SmtpConfig, message: SmtpMessage): Promise<void> {
  const payload = buildMimeMessage(message);
  const envelopeFrom = bareAddress(message.from);
  const envelopeTo = bareAddress(message.to);

  await new Promise<void>((resolve, reject) => {
    const socket: TLSSocket = connect({
      host: config.host,
      port: config.port,
      servername: config.host,
    });

    let buffer = "";
    let settled = false;
    let waiting: ((lines: string) => void) | null = null;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      socket.removeAllListeners();
      socket.destroy();
      if (error) reject(error);
      else resolve();
    };

    socket.setTimeout(20_000, () => finish(new SmtpError("SMTP timed out.")));
    socket.on("error", (error) => finish(error));

    /** A reply is complete once a line reads `NNN ` — a dash means continuation. */
    const isComplete = (value: string) =>
      value.split(/\r?\n/).some((line) => /^\d{3} /.test(line));

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf-8");
      if (!waiting || !isComplete(buffer)) return;

      const reply = buffer;
      buffer = "";
      const resume = waiting;
      waiting = null;
      resume(reply);
    });

    const read = () =>
      new Promise<string>((resolveRead) => {
        waiting = resolveRead;
      });

    const expect = async (codes: number[], context: string) => {
      const reply = await read();
      const final = reply.split(/\r?\n/).find((line) => /^\d{3} /.test(line)) ?? "";
      const code = Number(final.slice(0, 3));

      if (!codes.includes(code)) {
        throw new SmtpError(`SMTP ${context} failed: ${reply.trim().slice(0, 200)}`);
      }
      return reply;
    };

    const write = (line: string) => socket.write(`${line}\r\n`);

    const conversation = async () => {
      await expect([220], "greeting");

      write("EHLO a-team.booking");
      await expect([250], "EHLO");

      write("AUTH LOGIN");
      await expect([334], "AUTH");

      write(Buffer.from(config.user, "utf-8").toString("base64"));
      await expect([334], "username");

      write(Buffer.from(config.password, "utf-8").toString("base64"));
      await expect([235], "authentication");

      write(`MAIL FROM:<${envelopeFrom}>`);
      await expect([250], "MAIL FROM");

      write(`RCPT TO:<${envelopeTo}>`);
      await expect([250, 251], "RCPT TO");

      write("DATA");
      await expect([354], "DATA");

      // Dot-stuffing: a lone "." would otherwise terminate the message early.
      socket.write(`${payload.replace(/\r?\n\./g, "\r\n..")}\r\n.\r\n`);
      await expect([250], "message body");

      write("QUIT");
    };

    conversation().then(
      () => finish(),
      (error) => finish(error instanceof Error ? error : new SmtpError(String(error))),
    );
  });
}
