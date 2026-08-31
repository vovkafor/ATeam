import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/cards/project-card";
import { ServiceCard } from "@/components/cards/service-card";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

describe("data-driven cards", () => {
  it("renders a service route and technology labels", () => {
    render(<ServiceCard service={services[0]} />);
    expect(screen.getByRole("heading", { name: services[0].title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore service/i })).toHaveAttribute("href", `/services#${services[0].slug}`);
  });

  it("renders a case study route and all metrics", () => {
    render(<ProjectCard project={projects[0]} />);
    expect(screen.getByRole("link", { name: /read case study/i })).toHaveAttribute("href", `/work/${projects[0].slug}`);
    projects[0].metrics.forEach((metric) => expect(screen.getByText(metric.value)).toBeInTheDocument());
  });
});
