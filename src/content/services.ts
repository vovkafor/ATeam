import type { Service } from "@/types/content";

/**
 * Three things we do, said in words a founder can repeat to their team. The
 * slugs match the clips in the bento section, so every entry has a visual.
 */
export const services: Service[] = [
  {
    slug: "web-ui-automation",
    number: "01",
    title: "Testing the app people click",
    description:
      "We turn the walkthrough your team does by hand — sign up, search, add to cart, pay — into a program that repeats it in every browser, on every change, and shows you the exact screen where it broke.",
    technologies: ["Playwright", "Cypress", "Selenium", "TypeScript"],
  },
  {
    slug: "api-automation",
    number: "02",
    title: "Testing what's behind the screen",
    description:
      "Under every button there is a request to a server. We check those directly, so a broken price, a lost order or a wrong total is caught in seconds — before anyone has to notice it in the interface.",
    technologies: ["REST", "GraphQL", "Postman", "Python"],
  },
  {
    slug: "ci-cd-integration",
    number: "03",
    title: "Running it all automatically",
    description:
      "The tests live next to your code and start themselves whenever a developer changes something. Everything runs in parallel, and the team gets one clear answer before the change reaches your customers: safe, or not.",
    technologies: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker"],
  },
];
