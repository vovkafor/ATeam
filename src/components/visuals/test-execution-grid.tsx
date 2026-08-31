export function TestExecutionGrid({ label = "EXECUTION GRID" }: { label?: string }) {
  const cells = Array.from({ length: 32 }, (_, index) => index);
  return (
    <div className="technical-grid relative min-h-[320px] overflow-hidden border border-line bg-panel p-5" aria-hidden="true">
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted">{label} / 32</p>
      <div className="absolute inset-x-5 bottom-5 top-16 grid grid-cols-8 gap-2">
        {cells.map((cell) => (
          <span key={cell} className={`border ${cell % 7 === 0 || cell > 27 ? "border-accent bg-accent" : "border-strong bg-canvas"}`} />
        ))}
      </div>
    </div>
  );
}
