import Link from "next/link";
import { navigation, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer>
      <Container className="grid lg:grid-cols-2">
        <div className="border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
          <Link href="/" className="font-mono text-sm font-semibold">{siteConfig.shortName}</Link>
          <p className="mt-8 max-w-md text-lg leading-8 text-muted">{siteConfig.description}</p>
          <p className="mt-16 font-mono text-[10px] tracking-[0.1em] text-muted">© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
        <div className="grid grid-cols-2">
          <div className="border-r border-line p-5 md:p-10">
            <p className="eyebrow">EXPLORE</p>
            <ul className="mt-7 space-y-4 text-sm">
              {navigation.map((item) => <li key={item.href}><Link className="hover:text-accent" href={item.href}>{item.label}</Link></li>)}
              <li><Link className="hover:text-accent" href="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div className="p-5 md:p-10">
            <p className="eyebrow">CONNECT</p>
            <ul className="mt-7 space-y-4 text-sm">
              <li><Link className="font-medium text-accent hover:underline" href="/book">Book a call</Link></li>
              <li><a className="hover:text-accent" href={siteConfig.linkedin}>LinkedIn</a></li>
              <li><a className="hover:text-accent" href={siteConfig.github}>GitHub</a></li>
              <li><a className="break-all hover:text-accent" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
