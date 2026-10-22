import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { Typewriter } from "@/components/text/Typewriter";

const PANELS = [
  {
    title: "Ventosaterapia",
    kicker: "Liberação miofascial",
    text: "As marcas contam a história de uma circulação que voltou a correr. Combinada à eletroestimulação, solta a lombar em poucas sessões.",
    img: "img/eletro-ventosa.webp",
    bg: "#e8cfc7",
    stat: ["30 min", "por sessão"],
  },
  {
    title: "Acupuntura",
    kicker: "Pós-graduação",
    text: "Agulhas finíssimas no trapézio e no ombro para tirar o peso do dia e devolver a amplitude do movimento.",
    img: "img/acupuntura.webp",
    bg: "#e4d8c8",
    stat: ["0,25 mm", "de agulha"],
  },
  {
    title: "Pedras quentes",
    kicker: "Calor profundo",
    text: "Basalto aquecido percorre a coluna e relaxa a musculatura de dentro para fora. O corpo entende que pode descansar.",
    img: "img/pedras-sala.webp",
    bg: "#d6cbb8",
    stat: ["50 °C", "basalto natural"],
  },
  {
    title: "Limpeza de pele",
    kicker: "Estética",
    text: "Higienização, extração cuidadosa com lupa e hidratação. Pele limpa, respirando, sem agressão.",
    img: "img/limpeza-pele.webp",
    bg: "#f2ede6",
    stat: ["100%", "descartável"],
  },
];

/**
 * Google Health-style stack (details.so → Pinned Scroll / Parallax): each
 * treatment panel slides up over the last, which sinks and shrinks beneath it,
 * while the photo inside drifts at its own speed.
 */
export function Gallery() {
  return (
    <section className="relative">
      {PANELS.map((panel, i) => (
        <Panel key={panel.title} panel={panel} i={i} last={i === PANELS.length - 1} />
      ))}
    </section>
  );
}

function Panel({ panel, i, last }: { panel: (typeof PANELS)[number]; i: number; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(enter, [0, 1], ["-18%", "0%"]);
  const sink = useTransform(leave, [0, 1], [1, last ? 1 : 0.9]);
  const sinkY = useTransform(leave, [0, 1], ["0vh", last ? "0vh" : "8vh"]);
  const photoClip = useTransform(enter, [0.25, 1], ["inset(30% 10% 0% 10% round 28px)", "inset(0% 0% 0% 0% round 28px)"]);

  return (
    <div ref={ref} className="sticky top-0 h-[100svh]">
      <motion.div
        style={{ scale: sink, y: sinkY, backgroundColor: panel.bg }}
        className="relative mx-auto grid h-full w-full grid-cols-12 gap-x-6 overflow-hidden rounded-t-[28px] px-4 pt-[96px] md:px-10"
      >
        <div className="col-span-12 flex flex-col pb-6 md:col-span-6 md:pb-12">
          <span className="eyebrow text-muted">
            {String(i + 1).padStart(2, "0")} · {panel.kicker}
          </span>
          <KineticTextReveal
            as="h3"
            text={panel.title}
            splitBy="characters"
            stagger={0.03}
            className="mt-4 font-serif text-[clamp(48px,7.6vw,128px)] italic leading-[0.9] tracking-[-0.02em] text-ink"
          />
          <p className="mt-6 max-w-[440px] text-[clamp(16px,1.3vw,19px)] leading-snug text-stone">{panel.text}</p>
          <div className="mt-auto hidden items-end gap-4 md:flex">
            <span className="text-[clamp(40px,4.4vw,72px)] font-light leading-none tracking-[-0.03em]">
              <Typewriter words={[panel.stat[0]]} caret={false} speed={90} />
            </span>
            <span className="eyebrow mb-2 text-muted">{panel.stat[1]}</span>
          </div>
        </div>
        <motion.div
          style={{ clipPath: photoClip }}
          className="relative col-span-12 h-[46svh] overflow-hidden md:col-span-5 md:col-start-8 md:h-[calc(100svh-140px)]"
        >
          <motion.img
            style={{ y: imgY }}
            src={panel.img}
            alt={panel.title}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
