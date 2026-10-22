import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * componentry.dev "Scroll Choreography": four treatment photos trade corners,
 * stack in the centre, and the hot-stone photo opens up to fill the screen.
 */
export function Choreography() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Lenis already smooths the scroll, so no extra spring: progress drives transforms directly
  const p = scrollYProgress;
  const viewport = useViewport();

  const L = "-20vw";
  const R = "20vw";
  const T = "-15vh";
  const B = "15vh";
  const steps = [0, 0.3, 0.35, 0.65, 1];

  const tlX = useTransform(p, steps, [L, L, L, "0vw", "0vw"]);
  const tlY = useTransform(p, steps, [T, B, B, "0vh", "0vh"]);
  const brX = useTransform(p, steps, [R, R, R, "0vw", "0vw"]);
  const brY = useTransform(p, steps, [B, T, T, "0vh", "0vh"]);
  const blX = useTransform(p, steps, [L, L, L, "0vw", "0vw"]);
  const blY = useTransform(p, steps, [B, B, B, "0vh", "0vh"]);
  const trX = useTransform(p, steps, [R, R, R, "0vw", "0vw"]);
  const trY = useTransform(p, steps, [T, T, T, "0vh", "0vh"]);
  // FLIP expansion. The hero window is laid out full-bleed and scaled down to
  // card size; its contents are counter-scaled so the photo never distorts.
  // Only transforms change per frame, so nothing is repainted while it opens.
  const open = useTransform(p, [0.7, 0.9], [0, 1], { clamp: true });
  const cardW = Math.min(viewport.w * 0.36, 520);
  const fromX = cardW / viewport.w;
  const fromY = 26 / 112;
  const winX = useTransform(open, [0, 1], [fromX, 1]);
  const winY = useTransform(open, [0, 1], [fromY, 1]);
  // Counter-scale, times a zoom-out so the small window shows the whole picture, not a crop
  const zoom = useTransform(open, [0, 1], [0.42, 1]);
  const innerX = useTransform(() => zoom.get() / winX.get());
  const innerY = useTransform(() => zoom.get() / winY.get());
  // Radius as a fixed percentage of the full-size box: it reads as 14px at card size
  // and simply grows with the window, so it never has to be re-rasterised.
  const radius = `${((14 / cardW) * 100).toFixed(3)}% / ${((14 / (viewport.h * 0.26)) * 100).toFixed(3)}%`;

  // Headline slides up out of its mask as the stack gathers
  const titleY = useTransform(p, [0.3, 0.55], ["0%", "-135%"]);
  // Closing statement rises into its mask on the full-bleed photo
  const endY = useTransform(p, [0.88, 0.98], ["110%", "0%"]);

  const base = "absolute left-1/2 top-[56%] h-[26vh] w-[min(36vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] bg-sand shadow-2xl";

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-[96px] z-50 overflow-hidden pb-2 text-center">
          <motion.div style={{ y: titleY }}>
            <p className="eyebrow text-muted">(05) — O espaço</p>
            <p className="mx-auto mt-3 max-w-[22ch] text-[clamp(26px,3vw,46px)] font-light leading-[1.02] tracking-[-0.02em]">
              Técnicas que se <span className="font-serif italic text-terra">encontram</span> no seu corpo.
            </p>
          </motion.div>
        </div>

        <motion.div style={{ x: tlX, y: tlY }} className={`${base} z-10`}>
          <img src="img/ventosa-costas.webp" alt="Ventosaterapia nas costas" className="size-full object-cover" />
        </motion.div>
        <motion.div style={{ x: brX, y: brY }} className={`${base} z-20`}>
          <img src="img/limpeza-pele.webp" alt="Adriana realizando limpeza de pele" className="size-full object-cover object-top" />
        </motion.div>
        <motion.div style={{ x: blX, y: blY }} className={`${base} z-30`}>
          <img src="img/acupuntura.webp" alt="Acupuntura com ventosas no ombro" className="size-full object-cover" />
        </motion.div>
        <motion.div
          style={{ x: trX, y: trY, scaleX: winX, scaleY: winY, borderRadius: radius }}
          className="absolute left-1/2 top-[56%] z-40 h-[112vh] w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-stone will-change-transform"
        >
          <motion.div style={{ scaleX: innerX, scaleY: innerY }} className="absolute inset-0">
            <img src="img/pedras-hd.webp" alt="Pedras quentes alinhadas ao longo da coluna" className="size-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-[10vh] mx-auto max-w-[1600px] overflow-hidden px-4 pb-3 text-paper md:px-10">
            <motion.p style={{ y: endY }} className="max-w-[14ch] text-[clamp(36px,6vw,96px)] font-light leading-[0.95] tracking-[-0.03em]">
              Um espaço para <span className="font-serif italic text-blush">desacelerar.</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Viewport size, updated on resize only (never read during scroll). */
function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSize(read()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return size;
}
