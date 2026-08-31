import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "saas-release-pipeline",
    number: "01",
    title: "Release confidence without the four-hour regression wait",
    clientType: "B2B SaaS Platform",
    summary: "A risk-based Playwright suite and parallel CI pipeline for a fast-moving workflow product.",
    challenge: "A broad but brittle browser suite had become a release bottleneck. Failures were difficult to diagnose, critical workflows were mixed with low-value checks, and teams often reran the full suite before trusting a result.",
    before: "One serial regression job combined setup, browser execution, and reporting. Shared test state caused cascading failures and a single intermittent check could block the release signal.",
    approach: ["Map customer-critical flows to release risk", "Move lower-level checks to API coverage", "Isolate deterministic browser scenarios", "Partition execution by stable timing data"],
    implementation: ["Built Playwright fixtures for isolated test data", "Added parallel CI shards with retry diagnostics", "Published trace, screenshot, and failure ownership data", "Introduced a small release-blocking smoke layer"],
    technologies: ["Playwright", "TypeScript", "GitHub Actions", "Docker", "Allure"],
    metrics: [{ value: "4h → 21m", label: "Regression suite" }, { value: "82%", label: "Critical-flow coverage" }, { value: "3×", label: "Faster release feedback" }],
    result: "The release decision moved from a long, ambiguous batch result to a layered signal available inside the pull-request workflow.",
    lessons: ["Risk tiers should determine execution frequency", "Diagnostic quality matters as much as pass rate", "Test data isolation unlocks safe parallelism"],
    isDemonstration: true,
  },
  {
    slug: "fintech-api-quality-gates",
    number: "02",
    title: "API quality gates for a growing transaction platform",
    clientType: "FinTech Product",
    summary: "Contract and integration coverage designed around high-risk transaction states.",
    challenge: "Fast service changes created regressions at integration boundaries. Browser tests found failures late, while local service tests did not cover real contract and state-transition behavior.",
    before: "Service checks ran independently with limited shared schemas. Integration defects were usually discovered in staging after several dependent changes had merged.",
    approach: ["Identify high-risk contracts and state transitions", "Version shared schemas with the services", "Create environment-independent test data builders", "Gate merges on focused integration coverage"],
    implementation: ["Added schema and consumer contract checks", "Built API workflow suites for transaction lifecycles", "Separated deterministic PR checks from broader nightly coverage", "Added concise failure context to CI annotations"],
    technologies: ["REST", "GraphQL", "Pact", "TypeScript", "GitLab CI"],
    metrics: [{ value: "68%", label: "Fewer staging escapes" }, { value: "8m", label: "PR quality signal" }, { value: "41", label: "Critical contracts covered" }],
    result: "Integration risk became visible before merge, with faster feedback and clearer ownership when a contract changed.",
    lessons: ["Contract ownership must be explicit", "Small deterministic gates outperform one giant suite", "Representative state transitions provide the strongest signal"],
    isDemonstration: true,
  },
  {
    slug: "commerce-performance-baseline",
    number: "03",
    title: "A repeatable performance baseline before peak traffic",
    clientType: "E-commerce Platform",
    summary: "Load models, service-level thresholds, and release comparisons for a high-volume checkout system.",
    challenge: "Performance testing happened manually before major campaigns. Results varied between runs, traffic assumptions were undocumented, and teams lacked a reliable way to compare a release with the previous baseline.",
    before: "Large one-off tests created noisy graphs without shared thresholds. Bottlenecks were discussed after a test rather than isolated through a repeatable workflow.",
    approach: ["Model search, cart, and checkout traffic separately", "Define thresholds from production evidence", "Control test data and warm-up behavior", "Compare every candidate against a versioned baseline"],
    implementation: ["Created modular k6 scenarios", "Added release-level latency and error budgets", "Published Grafana comparison dashboards", "Automated weekly capacity checks outside the PR path"],
    technologies: ["k6", "Grafana", "Prometheus", "GitHub Actions", "OpenTelemetry"],
    metrics: [{ value: "2.4×", label: "Verified peak capacity" }, { value: "31%", label: "p95 latency reduction" }, { value: "0", label: "Undiagnosed threshold failures" }],
    result: "Performance became a tracked release property with repeatable scenarios, agreed thresholds, and faster bottleneck diagnosis.",
    lessons: ["Traffic models need evidence, not guesses", "Warm-up and data shape must be controlled", "Thresholds should identify action, not merely failure"],
    isDemonstration: true,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
