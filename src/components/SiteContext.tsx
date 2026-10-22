import { createContext, useContext } from "react";

interface SiteState {
  /** True once the preloader has handed the page over. */
  ready: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  /** Section id, "top", or an absolute scroll offset in px. */
  scrollTo: (id: string | number) => void;
}

export const SiteContext = createContext<SiteState>({
  ready: false,
  menuOpen: false,
  setMenuOpen: () => {},
  scrollTo: () => {},
});

export const useSite = () => useContext(SiteContext);
