import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProcessGraph } from "@/components/visuals/process-graph";
import { processStages } from "@/content/process";

describe("ProcessGraph", () => {
  it("renders a node per stage and opens the first one", () => {
    render(<ProcessGraph stages={processStages} />);

    const nodes = screen.getAllByRole("button");
    expect(nodes).toHaveLength(processStages.length);
    expect(nodes[0]).toHaveAttribute("aria-current", "step");
    expect(nodes[1]).not.toHaveAttribute("aria-current");

    const panel = document.getElementById(nodes[0].getAttribute("aria-controls")!)!;
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(processStages[0].title);
  });

  it("switches the panel on hover and on click", () => {
    render(<ProcessGraph stages={processStages} />);
    const nodes = screen.getAllByRole("button");
    const third = document.getElementById(nodes[2].getAttribute("aria-controls")!)!;

    expect(third).toHaveAttribute("hidden");

    fireEvent.mouseEnter(nodes[2]);
    expect(third).not.toHaveAttribute("hidden");
    expect(nodes[2]).toHaveAttribute("aria-current", "step");

    const last = nodes[nodes.length - 1];
    fireEvent.click(last);
    expect(third).toHaveAttribute("hidden");
    expect(last).toHaveAttribute("aria-current", "step");
  });

  it("keeps every stage's copy in the markup so the detail is not click-gated", () => {
    render(<ProcessGraph stages={processStages} />);

    for (const stage of processStages) {
      // Present but hidden for the inactive stages — crawlers and find-in-page
      // still see the full process, which a mount-on-click panel would hide.
      expect(screen.getByText(stage.title)).toBeInTheDocument();
      expect(screen.getByText(stage.deliverable)).toBeInTheDocument();
    }
  });
});
