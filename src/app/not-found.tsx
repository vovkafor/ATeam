import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  return <main id="main-content" className="flex-1"><Container className="flex min-h-[65vh] flex-col items-start justify-center p-5 md:p-10"><p className="eyebrow">ERROR / 404</p><h1 className="mt-8 text-hero font-medium tracking-[-0.055em]">Signal not found.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-muted">The requested page or case-study slug does not exist.</p><ButtonLink href="/" className="mt-9">Return home</ButtonLink></Container></main>;
}
