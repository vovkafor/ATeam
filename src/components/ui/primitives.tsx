import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-site border-x border-line ${className}`} {...props} />;
}

export function Section({ className = "", ...props }: ComponentProps<"section">) {
  return <section className={`border-b border-line ${className}`} {...props} />;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
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
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-section font-medium leading-[1.02] tracking-[-0.045em]">{title}</h2>
      </div>
      {description ? <div className="self-end text-lg leading-8 text-muted lg:pb-1">{description}</div> : null}
    </div>
  );
}

export function TechBadge({ children }: { children: ReactNode }) {
  return <span className="border border-line bg-canvas px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{children}</span>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: ReactNode }) {
  return (
    <div className="grid min-h-[430px] border-b border-line lg:grid-cols-2">
      <div className="flex flex-col justify-between border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="py-16 text-hero font-medium leading-[0.98] tracking-[-0.055em]">{title}</h1>
      </div>
      <div className="technical-grid flex min-h-[260px] items-end bg-panel p-5 md:p-10">
        {description ? <p className="max-w-lg text-lg leading-8 text-muted md:text-xl">{description}</p> : null}
      </div>
    </div>
  );
}

export function MetricGrid({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <dl className="grid border-t border-line sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="border-b border-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:p-8 sm:last:border-r-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{metric.label}</dt>
          <dd className="mt-5 text-[clamp(2rem,4vw,3.75rem)] font-medium leading-none tracking-[-0.05em]">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
