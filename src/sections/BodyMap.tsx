import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useRef, useState } from "react";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { REGIONS } from "@/lib/content";
import { useSite } from "@/components/SiteContext";
import { cn, EASE_IN_OUT, EASE_OUT, pinnedScrollY } from "@/lib/utils";

const Spine = lazy(() => import("@/three/Spine"));
const N = REGIONS.length;

/**
 * Hone-style pinned list (details.so → Scroll Animations): the active region
 * lights up in the list and on the 3D spine while its card is wiped in.
 */
export function BodyMap() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSite();
  const jump = (i: number) => ref.current && scrollTo(pinnedScrollY(ref.current, 0.05 + (0.9 * i) / (N - 1)));
  const stage = useRef<HTMLDivElement>(null);
  const built = useInView(stage, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const index = useTransform(scrollYProgress, [0.05, 0.95], [0, N - 1], { clamp: true });
  const [active, setActive] = useState(0);
  useMotionValueEvent(index, "change", (v) => setActive(Math.round(v)));
  const listY = useTransform(() => `${(1 - index.get()) * 1.1}em`);
  const region = REGIONS[active];

  return (
    <section ref={ref} id="onde-doi" className="paper-grain relative bg-ink text-paper" style={{ height: `${N * 70 + 40}vh` }}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-[96px] z-10 mx-auto max-w-[1600px] px-4 md:px-10">
          <p className="eyebrow text-paper/50">(04) — Onde dói?</p>
          <KineticTextReveal
            as="h2"
            text="Cada região pede um cuidado diferente."
            className="mt-3 max-w-[520px] text-[clamp(22px,2.4vw,34px)] font-light leading-tight"
          />
        </div>

        {/* 3D spine */}
        <div className="absolute inset-0 left-[30%] md:left-[18%] md:right-[18%]">
          <Suspense fallback={null}>
            <Spine range={region.range} built={built} />
          </Suspense>
        </div>

        {/* Region list */}
        <div className="pointer-events-none absolute left-4 top-1/2 h-[3.3em] -translate-y-1/2 overflow-hidden text-[clamp(40px,6.4vw,104px)] font-light leading-[1.1] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)] md:left-10">
          <motion.ul style={{ y: listY }}>
            {REGIONS.map((r, i) => (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "pointer-events-auto flex items-start gap-2 whitespace-nowrap transition-colors duration-500 hover:text-paper/60",
                    i === active ? "text-paper hover:text-paper" : "text-paper/20",
                  )}
                >
                  {r.name}
                <span
                  className={cn(
                    "mt-[0.25em] size-[0.14em] rounded-full border transition-colors duration-500",
                      i === active ? "border-clay bg-clay" : "border-paper/30",
                    )}
                  />
                </button>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Region card */}
        <div className="absolute bottom-8 left-4 right-4 md:bottom-auto md:left-auto md:right-10 md:top-1/2 md:w-[340px] md:-translate-y-1/2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.article
              key={region.name}
              initial={{ clipPath: "inset(100% 0 0 0 round 22px)" }}
              animate={{ clipPath: "inset(0% 0 0 0 round 22px)" }}
              exit={{ clipPath: "inset(0 0 100% 0 round 22px)" }}
              transition={{ duration: 0.7, ease: EASE_IN_OUT }}
              className="flex flex-col rounded-[22px] bg-clay p-6 text-ink md:min-h-[360px]"
            >
              <span className="eyebrow text-ink/60">Região · {region.name}</span>
              <h3 className="mt-3 font-serif text-[28px] italic leading-[1.05] md:mt-auto md:text-[32px]">{region.title}</h3>
              <p className="mt-3 text-[14.5px] leading-snug text-ink/80">{region.text}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/15 pt-4">
                {region.tools.map((t, k) => (
                  <motion.span
                    key={t}
                    className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper"
                    initial={{ clipPath: "inset(0 100% 0 0 round 999px)" }}
                    animate={{ clipPath: "inset(0 0% 0 0 round 999px)" }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 + k * 0.08 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
