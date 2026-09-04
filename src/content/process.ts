import type { ProcessStage } from "@/types/content";

/**
 * Four steps, in the words a client would use. Anything that sounded like a
 * methodology diagram has been cut — the point is that the work is legible to
 * someone who has never bought testing before.
 */
export const processStages: ProcessStage[] = [
  {
    number: "01",
    title: "We look at what you have",
    shortTitle: "Look",
    description:
      "A short call and a look at the product: what breaks most often, what your team checks by hand before every release, and how much of the day that eats.",
    deliverable: "A written list of what hurts, in order of what it costs you.",
  },
  {
    number: "02",
    title: "We agree what to automate first",
    shortTitle: "Agree",
    description:
      "Not everything is worth automating. We pick the handful of journeys where a failure actually costs money — usually sign-up, search, checkout and payment — and start there.",
    deliverable: "A short plan: what gets covered first, and why that order.",
  },
  {
    number: "03",
    title: "We write the tests",
    shortTitle: "Build",
    description:
      "The manual walkthrough becomes a program. You see the first working tests within the first weeks, not at the end — and they live in your repository, not ours.",
    deliverable: "Working tests you own, with a README your developers can follow.",
  },
  {
    number: "04",
    title: "They run by themselves",
    shortTitle: "Run",
    description:
      "The suite starts itself on every change and reports back in plain language: what passed, what broke, and on which step. We keep it healthy as the product changes.",
    deliverable: "A green or red answer before every release, without anyone clicking.",
  },
];
