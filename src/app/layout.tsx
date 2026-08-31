import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import "./globals.css";

function metadataBase() {
  try {
    return new URL(siteConfig.siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: `${siteConfig.name} — Testing infrastructure built to ship`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Testing infrastructure built to ship`,
    description: siteConfig.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${siteConfig.name}: Testing infrastructure built to ship.` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Testing infrastructure built to ship`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <script type="application/ld+json">{JSON.stringify(organizationData)}</script>
      </body>
    </html>
  );
}
