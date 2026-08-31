export type AnalyticsEvent =
  | "book_call_clicked"
  | "booking_calendar_loaded"
  | "booking_started"
  | "booking_completed"
  | "case_study_opened"
  | "service_opened";

export type AnalyticsProperties = Record<string, string | number | boolean>;

export function trackEvent(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("relay:analytics", { detail: { event, properties } }));
  }
}
