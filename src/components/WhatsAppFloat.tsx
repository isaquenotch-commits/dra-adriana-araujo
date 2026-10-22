import { motion } from "motion/react";
import { useScrolledPast } from "@/lib/useScrolledPast";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT_URL, WHATSAPP_DISPLAY } from "@/lib/content";
import { EASE_IN_OUT } from "@/lib/utils";
import { useSite } from "./SiteContext";

/**
 * Persistent WhatsApp shortcut. It stays out of the way on the hero (which has
 * its own CTA), in the contact section and while the menu is open, and opens
 * as a circle wipe rather than fading in.
 */
export function WhatsAppFloat() {
  const { ready, menuOpen } = useSite();
  const pastHero = useScrolledPast("80vh");
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const el = document.getElementById("contato");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = ready && pastHero && !atContact && !menuOpen;

  return (
    <motion.a
      href={CONTACT_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={`Conversar no WhatsApp: ${WHATSAPP_DISPLAY}`}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className="group fixed bottom-5 right-4 z-[65] flex h-14 items-center gap-0 rounded-full bg-[#25D366] pl-[15px] pr-[15px] text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] md:bottom-8 md:right-8"
      initial={false}
      animate={{ clipPath: shown ? "circle(75% at 50% 50%)" : "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.6, ease: EASE_IN_OUT }}
      style={{ pointerEvents: shown ? "auto" : "none" }}
    >
      <FaWhatsapp size={26} aria-hidden="true" className="shrink-0" />
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns,margin] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:ml-2.5 group-hover:grid-cols-[1fr] group-focus-visible:ml-2.5 group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap text-[14px] font-medium">Agendar avaliação</span>
      </span>
    </motion.a>
  );
}
