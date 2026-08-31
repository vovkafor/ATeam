const layers = ["Unit tests", "API tests", "E2E tests"];

export function PipelineDiagram() {
  return (
    <div className="technical-grid border border-line bg-panel p-5 md:p-8" aria-label="Developer to deployment quality pipeline">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {["Developer", "Pull request", "CI"].map((item) => (
          <div key={item} className="contents">
            <div className="w-full border border-strong bg-canvas px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em]">{item}</div>
            <span className="h-7 w-px bg-ink" aria-hidden="true" />
          </div>
        ))}
        <div className="grid w-full border border-ink bg-canvas sm:grid-cols-3">
          {layers.map((layer) => <div key={layer} className="border-b border-ink p-5 text-center font-medium last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">{layer}</div>)}
        </div>
        <span className="h-7 w-px bg-ink" aria-hidden="true" />
        <div className="w-full border border-strong bg-canvas px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em]">Report</div>
        <span className="h-7 w-px bg-accent" aria-hidden="true" />
        <div className="w-full border border-accent bg-accent px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em] text-white">Deploy / verified</div>
      </div>
    </div>
  );
}
