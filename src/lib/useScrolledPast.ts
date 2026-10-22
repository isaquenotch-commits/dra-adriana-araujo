import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `offset` (px, or a CSS length such as
 * "80vh"). Uses an IntersectionObserver on an invisible sentinel instead of a
 * scroll listener, so nothing runs while the user scrolls.
 */
export function useScrolledPast(offset: number | string) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    Object.assign(sentinel.style, {
      position: "absolute",
      left: "0",
      top: typeof offset === "number" ? `${offset}px` : offset,
      width: "1px",
      height: "1px",
      pointerEvents: "none",
      visibility: "hidden",
    });
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [offset]);
  return past;
}
