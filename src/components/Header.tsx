import { motion } from "motion/react";
import { useScrolledPast } from "@/lib/useScrolledPast";
import { CONTACT_URL, WHATSAPP_DISPLAY } from "@/lib/content";
import { cn, EASE_OUT } from "@/lib/utils";
import { ContactReveal, StaggerSwap } from "./micro";
import { useSite } from "./SiteContext";

export function Header() {
  const { ready, menuOpen, setMenuOpen, scrollTo } = useSite();
  const solid = useScrolledPast(40);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-colors duration-500",
        solid && !menuOpen ? "bg-bone/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 md:px-10">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            scrollTo("top");
          }}
          className={cn("group text-left transition-colors duration-500", menuOpen ? "text-paper" : "text-ink")}
          aria-label="Adriana Araujo — início"
        >
          <span className="block overflow-hidden">
            <motion.span
              className="block text-[15px] font-normal tracking-[0.3em]"
              initial={{ y: "110%" }}
              animate={ready ? { y: "0%" } : {}}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
            >
              <StaggerSwap label="ADRIANA ARAUJO" />
            </motion.span>
          </span>
        </button>

        <div className="flex items-center gap-2 md:gap-6">
          <motion.div
            className={cn("hidden transition-opacity md:block", menuOpen && "pointer-events-none invisible")}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={ready ? { clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.35 }}
          >
            <ContactReveal label="Agendar avaliação" detail={`WhatsApp ${WHATSAPP_DISPLAY}`} href={CONTACT_URL} />
          </motion.div>

          <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} ready={ready} />
        </div>
      </div>
      <motion.span
        aria-hidden="true"
        className={cn("absolute inset-x-0 bottom-0 block h-px origin-left", menuOpen ? "bg-paper/15" : "bg-ink/10")}
        initial={{ scaleX: 0 }}
        animate={ready ? { scaleX: 1 } : {}}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.1 }}
      />
    </header>
  );
}

function MenuButton({ open, onClick, ready }: { open: boolean; onClick: () => void; ready: boolean }) {
  return (
    <motion.button
      id="menu-button"
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-full pl-5 pr-2 transition-colors duration-500",
        open ? "bg-paper text-ink" : "bg-ink text-paper",
      )}
      initial={{ clipPath: "inset(0 0 0 100% round 999px)" }}
      animate={ready ? { clipPath: "inset(0 0 0 0% round 999px)" } : {}}
      transition={{ duration: 1, ease: EASE_OUT, delay: 0.45 }}
    >
      <span className="relative block h-[1.15em] w-[5.2em] overflow-hidden text-left text-[13px] uppercase tracking-[0.16em]">
        <span className={cn("block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]", open && "-translate-y-full")}>
          Menu
        </span>
        <span
          className={cn(
            "absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            open && "translate-y-0",
          )}
        >
          Fechar
        </span>
      </span>
      <span className={cn("relative grid size-7 place-items-center rounded-full", open ? "bg-ink" : "bg-paper")}>
        <span
          className={cn(
            "absolute h-px w-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "rotate-45 bg-paper" : "-translate-y-[3px] bg-ink",
          )}
        />
        <span
          className={cn(
            "absolute h-px w-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "-rotate-45 bg-paper" : "translate-y-[3px] bg-ink",
          )}
        />
      </span>
    </motion.button>
  );
}
