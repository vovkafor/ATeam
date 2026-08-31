export const siteConfig = {
  name: "A-team",
  shortName: "A-team",
  description: "Automated testing systems designed around your release process.",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@example.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  bookingUrl: process.env.NEXT_PUBLIC_CALCOM_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "#",
} as const;

export const navigation = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
] as const;
