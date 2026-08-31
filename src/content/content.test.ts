import { describe, expect, it } from "vitest";
import { faqItems } from "@/content/faq";
import { processStages } from "@/content/process";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { team } from "@/content/team";

describe("centralized content", () => {
  it("keeps the brief-defined collection sizes stable", () => {
    expect(services).toHaveLength(5);
    expect(projects).toHaveLength(3);
    expect(team).toHaveLength(4);
    expect(processStages).toHaveLength(6);
    expect(faqItems.length).toBeGreaterThanOrEqual(4);
    expect(faqItems.length).toBeLessThanOrEqual(6);
  });

  it("provides unique route slugs", () => {
    expect(new Set(services.map((service) => service.slug)).size).toBe(services.length);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
  });

  it("marks every placeholder case study as demonstration content", () => {
    expect(projects.every((project) => project.isDemonstration)).toBe(true);
  });
});
