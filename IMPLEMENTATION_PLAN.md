# Implementation plan

## Phase 1 — Foundation

Scaffold a strict TypeScript Next.js App Router project, centralize business configuration and design tokens, and build the reusable layout, navigation, buttons, cards, and technical visual language. Complete a small but recognizable homepage slice before expanding the product surface.

## Phase 2 — Pages

Build the full data-driven homepage and the services, work, case-study, process, about, booking, and privacy routes. Share the same typed content collections across previews and detail pages so project, service, team, process, and FAQ counts cannot drift.

## Phase 3 — Integrations

Isolate the Cal.com inline embed behind a resilient booking component with a configuration-free fallback, and add a no-op analytics boundary. Add route metadata, structured data, robots, sitemap, and canonical URL handling without inventing unknown business details.

## Phase 4 — Testing and CI

Cover high-value behavior with Vitest and Testing Library, then add Playwright navigation, mobile, booking, and axe checks. Reproduce the same lint, typecheck, unit, build, and end-to-end sequence in GitHub Actions.

## Phase 5 — Verification and cleanup

Run every check available in the environment, fix implementation defects, remove starter and dead code, and verify representative responsive widths. Record any browser or Lighthouse limitation honestly instead of estimating results.
