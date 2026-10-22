import { animate, stagger } from "motion/react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface LetterCascadeProps {
  text: string;
  className?: string;
  staggerDuration?: number;
}

/**
 * Adapted from componentry.dev "Letter Cascade". The front face tips back on
 * its baseline while an echo rolls up from below. The original uses a soft
 * spring; here it runs on an expo-out tween so the letters land without any
 * bounce, as the brief asks for the menu.
 */
export function LetterCascade({ text, className, staggerDuration = 0.022 }: LetterCascadeProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const trigger = useCallback(() => {
    const root = scope.current;
    if (!root || busy.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    const front = root.querySelectorAll(".cascade-front");
    const echo = root.querySelectorAll(".cascade-echo");
    const opts = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: stagger(staggerDuration) };

    animate(front, { transform: ["translateY(0%) rotateX(0deg)", "translateY(-100%) rotateX(90deg)"] }, opts);
    animate(echo, { transform: ["translateY(100%) rotateX(-90deg)", "translateY(0%) rotateX(0deg)"] }, opts).then(() => {
      animate(front, { transform: "translateY(0%) rotateX(0deg)" }, { duration: 0 });
      animate(echo, { transform: "translateY(100%) rotateX(-90deg)" }, { duration: 0 });
      busy.current = false;
    });
  }, [staggerDuration]);

  return (
    <span ref={scope} className={cn("inline-flex", className)} onMouseEnter={trigger} onFocus={trigger} aria-label={text}>
      {Array.from(text).map((letter, i) => (
        <span key={i} aria-hidden="true" className="relative inline-flex overflow-hidden whitespace-pre [perspective:600px]">
          <span className="cascade-front inline-block origin-bottom [backface-visibility:hidden]">{letter}</span>
          <span
            className="cascade-echo absolute inset-0 inline-block origin-top [backface-visibility:hidden]"
            style={{ transform: "translateY(100%) rotateX(-90deg)" }}
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}
