import { useInView } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  /** One string types once; several strings loop with backspacing. */
  words: string[];
  className?: string;
  /** Base milliseconds per character. */
  speed?: number;
  /** Hold time after a word is fully typed. */
  hold?: number;
  delay?: number;
  loop?: boolean;
  caret?: boolean;
  /** Start typing immediately instead of when scrolled into view. */
  immediate?: boolean;
}

const SLOW_AFTER = /[,.;:!?—]/;

/**
 * Natural-cadence typewriter (motion.dev "Text animation" → Typewriter).
 * Updates textContent directly instead of re-rendering React, and varies the
 * interval per character so it reads as a person typing, not a metronome.
 */
export function Typewriter({
  words: wordList,
  className,
  speed = 55,
  hold = 1700,
  delay = 0,
  loop = wordList.length > 1,
  caret = true,
  immediate = false,
}: TypewriterProps) {
  // Callers pass array literals; key the effect on the content, not the identity
  const key = wordList.join("␟");
  const words = useMemo(() => key.split("␟"), [key]);
  const host = useRef<HTMLSpanElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const inView = useInView(host, { once: true, amount: 0.6 });
  const start = immediate || inView;

  useEffect(() => {
    const node = out.current;
    if (!node || !start) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = words[0];
      return;
    }

    let timer = 0;
    let word = 0;
    let length = 0;
    let deleting = false;

    const cadence = (char: string, index: number, text: string) => {
      let ms = speed * (0.55 + Math.random() * 0.9);
      if (char === " ") ms *= 1.6;
      if (SLOW_AFTER.test(text[index - 1] ?? "")) ms *= 4;
      // Long words speed up once the hand finds its rhythm
      const wordStart = text.lastIndexOf(" ", index - 1) + 1;
      if (index - wordStart > 3) ms *= 0.8;
      return ms;
    };

    const tick = () => {
      const text = words[word];
      if (!deleting) {
        length++;
        node.textContent = text.slice(0, length);
        if (length >= text.length) {
          if (!loop) return;
          deleting = true;
          timer = window.setTimeout(tick, hold);
          return;
        }
        timer = window.setTimeout(tick, cadence(text[length - 1], length, text));
      } else {
        length--;
        node.textContent = text.slice(0, length);
        if (length <= 0) {
          deleting = false;
          word = (word + 1) % words.length;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, speed * 0.45);
      }
    };

    timer = window.setTimeout(tick, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [start, words, speed, hold, delay, loop]);

  return (
    <span
      ref={host}
      className={cn("inline whitespace-pre-wrap", className)}
      aria-label={words.join(", ")}
    >
      <span ref={out} aria-hidden="true" />
      {caret && <span className="caret" aria-hidden="true" />}
    </span>
  );
}
