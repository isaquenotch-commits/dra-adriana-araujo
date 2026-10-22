import { motion } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Typewriter } from "@/components/text/Typewriter";
import { FAQ } from "@/lib/content";
import { cn, EASE_OUT } from "@/lib/utils";

/** bencho.dev "FAQ Accordion": panels open on a grid-row track and the answer steps in word by word. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-4 py-[16vh] md:px-10">
      <div className="col-span-12 mb-10 md:col-span-5">
        <p className="eyebrow text-muted">(09) — Dúvidas</p>
        <h2 className="mt-3 min-h-[2.1em] max-w-[12ch] text-[clamp(34px,4vw,60px)] font-light leading-[1.02] tracking-[-0.03em]">
          <Typewriter words={["Perguntas que sempre chegam no direct."]} speed={45} />
        </h2>
      </div>

      <div className="col-span-12 md:col-span-7">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="relative" data-open={isOpen || undefined}>
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block h-px origin-left bg-ink/15"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE_OUT, delay: i * 0.08 }}
              />
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[clamp(19px,1.8vw,26px)] leading-tight transition-colors group-hover:text-terra">{item.q}</span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                    isOpen && "rotate-45 bg-ink text-paper",
                  )}
                >
                  <Plus size={16} strokeWidth={1.8} />
                </span>
              </button>
              <div className="fqa-a" id={`faq-${i}`} role="region">
                <div>
                  <p className="max-w-[560px] pb-7 text-[16.5px] leading-relaxed text-stone" aria-label={item.a}>
                    {item.a.split(" ").map((w, k) => (
                      <span key={k} aria-hidden="true" style={{ "--k": k } as React.CSSProperties}>
                        {w}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <span className="block h-px w-full bg-ink/15" />
      </div>
    </section>
  );
}
