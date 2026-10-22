import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollWordRevealProps {
  /** Words wrapped in *asterisks* render in the serif italic accent. */
  text: string;
  className?: string;
  /** Optional decorations keyed by the accented word, e.g. an AnnotatedText. */
  decorate?: Record<string, (word: string) => ReactNode>;
}

/**
 * motion.dev "Reveal on scroll": each word gets its own slice of the scroll
 * progress. Instead of fading, ink fills each word from pale sand to full
 * black and it rises the last few pixels into place.
 */
export function ScrollWordReveal({ text, className, decorate }: ScrollWordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={text.replace(/\*/g, "")}>
      {words.map((raw, i) => {
        const start = words.length === 1 ? 0 : (i / (words.length - 1)) * 0.8;
        const accent = raw.startsWith("*");
        const word = raw.replace(/\*/g, "");
        const deco = accent ? decorate?.[word.replace(/[.,]/g, "")] : undefined;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 0.2]} accent={accent}>
            {deco ? deco(word) : word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const color = useTransform(progress, range, ["#d9cdbd", accent ? "#9c5b43" : "#1c1a18"]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ color, y }}
      className={cn("mr-[0.25em] inline-block", accent && "font-serif italic")}
    >
      {children}
    </motion.span>
  );
}
