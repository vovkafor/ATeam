"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/config/site";
import { TrackLink } from "@/components/analytics/track-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto grid min-h-18 max-w-site grid-cols-[1fr_auto] items-center px-5 md:grid-cols-[1fr_auto_auto] md:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label={`${siteConfig.name} home`}
        >
          {siteConfig.shortName}
        </Link>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${active ? "text-ink" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <TrackLink
          href="/book"
          event="book_call_clicked"
          properties={{ location: "navigation" }}
          className="ml-8 hidden min-h-10 items-center border border-accent bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:inline-flex"
        >
          Book a call
        </TrackLink>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-line bg-canvas md:hidden">
          <ul>
            {navigation.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link className="block px-5 py-5 text-xl font-medium" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
              </li>
            ))}
            <li className="p-5">
              <TrackLink href="/book" event="book_call_clicked" properties={{ location: "mobile_navigation" }} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center bg-accent px-5 font-medium text-white">
                Book a call
              </TrackLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
