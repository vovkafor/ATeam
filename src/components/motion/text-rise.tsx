import { Fragment, type CSSProperties } from "react";

/**
 * Word-by-word entrance for headings. Pure CSS with a per-word index, so this
 * stays a server component and the text is always in the DOM for crawlers and
 * screen readers (each word keeps its natural spacing and line breaks).
 */
export function TextRise({
  text,
  className = "",
  delay = 0,
  step,
}: {
  text: string;
  className?: string;
  /** Delay in ms before the first word starts. */
  delay?: number;
  /** Optional override for the per-word stagger in ms. */
  step?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={`text-rise ${className}`} style={{ "--rise-delay": `${delay}ms` } as CSSProperties}>
      {words.map((word, index) => (
        // The separating space must sit *outside* the masking span: trailing
        // whitespace inside an overflow-hidden inline-block collapses away.
        <Fragment key={`${word}-${index}`}>
          <span>
            <span
              style={
                {
                  "--word-index": index,
                  ...(step ? { animationDelay: `calc(${index} * ${step}ms + ${delay}ms)` } : null),
                } as CSSProperties
              }
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
