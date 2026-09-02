import type { TeamMember } from "@/types/content";

export const team: TeamMember[] = [
  {
    slug: "myron-satsyk",
    name: "Myron Satsyk",
    initials: "MS",
    role: "Senior QA Engineer",
    focus: "Mobile and web automation frameworks, built from an empty repository.",
    description:
      "Five years across iOS, Android and web — standing up automation where none existed, wiring it into GitLab CI, and turning long manual regression passes into a signal a team can release on.",
    technologies: ["Appium", "Cypress", "Selenium", "PyTest", "GitLab CI", "Postman", "SQL", "Docker"],
    strengths: [
      "Starts from zero — a full Appium + Python + PyTest framework stood up and running in CI within months, not quarters.",
      "Treats regression time as an engineering metric: cutting it is what unlocked a weekly release cadence.",
      "Tests below the UI. Complex SQL queries and database performance analysis catch data-integrity defects the interface never shows.",
      "Owns the process, not just the tests — bug lifecycle in JIRA, cases in TestRail, reporting in Allure.",
    ],
    highlights: [
      { value: "0 → 70%", label: "Automated coverage in 4 months" },
      { value: "−60%", label: "Manual regression cycle time" },
      { value: "#1", label: "US App Store category rank" },
    ],
    experience: [
      {
        role: "Senior QA Engineer",
        org: "Creativeclicks",
        period: "Jun 2023 — Present",
        detail:
          "Fitness and health tracking app on iOS and Android. Cross-platform strategy across 15+ device and OS combinations, with real-time device sync validated on 3G, 4G, Wi-Fi and offline.",
      },
      {
        role: "QA Engineer",
        org: "Speechify",
        period: "Jan 2021 — Feb 2023",
        detail:
          "Built the mobile automation framework from zero with Appium, Python and PyTest, and ran it on every merge request through GitLab CI. Established the QA process and documentation standards from scratch.",
      },
      {
        role: "QA Engineer",
        org: "Transoftgroup",
        period: "Apr 2019 — Jun 2021",
        detail:
          "Led end-to-end QA for a Magento 1 → 2 migration across 200+ cases covering payment gateways and extensions, plus Cypress regression and JMeter load testing.",
      },
    ],
    education: [
      { program: "Software Engineering", school: "Apple Developer Academy, Naples", period: "2021 — 2022", featured: true },
      { program: "B.Sc. Information Technologies", school: "Uzhhorod National University", period: "2016 — 2021" },
    ],
  },
  {
    slug: "volodymyr-formanchuk",
    name: "Volodymyr Formanchuk",
    initials: "VF",
    role: "QA Engineer — LLM & AI Evaluation",
    focus: "Evaluation frameworks for AI systems, alongside classic manual and automated QA.",
    description:
      "Four years across web, mobile and AI-driven products. Scores model output where it actually breaks — factual accuracy, coherence, hallucination — and backs it with PyTest and Playwright suites running in CI.",
    technologies: ["Playwright", "PyTest", "Python", "Selenium", "Appium", "GitLab CI", "REST", "LLM Evaluation"],
    strengths: [
      "Evaluates LLM output on the axes that matter — factual accuracy, coherence, relevance — with rubrics refined until the flagged issues are the real ones.",
      "Detects hallucination systematically: factual drift and structural inconsistency annotated as evidence, not opinion.",
      "Designs prompt architecture, so output consistency improves upstream instead of being patched in review.",
      "Works both sides of the discipline — exploratory and manual passes feed directly into the automated Playwright and PyTest coverage.",
      "Built an autonomous AI test agent that reads application context and generates executable flows without predefined scripts.",
    ],
    highlights: [
      { value: "+30%", label: "Flagged-issue precision" },
      { value: "4+ yrs", label: "Web, mobile and AI products" },
      { value: "C1", label: "English — fluent, async-first" },
    ],
    experience: [
      {
        role: "Lead QA Engineer — LLM & AI Evaluation",
        org: "Independent consultant",
        period: "2024 — Present",
        detail:
          "Architected LLM evaluation frameworks across concurrent client projects, engineered a hallucination-detection workflow, and built PyTest suites integrated into GitLab CI pipelines.",
      },
      {
        role: "QA Engineer — AI Speech Technology",
        org: "Speechify",
        period: "2022 — 2024",
        detail:
          "Evaluated AI voice output for accuracy, naturalness and pronunciation across languages, and tested REST endpoints and document-parsing pipelines for PDFs, articles and unstructured text.",
      },
      {
        role: "QA Engineer — Mobile",
        org: "Contract",
        period: "2023 — 2024",
        detail:
          "Functional, regression, compatibility and localization testing across a full one-year release cycle on a live mobile game title, on real iOS and Android devices and emulators.",
      },
      {
        role: "Junior QA Engineer",
        org: "QA Studio",
        period: "2021 — 2022",
        detail:
          "Manual functional, regression and UI testing across multiple web projects, writing cases and checklists from scratch while training in Python, PyTest and Selenium.",
      },
    ],
    education: [
      { program: "Software Development & IT", school: "Computer Academy “Step”, Mykolayiv", period: "2016 — 2021" },
    ],
    image: "/images/volodymyr-formanchuk.jpg",
    linkedin: "https://www.linkedin.com/in/volodymyr-formanchuk-296994382",
    github: "https://github.com/vovkafor",
  },
];

export function getTeamMember(slug: string) {
  return team.find((member) => member.slug === slug);
}
