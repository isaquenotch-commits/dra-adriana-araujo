import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CONTACT_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV, SPECIALTIES } from "@/lib/content";
import { cn, EASE_IN_OUT, EASE_OUT } from "@/lib/utils";
import { LetterCascade } from "./text/LetterCascade";
import { useSite } from "./SiteContext";

/** microkit "Blur Glide Menu" panel keyframes: panels glide sideways through a blur. */
const glideKeyframes = `
@keyframes glide-in { 0% { transform: translateX(100%); filter: blur(8px); } 65% { filter: blur(6px); } 100% { transform: translateX(0); filter: blur(0); } }
@keyframes glide-out { 0% { transform: translateX(0); filter: blur(0); } 100% { transform: translateX(-100%); filter: blur(9px); } }
@keyframes glide-in-back { 0% { transform: translateX(-100%); filter: blur(8px); } 65% { filter: blur(6px); } 100% { transform: translateX(0); filter: blur(0); } }
@keyframes glide-out-back { 0% { transform: translateX(0); filter: blur(0); } 100% { transform: translateX(100%); filter: blur(9px); } }`;

function origin() {
  const btn = document.getElementById("menu-button")?.getBoundingClientRect();
  if (!btn) return "calc(100% - 60px) 36px";
  return `${btn.left + btn.width - 22}px ${btn.top + btn.height / 2}px`;
}

export function Menu() {
  const { menuOpen, setMenuOpen, scrollTo } = useSite();
  const [hovered, setHovered] = useState(0);
  const [at, setAt] = useState("calc(100% - 60px) 36px");

  useEffect(() => {
    if (menuOpen) setAt(origin());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  // Move focus into the menu when it opens and hand it back to the toggle when it closes
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menuOpen) {
      const t = window.setTimeout(() => document.querySelector<HTMLElement>("#site-menu ul button")?.focus(), 450);
      wasOpen.current = true;
      return () => window.clearTimeout(t);
    }
    if (wasOpen.current) document.getElementById("menu-button")?.focus();
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollTo(id), 450);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.nav
          id="site-menu"
          aria-label="Menu principal"
          className="paper-grain fixed inset-0 z-[70] overflow-y-auto bg-ink text-paper"
          initial={{ clipPath: `circle(0% at ${at})` }}
          animate={{ clipPath: `circle(150% at ${at})` }}
          exit={{ clipPath: `circle(0% at ${at})` }}
          transition={{ duration: 0.95, ease: EASE_IN_OUT }}
        >
          <style>{glideKeyframes}</style>
          <div className="mx-auto grid min-h-full max-w-[1600px] grid-cols-12 gap-x-6 px-4 pb-10 pt-[110px] md:px-10">
            {/* Primary links */}
            <ul className="col-span-12 lg:col-span-7">
              {NAV.map((item, i) => (
                <li key={item.id} className="relative">
                  <Rule delay={0.35 + i * 0.06} />
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    className="group flex w-full items-baseline gap-4 py-2.5 text-left md:gap-8 md:py-3"
                  >
                    <MaskLine delay={0.4 + i * 0.07} className="eyebrow w-8 shrink-0 text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </MaskLine>
                    <MaskLine
                      delay={0.42 + i * 0.07}
                      className={cn(
                        "text-[clamp(30px,4.6vw,68px)] font-light uppercase leading-[0.95] tracking-[-0.01em] transition-colors duration-500",
                        hovered === i ? "text-paper" : "text-paper/45",
                      )}
                    >
                      <LetterCascade text={item.label} />
                    </MaskLine>
                    <MaskLine delay={0.5 + i * 0.07} className="ml-auto hidden font-serif text-xl italic text-clay md:block">
                      {item.hint}
                    </MaskLine>
                  </button>
                </li>
              ))}
              <li className="relative">
                <Rule delay={0.35 + NAV.length * 0.06} />
              </li>
            </ul>

            {/* Preview + glide panel */}
            <div className="col-span-12 mt-10 flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
              <Preview index={hovered} />
              <GlidePanel onNavigate={go} />
            </div>

            <div className="col-span-12 mt-12 flex flex-wrap items-end justify-between gap-6">
              <MaskLine delay={0.8} className="font-serif text-2xl italic text-paper/70">
                Fisioterapia · Acupuntura · Estética
              </MaskLine>
              <div className="flex gap-6">
                <MaskLine delay={0.85}>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-1 text-paper/70 hover:text-clay">
                    {INSTAGRAM_HANDLE} <ArrowUpRight size={12} />
                  </a>
                </MaskLine>
                <MaskLine delay={0.9}>
                  <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-1 text-paper/70 hover:text-clay">
                    WhatsApp <ArrowUpRight size={12} />
                  </a>
                </MaskLine>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function MaskLine({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-110%", transition: { duration: 0.45, ease: EASE_IN_OUT } }}
        transition={{ duration: 0.95, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Rule({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 block h-px origin-left bg-paper/15"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0, transition: { duration: 0.4, ease: EASE_IN_OUT } }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    />
  );
}

/** Stacked photos; the hovered one wipes up over the last via clip-path. */
function Preview({ index }: { index: number }) {
  return (
    <motion.div
      className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-stone lg:block"
      initial={{ clipPath: "inset(100% 0% 0% 0% round 16px)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0% round 16px)", transition: { duration: 0.45, ease: EASE_IN_OUT } }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.45 }}
    >
      {NAV.map((item, i) => (
        <img
          key={item.id}
          src={item.img}
          alt=""
          className="absolute inset-0 size-full object-cover transition-[clip-path,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            clipPath: i === index ? "inset(0 0 0 0)" : i < index ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transform: i === index ? "scale(1)" : "scale(1.08)",
            zIndex: i,
          }}
        />
      ))}
      <span className="eyebrow absolute bottom-3 left-3 z-10 rounded-full bg-ink/70 px-3 py-1.5 text-paper backdrop-blur">
        {NAV[index].hint}
      </span>
    </motion.div>
  );
}

/** Two-level panel that glides between "Contato" and the treatments list. */
function GlidePanel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [level, setLevel] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<"idle" | "fwd" | "back">("idle");

  const switchTo = (next: 0 | 1) => {
    setPhase(next === 1 ? "fwd" : "back");
    setLevel(next);
  };

  const anim = (entering: boolean) =>
    phase === "idle"
      ? undefined
      : `${entering ? (phase === "fwd" ? "glide-in" : "glide-in-back") : phase === "fwd" ? "glide-out" : "glide-out-back"} .42s cubic-bezier(.45,.05,.15,1) both`;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-paper/10 bg-stone/60"
      initial={{ clipPath: "inset(0 0 100% 0 round 16px)" }}
      animate={{ clipPath: "inset(0 0 0% 0 round 16px)" }}
      exit={{ clipPath: "inset(0 0 100% 0 round 16px)", transition: { duration: 0.4, ease: EASE_IN_OUT } }}
      transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 }}
    >
      <div className="relative min-h-[236px] p-5">
        {/* Level 0 */}
        <div
          className={cn("w-full", level === 1 && "pointer-events-none absolute inset-x-0 top-0 p-5")}
          style={{ animation: anim(level === 0), transform: level === 1 && phase === "idle" ? "translateX(-100%)" : undefined }}
          inert={level === 1 || undefined}
        >
          <p className="eyebrow mb-4 text-paper/50">Atendimento</p>
          <p className="mb-5 font-serif text-[26px] italic leading-tight text-paper">
            Agende sua avaliação e comece pelo que mais incomoda.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-clay px-4 py-2 text-[13px] text-ink transition-colors hover:bg-paper"
            >
              Falar no WhatsApp
            </a>
            <button
              type="button"
              onClick={() => switchTo(1)}
              className="rounded-full border border-paper/20 px-4 py-2 text-[13px] text-paper transition-colors hover:border-paper"
            >
              Ver tratamentos →
            </button>
          </div>
        </div>

        {/* Level 1 */}
        <div
          className={cn("w-full", level === 0 && "pointer-events-none absolute inset-x-0 top-0 p-5")}
          style={{ animation: anim(level === 1), transform: level === 0 && phase === "idle" ? "translateX(100%)" : undefined }}
          inert={level === 0 || undefined}
        >
          <button
            type="button"
            onClick={() => switchTo(0)}
            className="eyebrow mb-3 inline-flex items-center gap-2 text-paper/60 hover:text-paper"
          >
            <ArrowLeft size={12} /> Tratamentos
          </button>
          <ul className="grid grid-cols-2 gap-x-4">
            {SPECIALTIES.map((s) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => onNavigate("tratamentos")}
                  className="w-full truncate rounded-md px-2 py-[5px] text-left text-[14px] text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
