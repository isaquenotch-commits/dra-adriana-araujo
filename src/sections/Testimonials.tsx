import { animate, AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BleedText } from "@/components/text/BleedText";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { TESTIMONIALS } from "@/lib/content";
import { cn, EASE_IN_OUT, EASE_OUT } from "@/lib/utils";

const N = TESTIMONIALS.length;
const AUTOPLAY_MS = 9000;

/**
 * Review deck. The front card is wiped away upwards (clip-path) and the next
 * one rises out of the stack behind it — the deck is rebuilt, never faded.
 * Autoplays while on screen, pauses on hover/focus, and can be swiped.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const deck = useRef<HTMLDivElement>(null);
  const onScreen = useInView(deck, { amount: 0.4 });
  const reduce = useReducedMotion();
  const playing = onScreen && !paused && !reduce;

  const go = useCallback((step: 1 | -1) => {
    setDir(step);
    setActive((a) => (a + step + N) % N);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, active, go]);

  const item = TESTIMONIALS[active];

  return (
    <section id="avaliacoes" className="paper-grain relative overflow-hidden bg-paper py-[16vh]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-14 px-4 md:px-10">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow text-muted">(08) — Avaliações</p>
          <BleedText
            text={"O que dizem\nquem já passou\npela maca."}
            className="mt-4 text-[clamp(40px,5vw,80px)] font-light leading-[0.98] tracking-[-0.035em]"
            lineClassNames={["", "", "font-serif italic text-terra"]}
          />
          <dl className="mt-12 grid max-w-[480px] grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            <Stat to={26} suffix="+" label="anos de experiência" />
            <Stat to={99} suffix="%" label="clientes satisfeitas" />
            <Stat to={5} decimals={1} label="nota nas avaliações" stars />
          </dl>
        </div>

        <div
          ref={deck}
          className="col-span-12 lg:col-span-6 lg:col-start-7"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de pacientes"
        >
          <div className="relative grid">
            {/* The two cards waiting in the stack */}
            {[2, 1].map((depth) => {
              const next = TESTIMONIALS[(active + depth) % N];
              return (
                <motion.div
                  key={`back-${depth}`}
                  aria-hidden="true"
                  className="col-start-1 row-start-1 rounded-[28px] border border-ink/10 bg-bone"
                  animate={{ y: depth * 18, scale: 1 - depth * 0.045, rotate: depth === 1 ? 1.6 : -1.8 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                  style={{ transformOrigin: "50% 100%" }}
                >
                  <p className="p-7 font-mono text-[11px] uppercase tracking-wider text-muted/70">{next.name}</p>
                </motion.div>
              );
            })}

            <AnimatePresence initial={false} custom={dir}>
              <motion.figure
                key={active}
                custom={dir}
                className="relative col-start-1 row-start-1 flex min-h-[440px] touch-pan-y flex-col rounded-[28px] bg-ink p-7 text-paper shadow-[0_40px_80px_-40px_rgba(28,26,24,0.6)] md:min-h-[480px] md:p-10"
                variants={{
                  enter: (d: number) => ({ y: d > 0 ? 36 : -24, scale: 0.91, rotate: d > 0 ? -1.8 : 1.6, clipPath: "inset(0% 0% 0% 0% round 28px)" }),
                  center: { y: 0, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0% round 28px)" },
                  exit: (d: number) => ({
                    y: d > 0 ? -40 : 40,
                    rotate: d > 0 ? -3 : 3,
                    clipPath: d > 0 ? "inset(0% 0% 100% 0% round 28px)" : "inset(100% 0% 0% 0% round 28px)",
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: EASE_IN_OUT }}
                onPanEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                aria-live={playing ? "off" : "polite"}
              >
                <div className="flex items-center justify-between">
                  <Stars />
                  <span className="font-mono text-[12px] text-paper/60">
                    {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </span>
                </div>
                <span aria-hidden="true" className="mt-6 block h-10 font-serif text-[90px] leading-none text-clay">
                  “
                </span>
                <blockquote className="mt-2">
                  <KineticTextReveal
                    as="p"
                    text={item.text}
                    play
                    stagger={item.text.length > 260 ? 0.006 : 0.014}
                    duration={0.7}
                    delay={0.2}
                    className={cn(
                      "font-light leading-[1.35] tracking-[-0.01em]",
                      item.text.length > 260 ? "text-[clamp(16px,1.35vw,20px)]" : "text-[clamp(20px,1.9vw,28px)]",
                    )}
                  />
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 border-t border-paper/15 pt-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-clay font-serif text-[18px] italic text-ink">
                    {item.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-[16px]">{item.name}</span>
                    <span className="eyebrow text-paper/55">{item.tag}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <DeckButton label="Depoimento anterior" onClick={() => go(-1)}>
              <ArrowLeft size={18} strokeWidth={1.6} />
            </DeckButton>
            <DeckButton label="Próximo depoimento" onClick={() => go(1)}>
              <ArrowRight size={18} strokeWidth={1.6} />
            </DeckButton>
            <div className="ml-2 h-px flex-1 bg-ink/10" aria-hidden="true">
              <motion.div
                key={`${active}-${playing}`}
                className="h-px origin-left bg-terra"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: playing ? 1 : 0 }}
                transition={{ duration: playing ? AUTOPLAY_MS / 1000 : 0.3, ease: "linear" }}
              />
            </div>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setDir(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  aria-label={`Ver depoimento de ${t.name}`}
                  aria-current={i === active ? "true" : undefined}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                      i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/20",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeckButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative grid size-12 place-items-center overflow-hidden rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:text-paper"
    >
      <span className="absolute inset-0 scale-0 rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-100" />
      <span className="relative">{children}</span>
    </button>
  );
}

/** Five stars that draw themselves in, one after another. */
function Stars() {
  const star = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z";
  return (
    <span className="flex gap-1 text-clay" role="img" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-4">
          <motion.path
            d={star}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 + i * 0.07 }}
          />
        </svg>
      ))}
    </span>
  );
}

/** Number that counts up the first time it scrolls into view. */
function Stat({ to, suffix = "", decimals = 0, label, stars }: { to: number; suffix?: string; decimals?: number; label: string; stars?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const value = useMotionValue(0);
  const text = useTransform(() => value.get().toFixed(decimals).replace(".", ",") + suffix);

  useEffect(() => {
    if (!inView) return;
    const run = animate(value, to, { duration: 1.6, ease: EASE_OUT });
    return () => run.stop();
  }, [inView, to, value]);

  return (
    <div ref={ref}>
      <dt className="sr-only">{label}</dt>
      <dd>
        <motion.span className="block text-[clamp(32px,3.2vw,48px)] font-light leading-none tabular-nums tracking-[-0.03em]">
          {text}
        </motion.span>
        <span className="mt-2 flex items-center gap-1 text-[13px] leading-tight text-muted">
          {stars && <span className="text-clay">★</span>}
          {label}
        </span>
      </dd>
    </div>
  );
}
