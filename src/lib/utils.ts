import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Expo-out: fast start, long calm settle. No overshoot anywhere on the site. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Page offset at which a pinned (sticky) section has reached `progress` (0–1). */
export function pinnedScrollY(section: HTMLElement, progress: number) {
  const top = section.getBoundingClientRect().top + window.scrollY;
  return top + progress * (section.offsetHeight - window.innerHeight);
}
