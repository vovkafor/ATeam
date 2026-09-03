import Link from "next/link";
import { navigation, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer>
      <Container className="grid gap-12 border-t border-line px-5 py-16 md:px-10 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <Link href="/" className="font-mono text-sm font-semibold">{siteConfig.shortName}</Link>
          <p className="mt-8 max-w-md text-lg leading-8 text-muted">{siteConfig.description}</p>
          <p className="mt-14 font-mono text-[10px] tracking-[0.1em] text-muted">© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <ul className="mt-7 space-y-4 text-sm">
              {navigation.map((item) => <li key={item.href}><Link className="text-muted transition-colors duration-500 hover:text-ink" href={item.href}>{item.label}</Link></li>)}
              <li><Link className="text-muted transition-colors duration-500 hover:text-ink" href="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">CONNECT</p>
            <ul className="mt-7 space-y-4 text-sm">
              <li><Link className="font-medium text-accent hover:underline" href="/book">Book a call</Link></li>
              <li><a className="text-muted transition-colors duration-500 hover:text-ink" href={siteConfig.linkedin}>LinkedIn</a></li>
              <li><a className="text-muted transition-colors duration-500 hover:text-ink" href={siteConfig.github}>GitHub</a></li>
              <li><a className="break-all text-muted transition-colors duration-500 hover:text-ink" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
