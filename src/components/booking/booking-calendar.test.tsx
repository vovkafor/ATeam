import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingCalendar } from "@/components/booking/booking-calendar";

vi.mock("@calcom/embed-react", () => ({ default: () => <div data-testid="calcom-embed" /> }));
// The server action pulls in next/headers, which has no jsdom equivalent.
vi.mock("@/app/book/actions", () => ({ submitBooking: vi.fn(async () => ({ status: "idle" as const })) }));

afterEach(() => vi.useRealTimers());

function selectTimeZone(zone: string) {
  fireEvent.change(screen.getByLabelText(/times shown in/i), { target: { value: zone } });
}

describe("BookingCalendar", () => {
  it("renders an interactive booking planner when no booking URL is configured", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 10, 12));
    render(<BookingCalendar />);

    expect(screen.getByTestId("booking-planner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /reserve your qa consultation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm booking/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("October 2026")).toBeInTheDocument();

    // Slots are authored in the team's timezone, so pin it before asserting.
    selectTimeZone("Europe/Rome");
    fireEvent.click(screen.getByRole("button", { name: /^14:00/ }));
    expect(screen.getByRole("button", { name: /^14:00/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("converts the published slots into the visitor's timezone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 10, 12));
    render(<BookingCalendar />);

    selectTimeZone("Europe/Rome");
    expect(screen.getByRole("button", { name: /^09:00/ })).toBeInTheDocument();

    // 09:00 in Rome (CEST, UTC+2) is 03:00 in New York (EDT, UTC-4).
    selectTimeZone("America/New_York");
    expect(screen.getByRole("button", { name: /^03:00/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^09:00/ })).not.toBeInTheDocument();
  });

  it("exposes an optional attachment field with the accepted formats", () => {
    render(<BookingCalendar />);

    const input = screen.getByLabelText(/attach project files/i);
    expect(input).toHaveAttribute("type", "file");
    expect(input.getAttribute("accept")).toContain("application/pdf");
    expect(input.getAttribute("accept")).toContain(".png");
    expect(screen.getByText(/up to 10 MB/i)).toBeInTheDocument();
  });
});
