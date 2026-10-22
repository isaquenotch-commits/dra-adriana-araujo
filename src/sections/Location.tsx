import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Check, Copy, MapPin, Navigation } from "lucide-react";
import { SiWaze } from "react-icons/si";
import { ClipReveal } from "@/components/ClipReveal";
import { MagneticFill } from "@/components/micro";
import { KineticTextReveal } from "@/components/text/KineticTextReveal";
import { ADDRESS, DIRECTIONS_URL, MAP_EMBED_URL, WAZE_URL } from "@/lib/content";
import { cn, EASE_OUT } from "@/lib/utils";

/**
 * Where to find the clinic. The map is wiped in, toned to the site palette and
 * stays inert until clicked, so scrolling the page never gets trapped in it.
 */
export function Location() {
  const [interactive, setInteractive] = useState(false);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, amount: 0.35 });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${ADDRESS.street}, ${ADDRESS.unit} — ${ADDRESS.district}, ${ADDRESS.city}, ${ADDRESS.zip}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the address is still on screen to copy by hand */
    }
  };

  const lines = [
    { text: ADDRESS.street, cls: "text-[clamp(26px,2.6vw,40px)] font-light tracking-[-0.02em] text-ink" },
    { text: `${ADDRESS.unit} · ${ADDRESS.district}`, cls: "text-[17px] text-stone" },
    { text: `${ADDRESS.city} · CEP ${ADDRESS.zip}`, cls: "font-mono text-[13px] text-muted" },
  ];

  return (
    <section id="localizacao" className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 gap-y-12 px-4 pb-[16vh] md:px-10">
      <div className="col-span-12 flex flex-col lg:col-span-5">
        <p className="eyebrow text-muted">(10) — Onde estamos</p>
        <KineticTextReveal
          as="h2"
          text="No coração do Jardim Paulista."
          className="mt-3 max-w-[14ch] text-[clamp(34px,4vw,62px)] font-light leading-[1] tracking-[-0.03em]"
        />

        <address className="mt-10 not-italic">
          <span className="mb-4 grid size-11 place-items-center rounded-full bg-terra text-paper">
            <MapPin size={18} strokeWidth={1.6} aria-hidden="true" />
          </span>
          {lines.map((l, i) => (
            <ClipReveal key={l.text} from="down" delay={0.1 + i * 0.1} amount={1} className="mt-1.5">
              <span className={cn("block leading-snug", l.cls)}>{l.text}</span>
            </ClipReveal>
          ))}
        </address>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticFill href={DIRECTIONS_URL}>
            <Navigation size={16} strokeWidth={1.8} aria-hidden="true" /> Como chegar
          </MagneticFill>
          <a
            href={WAZE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[50px] items-center gap-2 rounded-full border border-ink/15 px-5 text-[15px] text-ink transition-colors duration-300 hover:border-ink"
          >
            <SiWaze size={17} aria-hidden="true" className="text-[#33ccff]" /> Waze
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-[50px] items-center gap-2 rounded-full px-4 text-[15px] text-stone transition-colors duration-300 hover:bg-ink/5"
            aria-live="polite"
          >
            <span className="relative grid size-4 place-items-center overflow-hidden">
              <Copy
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
                className={cn("absolute transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]", copied && "-translate-y-6")}
              />
              <Check
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className={cn("absolute text-terra transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]", !copied && "translate-y-6")}
              />
            </span>
            {copied ? "Endereço copiado" : "Copiar endereço"}
          </button>
        </div>
      </div>

      <div ref={mapRef} className="col-span-12 lg:col-span-7">
        <ClipReveal radius={28} duration={1.3} amount={0.35}>
          <div
            className="relative h-[min(64vh,600px)] min-h-[380px] overflow-hidden rounded-[28px] bg-sand"
            onMouseLeave={() => setInteractive(false)}
          >
            <iframe
              title={`Mapa: ${ADDRESS.query}`}
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={cn(
                "absolute -inset-px size-[calc(100%+2px)] border-0 [filter:grayscale(1)_sepia(.28)_contrast(.92)_brightness(1.04)]",
                !interactive && "pointer-events-none",
              )}
            />
            {/* Brand pin over the (desaturated) map pin, which sits at the centre */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
              initial={{ y: -90, scale: 0.6 }}
              animate={mapInView ? { y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.9 }}
            >
              <svg viewBox="0 0 40 52" className="h-14 w-11 drop-shadow-[0_10px_14px_rgba(28,26,24,0.35)]">
                <path d="M20 51C20 51 38 31 38 19A18 18 0 0 0 2 19C2 31 20 51 20 51Z" className="fill-terra" />
                <circle cx="20" cy="19" r="7" className="fill-paper" />
              </svg>
            </motion.div>
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="block size-16 animate-[ping-ring_2.4s_cubic-bezier(.16,1,.3,1)_infinite] rounded-full border-2 border-terra/50" />
            </span>

            {!interactive && (
              <button
                type="button"
                onClick={() => setInteractive(true)}
                className="absolute inset-0 flex items-end justify-between gap-3 p-4 text-left md:p-5"
                aria-label="Ativar o mapa para navegar"
              >
                <span className="rounded-full bg-paper/90 px-4 py-2 text-[13px] text-ink shadow-sm backdrop-blur">
                  {ADDRESS.district} · São Paulo
                </span>
                <span className="eyebrow rounded-full bg-ink/85 px-3 py-2 text-paper backdrop-blur">Clique para explorar</span>
              </button>
            )}
          </div>
        </ClipReveal>
      </div>
    </section>
  );
}
