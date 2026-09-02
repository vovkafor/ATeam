export type BookingFieldErrors = Partial<
  Record<"name" | "email" | "company" | "challenge" | "date" | "time" | "file" | "form", string>
>;

/** What the success screen renders — everything already formatted for display. */
export type BookingConfirmation = {
  reference: string;
  name: string;
  email: string;
  /** ISO instant of the slot start. */
  startsAt: string;
  endsAt: string;
  /** Formatted in the visitor's chosen timezone. */
  clientSlot: string;
  clientTimeZone: string;
  /** The same slot in the team's timezone, so nobody has to do the maths. */
  businessSlot: string;
  businessTimeZone: string;
  meetingUrl: string;
  meetingProvider: string;
  attachmentName?: string;
  /** True when the email provider is not configured and mail was only logged. */
  emailsSkipped: boolean;
};

export type BookingState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: BookingFieldErrors }
  | { status: "success"; confirmation: BookingConfirmation };
