import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingCalendar } from "@/components/booking/booking-calendar";

vi.mock("@calcom/embed-react", () => ({ default: () => <div data-testid="calcom-embed" /> }));

afterEach(() => vi.useRealTimers());

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

    fireEvent.click(screen.getByRole("button", { name: "14:00" }));
    expect(screen.getByRole("button", { name: "14:00" })).toHaveAttribute("aria-pressed", "true");
  });
});
