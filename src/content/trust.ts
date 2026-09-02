export type TrustSignal = {
  value: string;
  label: string;
  detail: string;
  /** Optional external proof — rendered as a link so the claim is checkable. */
  href?: string;
};

/**
 * Claims that go on a public page, so each one is tied to something a
 * prospective client can verify: a public profile, a named institution, or a
 * figure taken from the team's own record.
 */
export const trustSignals: TrustSignal[] = [
  {
    value: "100%",
    label: "Job success on Upwork",
    detail: "Every engagement closed with positive client feedback.",
  },
  {
    value: "Apple",
    label: "Developer Academy, Naples",
    detail: "Myron completed the Academy's software engineering programme in 2022.",
  },
  {
    value: "9+ yrs",
    label: "Combined QA experience",
    detail: "Mobile, web, API and AI systems — from startup MVPs to enterprise e-commerce.",
  },
  {
    value: "EU / CET",
    label: "Remote, async-first",
    detail: "Based in Italy, working across European and US time zones.",
  },
];

export const collaboration = {
  title: "Two engineers, one release signal.",
  intro:
    "A-Team is deliberately small. You work directly with the two people writing the tests — no account layer, no handover to juniors, no rotating bench.",
  points: [
    {
      title: "Split by layer, not by ticket",
      detail:
        "Myron owns the automation frameworks and their place in the delivery pipeline. Volodymyr owns evaluation and the API and UI coverage above it. The seam between them is the release signal, and it is nobody's blind spot.",
    },
    {
      title: "We have shipped the same product before",
      detail:
        "Both of us ran QA on Speechify — Myron on the mobile automation framework, Volodymyr on AI voice output and the parsing pipelines behind it. The working rhythm is already built.",
    },
    {
      title: "Async-first, written down",
      detail:
        "Findings arrive as reproducible reports, not as a meeting. Test cases, rubrics and diagnostics stay in your repository and tracker, so the work survives the engagement.",
    },
  ],
} as const;
