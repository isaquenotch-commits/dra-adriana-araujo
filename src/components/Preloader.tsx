import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/utils";

const RING = "ESTÉTICA • FISIOTERAPIA • ACUPUNTURA • ";
// Half annuli (r 66–98) that cover the ring of text, one per side
const HALF_RING_RIGHT = "M100,2 A98,98 0 0 1 100,198 L100,166 A66,66 0 0 0 100,34 Z";
const HALF_RING_LEFT = "M100,198 A98,98 0 0 1 100,2 L100,34 A66,66 0 0 0 100,166 Z";

/**
 * The page builds itself from the logo: the ring of disciplines is written
 * around the circle, the name is set inside it, then the whole sheet is lifted
 * away with a clip wipe to reveal the hero underneath.
 */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  // Read once on mount (not in the effect, which StrictMode runs twice)
  const [seen] = useState(() => {
    try {
      return sessionStorage.getItem("aa-intro") === "1";
    } catch {
      return false;
    }
  });
  const progress = useMotionValue(0);
  const count = useTransform(() => String(Math.round(progress.get())).padStart(3, "0"));
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = reduce ? 0.2 : seen ? 0.9 : 2.1;
  const done = useRef({ onReveal, onDone });
  done.current = { onReveal, onDone };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      sessionStorage.setItem("aa-intro", "1");
    } catch {
      /* storage can be blocked; the full intro just plays again */
    }
    // Returning visitors in the same session get a short version of the intro
    const run = animate(progress, 100, { duration: reduce ? 0.2 : seen ? 0.9 : 2.1, ease: [0.65, 0, 0.35, 1] });
    // stop() resolves the promise too, so ignore a run that was cleaned up
    let cancelled = false;
    run.then(() => {
      if (cancelled) return;
      setLeaving(true);
      // The hero starts building while the sheet is still lifting
      done.current.onReveal();
      window.setTimeout(() => done.current.onDone(), reduce ? 50 : 950);
    });
    return () => {
      cancelled = true;
      run.stop();
    };
  }, [progress, seen]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink text-paper"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={leaving ? { clipPath: "inset(0% 0% 100% 0%)" } : {}}
      transition={{ duration: 0.9, ease: EASE_IN_OUT }}
      aria-hidden="true"
    >
      <div className="relative size-[min(70vw,340px)]">
        {/* Ring + covers rotate together; the whole thing is transform-only */}
        <motion.div
          className="absolute inset-0"
          initial={{ transform: "rotate(-90deg)" }}
          animate={{ transform: "rotate(0deg)" }}
          transition={{ duration: total, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
            <defs>
              <path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
            </defs>
            <text className="fill-paper font-sans" fontSize="10.5" letterSpacing="3.2">
              <textPath href="#ring">{RING}</textPath>
            </text>
          </svg>
          {/*
            The ring is written in by two half-ring covers (in the background colour)
            that each turn 180° inside a fixed half-clip. Only transforms animate, so
            nothing is repainted — unlike animating a mask's stroke-dashoffset.
            The -90° turn starts the sweep at 9 o'clock, where the text begins.
          */}
          <div className="absolute inset-0 -rotate-90">
            <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute inset-0 size-full"
                initial={{ transform: "rotate(0deg)" }}
                animate={{ transform: "rotate(180deg)" }}
                transition={{ duration: total / 2, ease: [0.55, 0, 1, 0.45] }}
              >
                <path d={HALF_RING_RIGHT} className="fill-ink" />
              </motion.svg>
            </div>
            <div className="absolute inset-0 [clip-path:inset(0_50%_0_0)]">
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute inset-0 size-full"
                initial={{ transform: "rotate(0deg)" }}
                animate={{ transform: "rotate(180deg)" }}
                transition={{ duration: total / 2, ease: [0, 0.55, 0.45, 1], delay: total / 2 }}
              >
                <path d={HALF_RING_LEFT} className="fill-ink" />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {["ADRIANA", "ARAUJO"].map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(28px,7vw,44px)] font-light leading-[1.05] tracking-[0.18em]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.35 + i * 0.12 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
          <motion.span
            className="mt-4 block h-px w-24 origin-left bg-clay"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.7 }}
          />
        </div>
      </div>

      <motion.span className="eyebrow absolute bottom-8 right-6 text-paper/60 md:right-10">{count}</motion.span>
      <span className="eyebrow absolute bottom-8 left-6 text-paper/60 md:left-10">Preparando o espaço</span>
    </motion.div>
  );
}
