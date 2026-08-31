import type { FAQItem } from "@/types/content";

export const faqItems: FAQItem[] = [
  { question: "How long does a typical audit take?", answer: "Most focused audits take two to three weeks. Scope depends on the number of applications, test suites, environments, and delivery pipelines involved." },
  { question: "Do you improve existing suites or only build greenfield systems?", answer: "Both. We often stabilize and restructure an existing suite before adding coverage. When replacement is more economical, we document the tradeoff and migrate in controlled slices." },
  { question: "Which team members need to be involved?", answer: "A technical lead, someone close to release operations, and product context for critical customer journeys are usually enough to begin. We keep workshops focused and time-bounded." },
  { question: "Can you work inside our current CI/CD platform?", answer: "Yes. We design around the delivery system you already operate, including GitHub Actions, GitLab CI, Jenkins, and other standard pipeline platforms." },
  { question: "How do you prevent another flaky automation suite?", answer: "We start with testability, isolated data, deterministic boundaries, clear ownership, and suite health metrics. Coverage only scales after the execution model is trustworthy." },
];
