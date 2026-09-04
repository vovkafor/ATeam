import { describe, expect, it } from "vitest";
import { processStages } from "@/content/process";
import { services } from "@/content/services";
import { team } from "@/content/team";

describe("centralized content", () => {
  it("keeps the collection sizes the site is built around", () => {
    expect(services).toHaveLength(3);
    expect(team).toHaveLength(2);
    expect(processStages).toHaveLength(4);
  });

  it("provides unique slugs and stage numbers", () => {
    expect(new Set(services.map((service) => service.slug)).size).toBe(services.length);
    expect(new Set(team.map((member) => member.slug)).size).toBe(team.length);
    expect(new Set(processStages.map((stage) => stage.number)).size).toBe(processStages.length);
  });

  it("states no invented percentages anywhere in the copy", () => {
    // The site claims nothing it cannot show. Real, checkable credentials
    // (the Upwork rating) live in the trust content, not here.
    const copy = JSON.stringify([services, processStages, team]);
    expect(copy).not.toMatch(/\d+\s?%/);
  });
});
