import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { BleedText } from "@/components/text/BleedText";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Google Health-style assembly (details.so → Pinned Scroll): scattered cards
 * fly in from around the viewport and lock together into one bento grid.
 */
export function Evolution() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0, 0.65], [0, 1], { clamp: true });

  return (
    <section ref={ref} className="paper-grain relative h-[240vh] bg-bone">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-4 pt-[88px] md:px-10">
        <div className="mx-auto w-full max-w-[1180px] text-center">
          <p className="eyebrow text-muted">(07) — Evolução</p>
          <BleedText
            text="Cada sessão soma."
            className="mt-2 text-[clamp(32px,4.4vw,68px)] font-light leading-none tracking-[-0.03em]"
          />
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-[1180px] flex-1 grid-cols-2 grid-rows-[repeat(5,minmax(0,1fr))] gap-2.5 pb-6 md:mt-8 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(0,1fr))] md:gap-3 md:pb-10">
          <Piece p={p} from={[-38, -30, -8]} className="hidden overflow-hidden p-0 md:row-span-2 md:flex">
            <img src="img/ventosa-costas.webp" alt="Sessão de ventosaterapia" className="size-full object-cover" />
          </Piece>
          <Piece p={p} from={[0, 40, 0]} className="col-span-2 row-span-2 bg-paper md:col-span-2" delay={0.05}>
            <PainChart />
          </Piece>
          <Piece p={p} from={[40, -34, 7]} className="bg-ink text-paper" delay={0.1}>
            <span className="eyebrow text-paper/50">Formação</span>
            <span className="mt-auto font-serif text-[clamp(20px,2vw,30px)] italic leading-none">Pós em Acupuntura</span>
          </Piece>
          <Piece p={p} from={[44, 10, -5]} className="bg-blush" delay={0.15}>
            <span className="eyebrow text-ink/50">Para todos</span>
            <span className="mt-auto text-[clamp(17px,1.5vw,22px)] leading-tight">Crianças, adultos e toda a família</span>
          </Piece>
          <Piece p={p} from={[-42, 30, 6]} className="col-span-2 bg-clay text-ink md:col-span-1" delay={0.2}>
            <span className="eyebrow text-ink/60">Segurança</span>
            <span className="mt-auto text-[clamp(17px,1.5vw,22px)] leading-tight">Material descartável em todos os procedimentos</span>
          </Piece>
          <Piece p={p} from={[-10, 44, -4]} className="hidden overflow-hidden p-0 md:flex" delay={0.25}>
            <img src="img/pedras-coluna.webp" alt="Pedras quentes" className="size-full object-cover" />
          </Piece>
          <Piece p={p} from={[30, 42, 9]} className="col-span-2 bg-terra text-paper md:col-span-2" delay={0.3}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group flex h-full items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/30 transition-colors group-hover:bg-paper group-hover:text-terra">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </span>
              <span>
                <span className="block text-[clamp(18px,1.6vw,24px)] leading-tight">Bastidores, dicas e casos reais</span>
                <span className="font-mono text-[12px] text-paper/70">{INSTAGRAM_HANDLE}</span>
              </span>
            </a>
          </Piece>
        </div>
      </div>
    </section>
  );
}

function Piece({
  p,
  from,
  className,
  children,
  delay = 0,
}: {
  p: MotionValue<number>;
  from: [number, number, number];
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  // Each piece starts a touch later so they lock in one after another
  const local = useTransform(p, [delay, Math.min(1, 0.75 + delay)], [0, 1], { clamp: true });
  const x = useTransform(local, [0, 1], [`${from[0]}vw`, "0vw"]);
  const y = useTransform(local, [0, 1], [`${from[1]}vh`, "0vh"]);
  const rotate = useTransform(local, [0, 1], [from[2], 0]);
  const scale = useTransform(local, [0, 1], [0.86, 1]);
  return (
    <motion.div style={{ x, y, rotate, scale }} className={cn("flex flex-col rounded-[20px] p-4 md:p-5", className)}>
      {children}
    </motion.div>
  );
}

/** Pain scale across sessions — adapted from bencho.dev "Heart Rate" (scrub to inspect). */
const SESSIONS = [8, 8, 7, 6, 6, 5, 4, 4, 3, 2, 2, 1];

function PainChart() {
  const [hover, setHover] = useState<number | null>(null);
  const chart = useRef<HTMLDivElement>(null);
  const value = hover === null ? SESSIONS[SESSIONS.length - 1] : SESSIONS[hover];
  const scrub = (e: React.PointerEvent) => {
    const r = chart.current!.getBoundingClientRect();
    setHover(Math.max(0, Math.min(SESSIONS.length - 1, Math.floor(((e.clientX - r.left) / r.width) * SESSIONS.length))));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <span className="eyebrow text-muted">Escala de dor · EVA</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[clamp(44px,5vw,76px)] font-light leading-none tabular-nums tracking-[-0.04em]">{value}</span>
            <span className="font-mono text-[11px] text-muted">/10 · sessão {hover === null ? SESSIONS.length : hover + 1}</span>
          </div>
        </div>
        <span className="rounded-full bg-bone px-2.5 py-1 font-mono text-[10px] text-muted">exemplo ilustrativo</span>
      </div>
      <div
        ref={chart}
        className="relative mt-auto flex h-[clamp(80px,17vh,190px)] cursor-crosshair items-end gap-[3%] pt-4"
        onPointerMove={scrub}
        onPointerDown={scrub}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label="Exemplo de evolução da dor ao longo de 12 sessões, de 8 para 1"
      >
        {SESSIONS.map((v, i) => (
          <motion.span
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors duration-200",
              hover === i ? "bg-terra" : hover === null && i === SESSIONS.length - 1 ? "bg-terra" : "bg-sand",
            )}
            style={{ height: `${v * 10}%`, transformOrigin: "bottom" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.04 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
        <span>1ª sessão</span>
        <span>6ª</span>
        <span>12ª</span>
      </div>
    </div>
  );
}
