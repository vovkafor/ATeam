import type { ComponentProps, CSSProperties, ReactNode } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-site border-x border-line ${className}`} {...props} />;
}

export function Section({ className = "", ...props }: ComponentProps<"section">) {
  return <section className={`border-b border-line ${className}`} {...props} />;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="graph-node h-1.5 w-1.5 shrink-0 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-8 p-5 md:p-10 lg:grid-cols-2 ${className}`}>
      <div data-reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-section font-medium leading-[1.02] tracking-[-0.045em]">{title}</h2>
      </div>
      {description ? (
        <div
          data-reveal
          style={{ "--reveal-delay": "140ms" } as CSSProperties}
          className="self-end text-lg leading-8 text-muted lg:pb-1"
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}

export function TechBadge({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[color-mix(in_oklab,var(--panel)_70%,white)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors duration-500 hover:bg-accent/[0.07] hover:text-accent">
      {children}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="grid min-h-[430px] border-b border-line lg:grid-cols-2">
      <div className="flex flex-col justify-between border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
        <Eyebrow className="fade-up-delayed">{eyebrow}</Eyebrow>
        <h1 className="py-16 text-hero font-medium leading-[0.98] tracking-[-0.055em]">{title}</h1>
      </div>
      <div className="reactive-grid surface flex min-h-[260px] flex-col justify-end gap-8 p-5 md:p-10">
        {aside}
        {description ? (
          <p
            className="fade-up-delayed max-w-lg text-lg leading-8 text-muted md:text-xl"
            style={{ "--rise-delay": "260ms" } as CSSProperties}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function MetricGrid({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <dl className="grid border-t border-line sm:grid-cols-3">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          data-reveal
          style={{ "--reveal-delay": `${index * 110}ms` } as CSSProperties}
          className="group border-b border-line p-5 transition-colors duration-500 last:border-b-0 hover:bg-panel/70 sm:border-b-0 sm:border-r sm:p-8 sm:last:border-r-0"
        >
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{metric.label}</dt>
          <dd className="mt-5 text-[clamp(2rem,4vw,3.75rem)] font-medium leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
