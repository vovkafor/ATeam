import type { ClientEngagement } from "@/types/content";

/**
 * Where the team has worked.
 *
 * ⚠️ REVIEW BEFORE LAUNCH — these are public claims about real companies.
 * Speechify, Creative Clicks, Tower of Fantasy and Transform Group are written
 * from the team's own CVs. Adobe, Feeld, Prism, Salt.XO and Ericka J. carry
 * DRAFT `product`, `work` and `skills` assembled from the team's stack:
 * replace them with what actually happened, or delete the entry.
 *
 * Two names to confirm: Myron's CV says "Transoftgroup" while the logo says
 * "Transform Group", and Prism is branded "PRISM by Block Convey".
 *
 * Logos are keyed to transparency and normalised to 160px tall in
 * `public/logos/`. `logo.width` must match the file, or the browser derives the
 * wrong aspect ratio from the attributes and squashes the mark.
 */
export const clients: ClientEngagement[] = [
  {
    slug: "speechify",
    name: "Speechify",
    logo: { src: "/logos/speechify.png", width: 254, height: 160 },
    product: "Text-to-speech reading app for iOS, Android and web.",
    work: "Built the mobile automation framework from an empty repository and ran it on every merge request, then evaluated the AI voice output itself.",
    skills: ["Appium", "PyTest", "GitLab CI", "REST API testing", "AI voice evaluation", "iOS + Android"],
  },
  {
    slug: "creative-clicks",
    name: "Creative Clicks",
    logo: { src: "/logos/creative-clicks.png", width: 457, height: 160 },
    product: "Fitness and health tracking app on iOS and Android.",
    work: "Cross-platform release testing across 15+ device and OS combinations, with device sync verified on 3G, 4G, Wi-Fi and fully offline.",
    skills: ["Appium", "Cypress", "Real-device testing", "Network conditions", "TestRail", "Allure"],
  },
  {
    slug: "tower-of-fantasy",
    name: "Tower of Fantasy",
    logo: { src: "/logos/tower-of-fantasy.png", width: 540, height: 160 },
    product: "Live mobile game with a year-long release cycle.",
    work: "Functional, regression, compatibility and localization passes on real iOS and Android devices and emulators, release after release.",
    skills: ["Mobile game QA", "Regression", "Compatibility", "Localization", "Emulators + devices"],
  },
  {
    slug: "transform-group",
    name: "Transform Group",
    logo: { src: "/logos/transform-group.png", width: 452, height: 160 },
    product: "E-commerce platform on Magento.",
    work: "Owned QA for the Magento 1 → 2 migration: 200+ cases across payment gateways and extensions, plus Cypress regression and JMeter load runs.",
    skills: ["Cypress", "JMeter", "Payment gateways", "Migration testing", "SQL"],
  },
  {
    slug: "adobe",
    name: "Adobe",
    logo: { src: "/logos/adobe.png", width: 94, height: 160 },
    product: "Creative and document software used at very large scale.",
    work: "Browser coverage of critical flows, kept stable across versions and screen sizes.",
    skills: ["Playwright", "Selenium", "Cross-browser", "Visual regression", "Localization"],
  },
  {
    slug: "feeld",
    name: "Feeld",
    logo: { src: "/logos/feeld.png", width: 856, height: 160 },
    product: "Social app with privacy-sensitive user flows.",
    work: "Sign-up, matching and account journeys covered on both platforms, with private data kept out of test runs.",
    skills: ["Appium", "iOS + Android", "Account flows", "Privacy-safe test data", "CI runs"],
  },
  {
    slug: "prism",
    name: "Prism",
    logo: { src: "/logos/prism.png", width: 489, height: 160 },
    product: "AI governance platform by Block Convey.",
    work: "Evaluation of model output where the answer has to hold up: factual accuracy, drift and the API contracts underneath.",
    skills: ["LLM evaluation", "Hallucination detection", "API contract testing", "Python", "PyTest"],
  },
  {
    slug: "saltxo",
    name: "Salt.XO",
    logo: { src: "/logos/saltxo.png", width: 434, height: 160 },
    product: "Handcrafted skincare brand selling direct to customers.",
    work: "Storefront and checkout journeys automated end to end, plus the regression pass that runs before each release.",
    skills: ["Cypress", "Checkout flows", "Payment gateways", "Postman", "Regression suites"],
  },
  {
    slug: "ericka-j",
    name: "Ericka J.",
    logo: { src: "/logos/ericka-j.png", width: 374, height: 160 },
    product: "Creator brand with an online store and booking.",
    work: "Booking and purchase flows checked across browsers and phones, so a launch day never turns into a support day.",
    skills: ["Playwright", "Cross-browser", "Mobile web", "Booking flows", "Exploratory testing"],
  },
];
