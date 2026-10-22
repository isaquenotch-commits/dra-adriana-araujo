import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { HandHeart, Target, Zap, type LucideIcon } from "lucide-react";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";

type Credential = {
  k: string;
  title: string;
  text: string;
  img: string;
  icon: LucideIcon;
  /** Two-stop tint the photo is duotoned into. */
  tint: [string, string];
  /** Glow that warms one corner of the card. */
  glow: string;
};

const CREDENTIALS: Credential[] = [
  {
    k: "Formação",
    title: "Fisioterapeuta",
    text: "Reabilitação, terapia manual e pré e pós-operatório.",
    img: "img/pedras-sala.webp",
    icon: HandHeart,
    tint: ["#1c1a18", "#4a3a30"],
    glow: "rgba(185,138,110,0.55)",
  },
  {
    k: "Especialização",
    title: "Pós em Acupuntura",
    text: "Medicina tradicional chinesa aplicada à dor e ao equilíbrio.",
    img: "img/acupuntura.webp",
    icon: Target,
    tint: ["#5e2f20", "#b46e54"],
    glow: "rgba(232,207,199,0.5)",
  },
  {
    k: "Certificação",
    title: "Habilitada MES",
    text: "Microcorrentes e eletroestimulação para analgesia e regeneração.",
    img: "img/eletro-ventosa.webp",
    icon: Zap,
    tint: ["#3d3a33", "#8e9a7f"],
    glow: "rgba(228,216,200,0.55)",
  },
];

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Back face of a credential card: the treatment photo is duotoned into the
 * card's tint, a warm glow lifts one corner, a scrim keeps the type legible
 * and a hairline + grain give it a printed, tactile finish.
 */
function CredentialFace({ card, index }: { card: Credential; index: number }) {
  const Icon = card.icon;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${card.tint[1]}, ${card.tint[0]})` }} />
      <img
        src={card.img}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-70 mix-blend-luminosity grayscale contrast-125"
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 70% at 100% 0%, ${card.glow}, transparent 60%)` }} />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to top, ${card.tint[0]} 8%, ${card.tint[0]}cc 34%, transparent 72%)` }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.22)]" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 bottom-[38%] hidden font-serif text-[clamp(90px,10vw,160px)] sm:block italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(250,247,242,0.22)]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex h-full flex-col text-paper">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow truncate text-paper/75">{card.k}</span>
          <span className="hidden size-9 shrink-0 sm:grid place-items-center rounded-full border border-paper/25 bg-paper/10 backdrop-blur-md">
            <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
          </span>
        </div>
        <span className="mt-auto font-serif text-[clamp(14px,3vw,40px)] italic leading-[1]">{card.title}</span>
        <span className="mt-3 hidden text-[13px] leading-snug text-paper/80 sm:block md:text-[15px]">{card.text}</span>
      </div>
    </>
  );
}

/**
 * componentry.dev "Scroll Split Card": Adriana's portrait is one picture, then
 * it splits into three panels that turn over to show her credentials.
 */
export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -40, -18]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 40, 18]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 5]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -5]);
  const rLeft = useTransform(scrollYProgress, [0, 0.2], ["18px 0px 0px 18px", "18px 18px 18px 18px"]);
  const rMid = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "18px 18px 18px 18px"]);
  const rRight = useTransform(scrollYProgress, [0, 0.2], ["0px 18px 18px 0px", "18px 18px 18px 18px"]);
  const shadowA = useTransform(scrollYProgress, [0, 0.2], [0, 0.28]);
  const boxShadow = useMotionTemplate`0 30px 60px -20px rgba(28,26,24,${shadowA})`;
  const cardsY = useTransform(scrollYProgress, [0.8, 1], ["0vh", "-6vh"]);
  // Closing line is unmasked from left to right, never faded
  const endClip = useTransform(scrollYProgress, [0.82, 0.98], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const sign = useTransform(scrollYProgress, [0.84, 1], [1, 0]);

  return (
    <section ref={ref} id="sobre" className="relative h-[380vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden [perspective:1400px]">
        <div className="absolute left-0 right-0 top-[96px] z-10 mx-auto max-w-[1600px] px-4 md:px-10">
          <p className="eyebrow mb-3 text-muted">(02) — Quem cuida</p>
          <KineticTextReveal
            as="h2"
            text="Adriana Araujo"
            className="text-[clamp(34px,5vw,72px)] font-light leading-none tracking-[-0.03em]"
          />
        </div>

        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="relative mt-[16vh] flex h-[min(50vh,500px)] w-[min(92vw,760px)]"
        >
          {CREDENTIALS.map((card, i) => {
            const radius = i === 0 ? rLeft : i === 2 ? rRight : rMid;
            return (
              <motion.div
                key={card.title}
                className="relative h-full flex-1"
                style={{
                  x: i === 0 ? leftX : i === 2 ? rightX : 0,
                  rotateY,
                  rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                  zIndex: i,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front: slice of the portrait */}
                <motion.div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]" style={{ borderRadius: radius, boxShadow }}>
                  <div
                    className="absolute inset-y-0 h-full w-[300%]"
                    style={{
                      left: `${-100 * i}%`,
                      backgroundImage: "url(img/adriana.webp)",
                      backgroundSize: "cover",
                      backgroundPosition: "50% 30%",
                    }}
                  />
                </motion.div>
                {/* Back: credential */}
                <motion.div
                  className="absolute inset-0 isolate overflow-hidden bg-ink p-5 [backface-visibility:hidden] md:p-7"
                  style={{ transform: "rotateY(180deg)", borderRadius: radius, boxShadow }}
                >
                  <CredentialFace card={card} index={i} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div style={{ clipPath: endClip }} className="mt-[6vh] flex items-center gap-4 px-4 text-center">
          <p className="text-[clamp(16px,1.6vw,20px)] text-stone">
            Atendimento humano, técnico e sem pressa —
          </p>
          <svg viewBox="0 0 180 60" className="h-10 w-28 text-terra" aria-hidden="true">
            <motion.path
              d="M8 40 C 20 8, 34 8, 30 34 S 46 52, 58 26 C 64 14, 70 44, 82 30 S 98 12, 104 34 C 108 46, 120 40, 126 28 C 132 18, 140 38, 150 30 L 172 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: sign }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
