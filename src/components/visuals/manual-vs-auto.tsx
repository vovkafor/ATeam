import type { CSSProperties, ReactNode } from "react";
import { Check } from "lucide-react";

const fields = ["Email", "Password", "Card number"];

/** Chrome around both demos, so the two panels read as the same application. */
function BrowserFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-line bg-canvas">
      <div className="flex items-center gap-2 border-b border-line bg-panel px-3 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-strong" />
          <span className="h-2 w-2 rounded-full bg-strong" />
          <span className="h-2 w-2 rounded-full bg-strong" />
        </span>
        <span className="ml-2 truncate font-mono text-[10px] tracking-[0.04em] text-muted">{label}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * The way most people have seen testing done: a person opens the app and
 * repeats the same clicks by hand. The pointer walks one form, one field at a
 * time, and finishes a single check.
 */
function ByHand() {
  return (
    <div className="flex h-full flex-col p-5 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">By hand</p>
      <h3 className="mt-4 text-2xl font-medium tracking-[-0.035em]">A person repeats the clicks.</h3>
      <p className="mt-4 max-w-md leading-7 text-muted">
        Someone opens the app, fills the same form, presses the same button and looks at the result — then does it
        again after the next change. It works, until there are two hundred things to check before Friday.
      </p>

      <div className="relative mt-8">
        <BrowserFrame label="checkout — one person, one browser">
          <div className="relative p-5">
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field} className="relative h-11 border border-line bg-panel">
                  <span
                    data-field={index}
                    className="hand-fill absolute inset-y-0 left-0 w-full bg-accent/15"
                    aria-hidden="true"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    {field}
                  </span>
                </div>
              ))}

              <span className="hand-press mt-2 grid h-11 place-items-center border border-strong font-mono text-[10px] uppercase tracking-[0.12em]">
                Pay now
              </span>
            </div>

            {/* The pointer: the whole point of the panel is that a human hand
                drives it, one field at a time. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 20"
              className="hand-cursor pointer-events-none absolute left-[58%] top-4 h-5 w-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            >
              <path d="M1 1 L1 16 L5 12.4 L7.6 18.4 L10.4 17.2 L7.9 11.4 L13 11 Z" fill="var(--ink)" stroke="var(--canvas)" strokeWidth="1" />
            </svg>

            <p className="hand-result mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-signal-ok">
              <Check aria-hidden="true" size={12} strokeWidth={2.5} />
              1 check done — 199 to go
            </p>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/**
 * The same check, written down once. The code block is the "what does a test
 * look like" answer; the grid beside it is what happens when a machine, not a
 * person, presses the buttons.
 */
function Automated() {
  return (
    <div className="flex h-full flex-col p-5 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Automated</p>
      <h3 className="mt-4 text-2xl font-medium tracking-[-0.035em]">The clicks are written down once.</h3>
      <p className="mt-4 max-w-md leading-7 text-muted">
        We write those same steps as a short program. A machine then repeats them on every change, in every browser,
        many at a time — and tells you exactly which step broke.
      </p>

      <div className="mt-8 grid gap-4">
        <BrowserFrame label="checkout.spec.ts — the steps, written down">
          <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-6 text-muted md:text-xs">
            <code>
              <span className="text-accent">fill</span>(<span className="text-signal-ok">&quot;Email&quot;</span>,{" "}
              <span className="text-signal-ok">&quot;lena@shop.io&quot;</span>){"\n"}
              <span className="text-accent">fill</span>(<span className="text-signal-ok">&quot;Card number&quot;</span>,{" "}
              <span className="text-signal-ok">&quot;4242 4242…&quot;</span>){"\n"}
              <span className="text-accent">click</span>(<span className="text-signal-ok">&quot;Pay now&quot;</span>){"\n"}
              <span className="text-accent">expect</span>(page).<span className="text-ink">toSay</span>(
              <span className="text-signal-ok">&quot;Order confirmed&quot;</span>)
              <span className="auto-caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent" aria-hidden="true" />
            </code>
          </pre>
        </BrowserFrame>

        <div className="border border-line bg-canvas p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Running everywhere at once</p>
            <span aria-hidden="true" className="relative h-px flex-1 bg-line">
              <span className="auto-sweep absolute inset-0 block origin-left bg-accent/70" />
            </span>
          </div>

          <div aria-hidden="true" className="mt-5 grid grid-cols-6 gap-2">
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={index}
                style={{ "--tile-index": index } as CSSProperties}
                className="auto-tile grid aspect-[4/3] place-items-center border"
              >
                <Check
                  size={13}
                  strokeWidth={2.5}
                  style={{ "--tile-index": index } as CSSProperties}
                  className="auto-tick text-signal-ok"
                />
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-muted">
            Chrome, Safari, Firefox, phones — on every commit, overnight, without anyone sitting there.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Side-by-side explainer for visitors who have only ever seen manual testing.
 * Both panels run continuously and never claim a figure: the difference in
 * pace between the two is the whole argument.
 */
export function ManualVsAuto() {
  return (
    <div className="demo grid border-t border-line lg:grid-cols-2">
      <div data-reveal="left" className="border-b border-line lg:border-b-0 lg:border-r">
        <ByHand />
      </div>
      <div data-reveal="right" className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_70%_0%,rgba(76,125,255,0.10),transparent_65%)]"
        />
        <div className="relative">
          <Automated />
        </div>
      </div>
    </div>
  );
}
