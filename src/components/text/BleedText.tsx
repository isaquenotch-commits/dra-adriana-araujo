import { animate, useInView } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

interface BleedTextProps {
  /** Use "\n" for explicit line breaks. */
  text: string;
  className?: string;
  lineClassName?: string;
  /** Per-line classes, e.g. to set the last line in the serif italic. */
  lineClassNames?: string[];
  /** Ink colour the letters bleed from before settling. */
  inkFrom?: string;
  delay?: number;
  stagger?: number;
  /** Start on mount instead of when scrolled into view. */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}

/**
 * Ink-bleed reveal. Every letter starts as a wet, swollen blot of ink and
 * draws itself tight: blur and spread contract while an SVG displacement
 * filter pulls the ragged edges back into a clean glyph. Nothing fades —
 * the letters are always on the page, they just set like ink on paper.
 */
export function BleedText({
  text,
  className,
  lineClassName,
  lineClassNames,
  inkFrom = "#b98a6e",
  delay = 0,
  stagger: step = 0.035,
  immediate = false,
  as: Tag = "h2",
}: BleedTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const filterId = useId().replace(/:/g, "");
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const start = immediate || inView;

  useEffect(() => {
    const root = ref.current;
    if (!root || !start) return;
    const chars = root.querySelectorAll<HTMLElement>("[data-bleed]");
    const lineEls = root.querySelectorAll<HTMLElement>("[data-bleed-line]");
    const displace = root.querySelector("feDisplacementMap");
    const soften = root.querySelector("feGaussianBlur");
    const wrap = root.querySelector<HTMLElement>("[data-bleed-wrap]");

    // Lines start in the wet ink colour (data-wet) and transition back to
    // their own colour in CSS — no colour is ever read back from the DOM.
    const settle = () => {
      if (wrap) wrap.style.filter = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((c) => (c.style.transform = "none"));
      lineEls.forEach((l) => l.removeAttribute("data-wet"));
      settle();
      return;
    }

    // Letters only ever animate transform, so each one stays on the compositor.
    const letters = animate(
      chars,
      { transform: ["scale(1.35, 1.6)", "scale(1, 1)"] },
      { duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: (i: number) => delay + i * step },
    );

    lineEls.forEach((l) => l.removeAttribute("data-wet"));

    // Wet edges and blur are one SVG filter pass over the whole heading,
    // instead of a blur filter (and GPU layer) on every single letter.
    const total = delay + chars.length * step + 1.25;
    const edges = animate(1, 0, {
      duration: total,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => {
        displace?.setAttribute("scale", (v * 28).toFixed(2));
        soften?.setAttribute("stdDeviation", (v * 7).toFixed(2));
      },
    });
    // Once the ink has set, drop the filter so the text is plain text again
    let cancelled = false;
    edges.then(() => {
      if (!cancelled) settle();
    });

    return () => {
      cancelled = true;
      letters.stop();
      edges.stop();
    };
  }, [start, inkFrom, delay, step]);

  const lines = text.split("\n");

  return (
    <Tag ref={ref} className={cn("relative", className)} aria-label={text.replace(/\n/g, " ")}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="soft" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span aria-hidden="true" data-bleed-wrap style={{ filter: `url(#${filterId})` }} className="block">
        {lines.map((line, li) => {
          const before = lines.slice(0, li).join("").replace(/s/g, "").length;
          const count = line.replace(/s/g, "").length;
          return (
          <span
            key={li}
            data-bleed-line
            data-wet=""
            className={cn("block", lineClassName, lineClassNames?.[li])}
            style={
              {
                "--wet": inkFrom,
                transition: `color ${1.1 + count * step}s cubic-bezier(.33,1,.68,1) ${delay + before * step}s`,
              } as React.CSSProperties
            }
          >
            {line.split(" ").map((word, wi, arr) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} data-bleed className="inline-block origin-bottom" style={{ transform: "scale(1.35, 1.6)" }}>
                    {ch}
                  </span>
                ))}
                {wi < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
          );
        })}
      </span>
    </Tag>
  );
}

