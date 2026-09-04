import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamCard } from "@/components/cards/team-card";
import { team, getTeamMember } from "@/content/team";

const myron = getTeamMember("myron-satsyk")!;
const volodymyr = getTeamMember("volodymyr-formanchuk")!;

describe("TeamCard", () => {
  it("starts collapsed and pins open on click", () => {
    render(<TeamCard member={myron} />);

    const toggle = screen.getByRole("button", { name: /full profile/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /hide full profile/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("expands on hover without pinning the disclosure state", () => {
    const { container } = render(<TeamCard member={myron} />);
    const card = container.querySelector("article")!;
    const panel = document.getElementById(
      screen.getByRole("button", { name: /full profile/i }).getAttribute("aria-controls")!,
    )!;

    expect(panel).toHaveClass("grid-rows-[0fr]");

    fireEvent.mouseEnter(card);
    expect(panel).toHaveClass("grid-rows-[1fr]");
    // Hover is a visual preview only — the button still reports "not pinned".
    expect(screen.getByRole("button", { name: /full profile/i })).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseLeave(card);
    expect(panel).toHaveClass("grid-rows-[0fr]");
  });

  it("renders each engineer's own strengths and experience", () => {
    const { unmount } = render(<TeamCard member={myron} />);
    expect(screen.getByText(/Appium \+ Python \+ PyTest framework/i)).toBeInTheDocument();
    expect(screen.getByText(/Magento 1 → 2 migration/i)).toBeInTheDocument();
    unmount();

    render(<TeamCard member={volodymyr} />);
    expect(screen.getByText(/factual drift and structural inconsistency/i)).toBeInTheDocument();
    expect(screen.getByText(/prompt architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/autonomous AI test agent/i)).toBeInTheDocument();
  });

  it("flags the Apple Developer Academy credential only where it applies", () => {
    const { unmount } = render(<TeamCard member={myron} />);
    expect(screen.getByText("Apple Developer Academy")).toBeInTheDocument();
    unmount();

    render(<TeamCard member={volodymyr} />);
    expect(screen.queryByText("Apple Developer Academy")).not.toBeInTheDocument();
  });

  it("reports a live status in the portrait HUD, decoratively", () => {
    const { container } = render(<TeamCard member={myron} />);

    expect(screen.getByText("CI pipeline running")).toBeInTheDocument();
    // The HUD is ornamentation over the photo: hidden from assistive tech.
    expect(container.querySelector(".hud")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".hud-bracket")).toHaveLength(4);
  });

  it("gives every member a unique slug for keys and routing", () => {
    expect(new Set(team.map((member) => member.slug)).size).toBe(team.length);
  });
});
