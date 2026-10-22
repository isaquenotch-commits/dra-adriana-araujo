import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { FocusField, MagneticFill } from "@/components/micro";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { Typewriter } from "@/components/text/Typewriter";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/content";
import { useSite } from "@/components/SiteContext";
import { ClipReveal } from "@/components/ClipReveal";

export function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = String(data.get("nome") || "").trim();
    const queixa = String(data.get("queixa") || "").trim();
    const interesse = String(data.get("interesse") || "").trim();
    const msg = [
      `Olá, Adriana! Meu nome é ${nome}.`,
      interesse && `Tenho interesse em ${interesse.toLowerCase()}.`,
      queixa && `Sobre o que sinto: ${queixa}`,
    ]
      .filter(Boolean)
      .join(" ");
    setSent(true);
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };

  return (
    <section id="contato" className="relative overflow-hidden paper-grain rounded-t-[40px] bg-ink px-4 pb-10 pt-[16vh] text-paper md:px-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow text-paper/50">(11) — Contato</p>
          <KineticTextReveal
            as="h2"
            text="Vamos começar?"
            splitBy="characters"
            stagger={0.035}
            className="mt-4 text-[clamp(56px,10vw,170px)] font-light leading-[0.9] tracking-[-0.045em]"
          />
          <p className="mt-8 max-w-[480px] text-[clamp(17px,1.4vw,20px)] leading-snug text-paper/70">
            <Typewriter words={["Conte o que está sentindo. A primeira conversa já é parte do cuidado."]} speed={30} caret={false} />
          </p>
          <div className="mt-10">
            <MagneticFill href={CONTACT_URL} dark className="pl-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-[#25D366] text-white">
                <FaWhatsapp size={19} aria-hidden="true" />
              </span>
              Falar no WhatsApp
            </MagneticFill>
            <p className="mt-4 font-mono text-[12px] text-paper/60">{WHATSAPP_DISPLAY}</p>
          </div>
        </div>

        <ClipReveal
          as="form"
          onSubmit={submit}
          radius={24}
          duration={1.1}
          className="col-span-12 lg:col-span-5"
          innerClassName="flex flex-col gap-4 rounded-[24px] bg-paper p-5 text-ink md:p-7"
        >
          <p className="font-serif text-[26px] italic leading-tight">Pré-agendamento</p>
          <FocusField label="Seu nome" name="nome" placeholder="Como posso te chamar?" required autoComplete="given-name" />
          <InterestPicker />
          <FocusField label="O que você sente?" name="queixa" placeholder="Ex.: dor lombar há 3 meses" textarea />
          <button
            type="submit"
            className="group relative mt-2 flex h-14 items-center justify-center overflow-hidden rounded-xl bg-ink text-[15px] text-paper"
          >
            <span
              className="absolute inset-y-0 left-0 bg-terra transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
              style={{ width: sent ? "100%" : "0%" }}
            />
            <span className="relative flex items-center gap-2">
              {sent ? (
                <>
                  <Check size={16} /> Conversa aberta no WhatsApp
                </>
              ) : (
                <>
                  <FaWhatsapp size={18} aria-hidden="true" /> Enviar pelo WhatsApp
                </>
              )}
            </span>
          </button>
        </ClipReveal>
      </div>

      <Footer />
    </section>
  );
}

const INTERESTS = ["Fisioterapia", "Pós-operatório", "Acupuntura", "Ventosaterapia", "Estética", "Massagem"];

/** Chip group (radio inputs) — one tap instead of typing. */
function InterestPicker() {
  return (
    <fieldset>
      <legend className="eyebrow mb-2 block text-muted">Interesse</legend>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((item) => (
          <label key={item} className="cursor-pointer">
            <input type="radio" name="interesse" value={item} className="peer sr-only" />
            <span className="block rounded-full border border-ink/15 px-3.5 py-2 text-[13.5px] text-stone transition-colors duration-300 hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terra">
              {item}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Footer() {
  const { scrollTo } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const letters = "ADRIANA ARAUJO".split("");

  return (
    <footer className="mx-auto mt-[14vh] max-w-[1600px]">
      <div className="grid grid-cols-2 gap-8 border-t border-paper/15 pt-8 md:grid-cols-4">
        <div>
          <p className="eyebrow mb-3 text-paper/60">Navegação</p>
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => scrollTo(n.id)} className="block py-1.5 text-paper/80 hover:text-clay">
              {n.label}
            </button>
          ))}
        </div>
        <div>
          <p className="eyebrow mb-3 text-paper/60">Redes</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="block py-1.5 text-paper/80 hover:text-clay">
            Instagram
          </a>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="block py-1.5 text-paper/80 hover:text-clay">
            WhatsApp
          </a>
        </div>
        <div className="col-span-2">
          <p className="eyebrow mb-3 text-paper/60">Especialidades</p>
          <p className="max-w-[420px] text-paper/80">
            Fisioterapia · Pré e pós-operatório · Acupuntura · Ventosaterapia · Pedras quentes · MES · Heccus · Limpeza de pele · Massagens
          </p>
        </div>
      </div>

      <div ref={ref} className="mt-16 flex justify-between overflow-hidden" aria-label="Adriana Araujo">
        {letters.map((l, i) => (
          <FooterLetter key={i} letter={l} i={i} total={letters.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-3 font-mono text-[11px] text-paper/55">
        <span>© {new Date().getFullYear()} Adriana Araujo · Fisioterapia, Acupuntura e Estética</span>
        <span>{INSTAGRAM_HANDLE}</span>
      </div>
    </footer>
  );
}

function FooterLetter({
  letter,
  i,
  total,
  progress,
}: {
  letter: string;
  i: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = (i / total) * 0.5;
  const y = useTransform(progress, [start, start + 0.5], ["105%", "0%"]);
  return (
    <span aria-hidden="true" className="block overflow-hidden text-[clamp(30px,8.6vw,150px)] font-light leading-[0.9] tracking-[-0.02em]">
      <motion.span style={{ y }} className="block">
        {letter === " " ? " " : letter}
      </motion.span>
    </span>
  );
}
