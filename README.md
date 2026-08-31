# A-team agency website

A production-oriented, responsive B2B website for a QA automation agency. The current brand, team, case studies, contact details, and legal information are centralized demonstration placeholders and must be replaced before launch.

## Architecture

The project uses the Next.js App Router with React Server Components by default. Content is stored in typed modules under `src/content`, business configuration lives in `src/config/site.ts`, reusable presentation lives in `src/components`, and integrations are isolated under `src/components/booking` and `src/lib`.

The data layer intentionally exposes simple typed arrays so a future CMS adapter can replace TypeScript content without changing page components. Booking is isolated behind `BookingCalendar`, and analytics calls use the provider-neutral `trackEvent` function.

## Tech stack

- Next.js 16, React 19, strict TypeScript
- Tailwind CSS 4 and centralized CSS design tokens
- Self-hosted Geist Sans and Geist Mono
- Lucide icons
- Cal.com inline embed
- Vitest, React Testing Library, Playwright, and axe

## Directory structure

```text
src/
├── app/          Routes, metadata, sitemap, robots, and errors
├── components/   Layout, UI, cards, sections, visuals, booking, analytics
├── config/       Global business and environment configuration
├── content/      Typed services, projects, team, process, and FAQ data
├── lib/          Provider-neutral analytics boundary
├── test/         Unit-test setup
└── types/        Shared content contracts
tests/e2e/        Playwright navigation, mobile, booking, and axe checks
public/images/    Replaceable local image assets
```

## Getting started

1. Install Node.js 22+ and pnpm 11.
2. Copy `.env.example` to `.env.local` and replace the relevant values.
3. Run `pnpm install`.
4. Run `pnpm dev` and open `http://localhost:3000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin for canonical URLs and sitemap entries |
| `NEXT_PUBLIC_CALCOM_URL` | Full Cal.com event URL for the inline booking calendar |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Public contact email |
| `NEXT_PUBLIC_LINKEDIN_URL` | Company LinkedIn URL |
| `NEXT_PUBLIC_GITHUB_URL` | Company GitHub URL |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Enables the provider-neutral browser event boundary |

No secret keys belong in `NEXT_PUBLIC_*` values.

## Commands

```bash
pnpm dev          # local development
pnpm lint         # ESLint
pnpm typecheck    # strict TypeScript
pnpm test         # unit and component tests
pnpm test:watch   # Vitest watch mode
pnpm build        # production build
pnpm start        # serve the production build
pnpm test:e2e     # Playwright and axe checks
pnpm audit:lighthouse # measured Lighthouse report (requires CHROME_PATH)
```

Playwright requires a browser binary. Install Chromium with `pnpm exec playwright install chromium` if it is not already available.
Set `CHROME_PATH` before `pnpm audit:lighthouse`; add `LIGHTHOUSE_PRESET=desktop` for the desktop report. The default audit uses mobile emulation.

## Content editing

- Edit global company data in `src/config/site.ts` and the environment file.
- Add a service in `src/content/services.ts` using the `Service` contract.
- Add a project in `src/content/projects.ts` using a unique slug. Static case-study routes are generated automatically.
- Add a team member in `src/content/team.ts`; put an optimized local image in `public/images` and define the path once in the content record.
- Edit process stages and FAQ items only in their corresponding content modules.

The current brief requires exactly five services, three projects, four team members, and six process stages. Update tests deliberately if those product requirements change.

## Booking configuration

Set `NEXT_PUBLIC_CALCOM_URL` to a full public event URL such as `https://cal.com/team/event`. The `/book` route renders the Cal.com element inline. When the value is absent or invalid, the component displays the interactive email-based booking planner.

## Testing and CI

Unit tests cover collection integrity, analytics behavior, the booking planner, navigation, mobile menu state, and data-driven cards. Playwright covers route navigation, CTAs, generated case studies, the mobile menu, booking, and axe scans of representative pages. GitHub Actions runs install, lint, typecheck, unit tests, build, Chromium installation, and browser tests.

## Deployment

The application is optimized for Vercel and requires no custom server. Add environment variables in the Vercel project, confirm the production `NEXT_PUBLIC_SITE_URL`, and run the standard `pnpm build` command.

## Future CMS migration

Create an adapter that returns the same `Service`, `Project`, `TeamMember`, `ProcessStage`, and `FAQItem` contracts. Pages and cards should continue to consume those contracts rather than importing a CMS SDK directly. This keeps preview, caching, authentication, and provider changes at the content boundary.

## Before publication

Replace the agency name and mark, all team profiles and images, demonstration case studies and metrics, calendar URL, email, social URLs, and the entire placeholder privacy text. Only publish claims and outcomes that can be verified.
