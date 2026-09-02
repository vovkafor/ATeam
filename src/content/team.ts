import type { TeamMember } from "@/types/content";

export const team: TeamMember[] = [
  {
    name: "Myron Satsyk",
    initials: "MS",
    role: "Senior QA Engineer",
    description:
      "Builds mobile and web automation frameworks from zero — Appium, Cypress and PyTest wired into GitLab CI. Took a text-to-speech app from 0% to ~70% automated coverage and cut regression cycles by over 60%.",
    technologies: ["Appium", "Cypress", "PyTest", "GitLab CI", "Postman", "SQL"],
  },
  {
    name: "Volodymyr Formanchuk",
    initials: "VF",
    role: "QA Engineer — LLM & AI Evaluation",
    description:
      "Designs evaluation frameworks for AI-driven products — factual accuracy, hallucination detection and prompt architecture — alongside PyTest and Playwright suites integrated into CI/CD pipelines.",
    technologies: ["Playwright", "PyTest", "Python", "LLM Evaluation", "GitLab CI", "REST"],
    image: "/images/volodymyr-formanchuk.jpg",
    linkedin: "https://www.linkedin.com/in/volodymyr-formanchuk-296994382",
    github: "https://github.com/vovkafor",
  },
];
