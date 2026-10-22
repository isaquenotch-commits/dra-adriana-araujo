import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame, MotionConfig } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { Preloader } from "@/components/Preloader";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SiteContext } from "@/components/SiteContext";
import { About } from "@/sections/About";
import { BodyMap } from "@/sections/BodyMap";
import { Choreography } from "@/sections/Choreography";
import { Contact } from "@/sections/Contact";
import { Evolution } from "@/sections/Evolution";
import { Faq } from "@/sections/Faq";
import { Gallery } from "@/sections/Gallery";
import { Hero } from "@/sections/Hero";
import { Journey } from "@/sections/Journey";
import { Manifesto } from "@/sections/Manifesto";
import { Specialties } from "@/sections/Specialties";
import { Location } from "@/sections/Location";
import { Testimonials } from "@/sections/Testimonials";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const lenisRef = useRef<LenisRef>(null);

  // Drive Lenis from Motion's frame loop, in the read phase, so the scroll
  // position is updated *before* any scroll animation measures it in the same
  // frame. With its own requestAnimationFrame, Lenis wrote scroll after Motion
  // had already read layout, which interleaved reads and writes every frame.
  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => lenisRef.current?.lenis?.raf(timestamp);
    frame.read(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    // Smooth scrolling is motion too: native scrolling for reduced-motion users
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.09, wheelMultiplier: 1, smoothWheel: !prefersReducedMotion, autoRaf: false }}
    >
      <MotionConfig reducedMotion="user">
        <Site />
      </MotionConfig>
    </ReactLenis>
  );
}

function Site() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  // Hold the page still while the preloader and the menu are up
  useEffect(() => {
    if (!lenis) return;
    if (loading || menuOpen) lenis.stop();
    else lenis.start();
  }, [lenis, loading, menuOpen]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  /** Accepts a section id, "top", or an absolute scroll offset in px. */
  const scrollTo = useCallback(
    (id: string | number) => {
      const target = typeof id === "number" ? id : id === "top" ? 0 : document.getElementById(id);
      if (target === null) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth" });
    },
    [lenis],
  );

  const ctx = useMemo(() => ({ ready, menuOpen, setMenuOpen, scrollTo }), [ready, menuOpen, scrollTo]);

  return (
    <SiteContext.Provider value={ctx}>
      <div>
        <a
          href="#conteudo"
          className="fixed left-4 top-3 z-[120] -translate-y-[200%] rounded-full bg-ink px-4 py-2 text-[14px] text-paper focus-visible:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        {loading && <Preloader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
        <Header />
        <Menu />
        <WhatsAppFloat />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero />
          <Manifesto />
          <About />
          <Specialties />
          <BodyMap />
          <Choreography />
          <Gallery />
          <Journey />
          <Evolution />
          <Testimonials />
          <Faq />
          <Location />
          <Contact />
        </main>
      </div>
    </SiteContext.Provider>
  );
}

