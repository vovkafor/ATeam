export const siteConfig = {
  name: "A-Team",
  shortName: "A-Team",
  description: "We turn the checks your team does by hand into tests a machine runs on every change.",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@example.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  bookingUrl: process.env.NEXT_PUBLIC_CALCOM_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "#",
  /** Public Upwork profile — the trust badge links here so the rating is checkable. */
  upwork: process.env.NEXT_PUBLIC_UPWORK_URL || "",
} as const;

/* One page carries the pitch, so the nav points at sections of it. */
export const navigation = [
  { href: "/#how", label: "What automation is" },
  { href: "/#services", label: "What we do" },
  { href: "/#process", label: "How we work" },
  { href: "/team", label: "Team" },
] as const;
