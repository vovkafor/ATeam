"use client";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <main id="main-content" className="mx-auto flex min-h-[65vh] w-full max-w-site flex-col items-start justify-center border-x border-line p-5 md:p-10"><p className="eyebrow">ERROR / RECOVERABLE</p><h1 className="mt-8 text-hero font-medium tracking-[-0.055em]">The quality signal broke.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-muted">Try the request again. If the problem persists, return to the homepage.</p><button type="button" onClick={retry} className="mt-9 min-h-12 border border-accent bg-accent px-5 font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Try again</button></main>;
}
