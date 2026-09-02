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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled ? "glass-scrolled border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto grid min-h-18 max-w-site grid-cols-[1fr_auto] items-center px-5 md:grid-cols-[1fr_auto_auto] md:px-8">
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label={`${siteConfig.name} home`}
        >
          <span
            aria-hidden="true"
            className="relative grid h-7 w-7 place-items-center bg-gradient-to-br from-accent to-[#6d8bff] text-[11px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(36,85,255,0.9)] transition-transform duration-500 group-hover:scale-105"
          >
            A
            <span className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[-0.03em]">
            {siteConfig.shortName}
          </span>
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
                    className={`relative py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:content-[''] hover:text-ink hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                      active ? "text-ink after:scale-x-100" : "text-muted"
                    }`}
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
          className="ml-8 hidden min-h-10 items-center bg-gradient-to-r from-accent to-[#4a72ff] px-4 text-sm font-medium text-white shadow-[0_8px_22px_-12px_rgba(36,85,255,0.95)] transition-[transform,box-shadow,filter] duration-500 hover:-translate-y-px hover:shadow-[0_14px_30px_-12px_rgba(36,85,255,1)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:inline-flex"
        >
          Book a call
        </TrackLink>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line bg-canvas/60 transition-colors hover:border-strong md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-line bg-canvas md:hidden" data-scroll-native>
          <ul>
            {navigation.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link className="block px-5 py-5 text-xl font-medium" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
              </li>
            ))}
            <li className="p-5">
              <TrackLink href="/book" event="book_call_clicked" properties={{ location: "mobile_navigation" }} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center bg-gradient-to-r from-accent to-[#4a72ff] px-5 font-medium text-white">
                Book a call
              </TrackLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
