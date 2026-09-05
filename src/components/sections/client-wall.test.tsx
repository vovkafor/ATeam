import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientWall } from "@/components/sections/client-wall";
import { clients } from "@/content/clients";

describe("ClientWall", () => {
  it("renders one card per company, closed to start", () => {
    render(<ClientWall />);
    const cards = screen.getAllByRole("button");

    expect(cards).toHaveLength(clients.length);
    cards.forEach((card) => {
      expect(card).toHaveAttribute("aria-expanded", "false");
      expect(card).not.toHaveAttribute("data-open");
    });
  });

  it("opens on hover and pins on click, so touch gets the same reveal", () => {
    render(<ClientWall />);
    const card = screen.getAllByRole("button")[0];

    fireEvent.mouseEnter(card);
    expect(card).toHaveAttribute("data-open");
    // Hover is a preview: the disclosure itself is still unpinned.
    expect(card).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseLeave(card);
    expect(card).not.toHaveAttribute("data-open");

    fireEvent.click(card);
    expect(card).toHaveAttribute("aria-expanded", "true");
    expect(card).toHaveAttribute("data-open");
  });

  it("keeps every company's skills in the markup rather than mounting them on hover", () => {
    render(<ClientWall />);

    for (const client of clients) {
      expect(screen.getByText(client.work)).toBeInTheDocument();
      for (const skill of client.skills) {
        expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
      }
    }
  });
});
