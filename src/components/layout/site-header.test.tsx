import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("SiteHeader", () => {
  it("exposes all primary routes and the booking action", () => {
    render(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(navigation).toHaveTextContent("Services");
    expect(navigation).toHaveTextContent("Work");
    expect(navigation).toHaveTextContent("Process");
    expect(navigation).toHaveTextContent("About");
    expect(screen.getByRole("link", { name: "Book a call" })).toHaveAttribute("href", "/book");
  });

  it("opens and closes the mobile menu with accessible state", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});
