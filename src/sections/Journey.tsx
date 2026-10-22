import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { JOURNEY } from "@/lib/content";
import { EASE_IN_OUT } from "@/lib/utils";
import { ClipReveal } from "@/components/ClipReveal";

/** Smooth closed blob through `n` radial points; every blob has the same commands so `d` can morph. */
function blobPath(seed: number, n = 8, r = 92) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = r * (0.82 + 0.2 * Math.sin(seed * 3.1 + i * 2.2) + 0.08 * Math.cos(seed * 1.7 + i * 4.1));
    return [100 + Math.cos(a) * k, 100 + Math.sin(a) * k];
  });
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + " Z";
}

const BLOBS = JOURNEY.map((_, i) => blobPath(i * 1.9 + 0.7));

/**
 * Sundrop-style feature scroll (details.so → Hero / Scroll Animations): the
 * photo stays put while an organic shape behind it reshapes and recolours for
 * every step of the patient journey.
 */
export function Journey() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [-40, 80]);

  return (
    <section ref={ref} id="jornada" className="paper-grain relative bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 pt-[16vh] md:px-10">
        <div className="md:ml-[50%]">
          <p className="eyebrow text-muted">(06) — Jornada</p>
          <KineticTextReveal
            as="h2"
            text="Do primeiro contato à alta."
            className="mt-3 text-[clamp(34px,4.6vw,72px)] font-light leading-[0.98] tracking-[-0.03em]"
          />
        </div>

      </div>
      <div className="mx-auto max-w-[1600px] px-4 md:grid md:grid-cols-12 md:gap-x-6 md:px-10">
        {/* Sticky stage */}
        <div className="sticky top-[72px] z-10 h-[46svh] bg-paper md:top-0 md:col-span-6 md:h-[100svh] md:self-start md:bg-transparent">
          <div className="relative flex h-full items-center justify-center">
            <motion.svg style={{ rotate: spin }} viewBox="0 0 200 200" className="absolute size-[min(70vw,40svh)] md:size-[min(48vw,720px)]" aria-hidden="true">
              <motion.path
                initial={false}
                animate={{ d: BLOBS[active], fill: JOURNEY[active].color }}
                transition={{ duration: 1.1, ease: EASE_IN_OUT }}
              />
            </motion.svg>
            <div className="relative aspect-[9/16] h-[38svh] overflow-hidden rounded-[24px] border-[5px] md:rounded-[30px] md:border-[6px] border-ink bg-ink shadow-[0_40px_80px_-30px_rgba(28,26,24,0.55)] md:h-[min(62svh,560px)]">
              {JOURNEY.map((step, i) => (
                <img
                  key={step.step}
                  src={step.img}
                  alt={step.title}
                  className="absolute inset-0 size-full object-cover transition-[clip-path,transform] duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]"
                  style={{
                    clipPath: i <= active ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                    transform: i === active ? "scale(1)" : "scale(1.1)",
                    zIndex: i,
                  }}
                />
              ))}
              <span className="absolute left-3 top-3 z-10 rounded-full bg-paper/85 px-3 py-1 font-mono text-[11px] text-ink backdrop-blur">
                Etapa {JOURNEY[active].step}
              </span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="pb-[20vh] md:col-span-5 md:col-start-8 md:pt-[10vh]">
          {JOURNEY.map((step, i) => (
            <Step key={step.step} step={step} onActive={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ step, onActive }: { step: (typeof JOURNEY)[number]; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className="flex min-h-[50svh] flex-col justify-center border-t border-ink/10 py-10 md:min-h-[70svh]">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[12px] text-terra">{step.step}</span>
        <KineticTextReveal
          as="h3"
          text={step.title}
          className="text-[clamp(28px,3vw,44px)] font-light leading-tight tracking-[-0.02em]"
        />
      </div>
      <ClipReveal from="down" delay={0.2} duration={0.9} amount={0.5} className="mt-4 max-w-[420px]">
        <p className="text-[17px] leading-snug text-stone">{step.text}</p>
      </ClipReveal>
    </div>
  );
}
