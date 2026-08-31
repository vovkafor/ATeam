import type { TeamMember } from "@/types/content";

export const team: TeamMember[] = [
  { name: "Alex Morgan", initials: "AM", role: "QA Architect", description: "Designs risk-based automation systems and release quality models.", technologies: ["Playwright", "TypeScript", "CI/CD", "Architecture"] },
  { name: "Maya Chen", initials: "MC", role: "Automation Engineer", description: "Builds maintainable browser and API test infrastructure.", technologies: ["Cypress", "REST", "Python", "Docker"] },
  { name: "Noah Williams", initials: "NW", role: "Performance Engineer", description: "Turns production traffic patterns into repeatable capacity evidence.", technologies: ["k6", "Grafana", "OpenTelemetry", "JMeter"] },
  { name: "Sofia Patel", initials: "SP", role: "QA Platform Engineer", description: "Connects test execution, diagnostics, and developer workflows.", technologies: ["GitHub Actions", "Playwright", "Allure", "Kubernetes"] },
];
