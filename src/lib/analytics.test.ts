import { describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics";

describe("trackEvent", () => {
  it("is a no-op while analytics is disabled", () => {
    const listener = vi.fn();
    window.addEventListener("relay:analytics", listener);
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "false";
    trackEvent("book_call_clicked", { location: "test" });
    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("relay:analytics", listener);
  });

  it("emits a provider-neutral browser event when enabled", () => {
    const listener = vi.fn();
    window.addEventListener("relay:analytics", listener);
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
    trackEvent("case_study_opened", { project: "example" });
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ event: "case_study_opened", properties: { project: "example" } });
    window.removeEventListener("relay:analytics", listener);
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "false";
  });
});
