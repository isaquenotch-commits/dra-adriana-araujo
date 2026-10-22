import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { BleedText } from "@/components/text/BleedText";
import { Typewriter } from "@/components/text/Typewriter";
import { MagneticFill, SlidingArrow } from "@/components/micro";
import { useSite } from "@/components/SiteContext";
import { FaWhatsapp } from "react-icons/fa";
import { CHIPS, CONTACT_URL } from "@/lib/content";
import { EASE_OUT } from "@/lib/utils";

const Stones = lazy(() => import("@/three/Stones"));

export function Hero() {
  const { ready, scrollTo } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  // One scroll-velocity source shared by both chip rows
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden pt-[72px]">
      <GridLines ready={ready} />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-4 md:px-10">
        <div className="col-span-12 pt-10 md:pt-16 lg:col-span-7">
          <div className="eyebrow mb-8 flex items-center gap-3 text-muted">
            <motion.span
              className="block h-px w-10 origin-left bg-terra"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
            />
            {ready && <Typewriter words={["Fisioterapeuta · Pós em Acupuntura · Habilitada MES"]} immediate delay={0.5} speed={28} caret={false} />}
          </div>

          {ready ? (
            <BleedText
              as="h1"
              immediate
              delay={0.25}
              text={"Cuidar do corpo\né devolver o\nmovimento."}
              className="text-[clamp(46px,8.4vw,132px)] font-light leading-[0.92] tracking-[-0.035em] text-ink"
              lineClassNames={["", "", "font-serif italic tracking-[-0.02em] text-terra"]}
            />
          ) : (
            <h1 className="invisible text-[clamp(46px,8.4vw,132px)] leading-[0.92]">Cuidar do corpo é devolver o movimento.</h1>
          )}

          <div className="mt-10 max-w-[520px] text-[clamp(18px,1.6vw,22px)] leading-snug text-stone">
            <span>Tratamento para </span>
            {ready && (
              <Typewriter
                className="font-serif text-[1.15em] italic text-terra"
                words={["lombalgia.", "o pós-operatório.", "a ansiedade.", "a dor no pescoço.", "a sua pele.", "o corpo inteiro."]}
                immediate
                delay={1.8}
              />
            )}
          </div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={ready ? { clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.4 }}
          >
            <MagneticFill href={CONTACT_URL} className="pl-2.5" ariaLabel="Agendar avaliação pelo WhatsApp">
              <span className="grid size-9 place-items-center rounded-full bg-[#25D366] text-white transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-12">
                <FaWhatsapp size={19} aria-hidden="true" />
              </span>
              Agendar avaliação
            </MagneticFill>
            <SlidingArrow onClick={() => scrollTo("tratamentos")}>Ver tratamentos</SlidingArrow>
          </motion.div>
        </div>

        {/* 3D hot-stone cairn */}
        <div className="pointer-events-none relative col-span-12 h-[52vh] lg:absolute lg:right-0 lg:top-0 lg:h-[92vh] lg:w-[52%]">
          <Suspense fallback={null}>
            <Stones progress={scrollYProgress} started={ready} />
          </Suspense>
          <motion.div
            style={{ rotate: badgeRotate }}
            className="absolute bottom-[4%] left-[4%] size-[96px] md:size-[124px] lg:bottom-[20%] lg:left-[6%]"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={ready ? { clipPath: "circle(50% at 50% 50%)" } : {}}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.6 }}
          >
            <Badge />
          </motion.div>
        </div>
      </div>

      <div className="relative mt-10 pb-10 lg:mt-24">
        <ChipRow chips={CHIPS.slice(0, 8)} baseVelocity={-2.2} ready={ready} delay={1.5} factor={factor} />
        <ChipRow chips={CHIPS.slice(8)} baseVelocity={2.2} ready={ready} delay={1.65} factor={factor} />
      </div>
    </section>
  );
}

/** Construction lines: the column grid is drawn before content lands on it. */
function GridLines({ ready }: { ready: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px] px-4 md:px-10">
      <div className="relative grid h-full grid-cols-4 md:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.span
            key={i}
            className={i >= 4 ? "hidden border-l border-ink/[0.06] md:block" : "border-l border-ink/[0.06]"}
            style={{ transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE_OUT, delay: i * 0.08 }}
          />
        ))}
      </div>
    </div>
  );
}

/** The circular wordmark from the logo, set as a slowly turning seal. */
function Badge() {
  return (
    <svg viewBox="0 0 200 200" className="size-full">
      <defs>
        <path id="badge-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="99" className="fill-paper" />
      <text className="fill-ink font-sans" fontSize="13" letterSpacing="4.4">
        <textPath href="#badge-ring">ESTÉTICA • FISIOTERAPIA • ACUPUNTURA •</textPath>
      </text>
      <text x="100" y="96" textAnchor="middle" className="fill-ink font-sans" fontSize="17" letterSpacing="3">
        ADRIANA
      </text>
      <text x="100" y="118" textAnchor="middle" className="fill-ink font-sans" fontSize="17" letterSpacing="3">
        ARAUJO
      </text>
    </svg>
  );
}

/**
 * componentry.dev "Velocity Scroll" applied to the Intent-style chip rows:
 * the rows drift on their own and accelerate / reverse with scroll velocity.
 *
 * The drift is a single looping WAAPI animation, so it runs on the compositor.
 * Scroll velocity only changes the animation's playback `speed` — no styles
 * are written per frame — and the loop is paused while the row is off screen.
 */
function ChipRow({
  chips,
  baseVelocity,
  ready,
  delay,
  factor,
}: {
  chips: string[];
  baseVelocity: number;
  ready: boolean;
  delay: number;
  factor: MotionValue<number>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = useRef<AnimationPlaybackControls | null>(null);
  const dir = useRef(1);
  const visible = useInView(rowRef);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // baseVelocity is in % of the track per second; the loop covers half the track
    const duration = 50 / Math.abs(baseVelocity);
    // WAAPI refuses to play an infinite animation backwards, so loop a huge but
    // finite number of times and start in the middle: it can then run either way.
    const run = animate(track, { transform: ["translateX(0%)", "translateX(-50%)"] }, {
      duration,
      ease: "linear",
      repeat: 200_000,
    });
    run.time = duration * 100_000;
    run.speed = Math.sign(-baseVelocity) || 1;
    loop.current = run;
    return () => {
      run.stop();
      loop.current = null;
    };
  }, [baseVelocity]);

  useEffect(() => {
    if (!loop.current) return;
    if (visible) loop.current.play();
    else loop.current.pause();
  }, [visible]);

  useMotionValueEvent(factor, "change", (f) => {
    const run = loop.current;
    if (!run) return;
    if (f < -0.01) dir.current = -1;
    else if (f > 0.01) dir.current = 1;
    run.speed = dir.current * Math.sign(-baseVelocity) * (1 + Math.min(4, Math.abs(f)));
  });

  const row = [...chips, ...chips];
  return (
    <motion.div
      ref={rowRef}
      className="overflow-hidden py-1.5"
      initial={{ clipPath: "inset(0 50% 0 50%)" }}
      animate={ready ? { clipPath: "inset(0 0% 0 0%)" } : {}}
      transition={{ duration: 1.4, ease: EASE_OUT, delay }}
    >
      <div ref={trackRef} className="flex w-max gap-3">
        {[...row, ...row].map((chip, i) => (
          <span
            key={i}
            aria-hidden={i >= chips.length || undefined}
            className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-2.5 text-[15px] text-stone"
          >
            <span className="size-1.5 rounded-full bg-clay" />
            {chip}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
