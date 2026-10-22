import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { useSite } from "@/components/SiteContext";
import { SPECIALTIES } from "@/lib/content";
import { pinnedScrollY } from "@/lib/utils";

const N = SPECIALTIES.length;

/**
 * SweetTape-style pinned section (details.so → Pinned Scroll): two huge words
 * hold the frame while the specialty cards travel through the gap between them.
 */
export function Specialties() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSite();
  const jump = (i: number) => ref.current && scrollTo(pinnedScrollY(ref.current, 0.04 + (0.92 * i) / (N - 1)));
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const index = useTransform(scrollYProgress, [0.04, 0.96], [0, N - 1], { clamp: true });
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(index, "change", (v) => setCurrent(Math.round(v)));

  return (
    <section ref={ref} id="tratamentos" className="relative" style={{ height: `${N * 48 + 60}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden paper-grain rounded-t-[40px] bg-terra text-paper">
        <div className="absolute inset-x-0 top-[88px] mx-auto flex max-w-[1600px] items-start justify-between px-4 md:px-10">
          <p className="eyebrow text-paper/60">(03) — Tratamentos</p>
          <p className="font-mono text-[13px] tabular-nums text-paper/80">
            {String(current + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </p>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0">
          <BigWord text="CUIDADO" className="md:flex-1 md:justify-end md:pr-[min(4vw,60px)]" />
          <div className="relative h-[min(40vh,400px)] w-[min(74vw,320px)] shrink-0 md:h-[min(46vh,400px)]">
            {SPECIALTIES.map((s, i) => (
              <Card key={s.title} i={i} index={index} item={s} />
            ))}
          </div>
          <BigWord text="INTEGRAL" className="md:flex-1 md:justify-start md:pl-[min(4vw,60px)]" />
        </div>

        <div className="absolute inset-x-0 bottom-8 mx-auto max-w-[1600px] px-4 md:px-10">
          <div className="h-px w-full bg-paper/20">
            <motion.div className="h-px origin-left bg-paper" style={{ scaleX: bar }} />
          </div>
          <div className="mt-3 flex justify-between lg:pr-24">
            {SPECIALTIES.map((s, i) => (
              <button
                type="button"
                key={s.title}
                onClick={() => jump(i)}
                aria-current={i === current ? "true" : undefined}
                className={`hidden py-2 font-mono text-[10.5px] uppercase tracking-wider transition-colors duration-300 hover:text-paper lg:block ${
                  i === current ? "text-paper" : "text-paper/55"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BigWord({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`relative z-[200] flex ${className}`}>
      <KineticTextReveal
        text={text}
        splitBy="characters"
        stagger={0.04}
        className="whitespace-nowrap text-[clamp(52px,6.4vw,124px)] font-normal leading-none tracking-[-0.02em] text-blush"
      />
    </div>
  );
}

function Card({ i, index, item }: { i: number; index: MotionValue<number>; item: (typeof SPECIALTIES)[number] }) {
  // Distance from the active slot: negative = already passed (above), positive = coming (below)
  const d = useTransform(() => i - index.get());
  const y = useTransform(() => {
    // Neighbours peek in at ±78%; anything further accelerates off screen
    const v = d.get();
    const a = Math.abs(v);
    const off = a <= 1 ? a * 78 : 78 + (Math.min(a, 2.2) - 1) * 260;
    return `${Math.sign(v) * off}%`;
  });
  const scale = useTransform(() => 1 - Math.min(1, Math.abs(d.get())) * 0.16);
  const bg = useTransform(d, [-1, 0, 1], ["#7f4835", "#faf7f2", "#b46e54"]);
  const contentClip = useTransform(d, [-0.6, -0.22, 0.22, 0.6], ["inset(0 0 100% 0)", "inset(0 0 0% 0)", "inset(0 0 0% 0)", "inset(100% 0 0 0)"]);
  const zIndex = useTransform(() => 100 - Math.round(Math.abs(d.get()) * 10));
  const visibility = useTransform(() => (Math.abs(d.get()) > 2.1 ? "hidden" : "visible"));

  return (
    <motion.article
      style={{ y, scale, backgroundColor: bg, zIndex, visibility }}
      className="absolute inset-0 flex flex-col rounded-[34px] p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] md:p-7"
    >
      <motion.div style={{ clipPath: contentClip }} className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">{item.tag}</span>
          <span className="font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <Glyph i={i} />
        <h3 className="mt-auto font-serif text-[clamp(30px,3.2vw,42px)] italic leading-[0.95] text-terra">{item.title}</h3>
        <p className="mt-3 text-[14.5px] leading-snug text-stone">{item.text}</p>
      </motion.div>
    </motion.article>
  );
}

/** A small line drawing for each card — stones, needles, cups, waves. */
function Glyph({ i }: { i: number }) {
  const paths = [
    "M20 70 C 30 40, 50 40, 60 20 M60 20 l -8 4 M60 20 l 2 9 M24 76 h 50", // movement
    "M18 60 h 64 M30 60 v -24 h 40 v 24 M44 36 v -10 h 12 v 10", // post-op
    "M30 14 v 60 M50 22 v 52 M70 18 v 56 M26 74 h 48", // needles
    "M24 60 a 16 14 0 0 1 32 0 M48 60 a 16 14 0 0 1 32 0 M20 62 h 64", // cups
    "M18 58 c 10 -10, 24 -10, 30 0 c 6 -12, 22 -12, 30 0 c 4 -6, 10 -6, 14 0 M18 66 h 74", // stones
    "M20 48 h 14 l 6 -16 l 8 32 l 8 -24 l 6 8 h 18", // MES
    "M24 30 c 10 10, 10 30, 0 40 M40 30 c 10 10, 10 30, 0 40 M56 30 c 10 10, 10 30, 0 40", // ultrasound
    "M50 22 c 18 0, 26 14, 26 28 c 0 16, -12 26, -26 26 c -14 0, -26 -10, -26 -26 c 0 -14, 8 -28, 26 -28 M40 46 h 2 M58 46 h 2", // face
    "M20 50 c 12 -18, 24 18, 36 0 s 24 18, 36 0", // massage wave
    "M50 30 a 8 8 0 1 0 0.1 0 M38 74 c 0 -18, 24 -18, 24 0 M30 50 l -10 -8 M70 50 l 10 -8", // children
  ];
  return (
    <svg viewBox="0 0 100 90" className="mt-5 h-20 w-24 text-clay" aria-hidden="true">
      <motion.path
        d={paths[i % paths.length]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
