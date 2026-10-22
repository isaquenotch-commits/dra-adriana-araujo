import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useMemo, useRef } from "react";
import { cn, EASE_OUT } from "@/lib/utils";

type SplitMode = "words" | "characters";
type Direction = "up" | "down";

interface KineticTextRevealProps {
  text: string;
  className?: string;
  segmentClassName?: string;
  splitBy?: SplitMode;
  direction?: Direction;
  stagger?: number;
  delay?: number;
  duration?: number;
  /** Start on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Externally controlled play state; overrides in-view triggering. */
  play?: boolean;
  as?: "span" | "p" | "h2" | "h3";
}

/**
 * Adapted from componentry.dev "Kinetic Text Reveal". Each segment slides out
 * of its own clipping mask — the text is built up line by line rather than
 * faded in, so there is no opacity animation at all.
 */
export function KineticTextReveal({
  text,
  className,
  segmentClassName,
  splitBy = "words",
  direction = "up",
  stagger = 0.045,
  delay = 0,
  duration = 0.9,
  immediate = false,
  play,
  as: Tag = "span",
}: KineticTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const visible = play ?? (immediate || inView);

  const segments = useMemo(
    () => text.split(/(\s+)/).filter(Boolean),
    [text],
  );

  const variants: Variants = {
    hidden: { y: direction === "up" ? "110%" : "-110%" },
    visible: (i: number) => ({
      y: "0%",
      transition: reduce ? { duration: 0 } : { duration, ease: EASE_OUT, delay: delay + i * stagger },
    }),
  };

  let index = 0;
  const MotionTag = motion[Tag];
  const mask = (seg: string, key: string | number) => {
    const n = index++;
    return (
      <span key={key} aria-hidden="true" className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
        <motion.span custom={n} variants={variants} className={cn("inline-block", segmentClassName)}>
          {seg}
        </motion.span>
      </span>
    );
  };

  return (
    <MotionTag
      ref={ref as React.Ref<never>}
      className={cn("inline-flex flex-wrap", className)}
      aria-label={text}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      {segments.map((seg, i) => {
        if (/^\s+$/.test(seg)) {
          return (
            <span key={i} aria-hidden="true" className="whitespace-pre">
              {seg}
            </span>
          );
        }
        // Characters stay grouped by word so lines never break mid-word
        if (splitBy === "characters") {
          return (
            <span key={i} aria-hidden="true" className="inline-flex whitespace-nowrap">
              {Array.from(seg).map((ch, c) => mask(ch, c))}
            </span>
          );
        }
        return mask(seg, i);
      })}
    </MotionTag>
  );
}
