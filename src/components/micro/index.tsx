import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Micro-interactions adapted from microkit.co — same mechanics, brand palette. */

/** microkit "Staggered Letter Text Swap": letters roll up one after another. */
export function StaggerSwap({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)} aria-hidden="true">
      {Array.from(label).map((letter, i) => (
        <span
          key={i}
          style={{ "--d": `${i * 28}ms` } as CSSProperties}
          className="relative inline-grid place-items-center overflow-hidden leading-[1.15]"
        >
          <span className="col-start-1 row-start-1 whitespace-pre [transition:transform_.5s_cubic-bezier(.16,1,.3,1)] [transition-delay:var(--d)] group-hover:-translate-y-[115%] group-focus-visible:-translate-y-[115%]">
            {letter}
          </span>
          <span className="col-start-1 row-start-1 translate-y-[115%] whitespace-pre [transition:transform_.5s_cubic-bezier(.16,1,.3,1)] [transition-delay:var(--d)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

/** microkit "Magnetic Fill Button": pulls toward the pointer, fills from below. */
export function MagneticFill({
  children,
  href,
  className,
  dark = false,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  dark?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${(e.clientX - (b.left + b.width / 2)) * 0.14}px`);
    e.currentTarget.style.setProperty("--my", `${(e.clientY - (b.top + b.height / 2)) * 0.22}px`);
  };
  const reset = (e: ReactPointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
  };
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-7 py-3.5 text-[15px] font-medium",
    "[transform:translate(var(--mx,0px),var(--my,0px))] transition-[transform,color] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terra",
    dark
      ? "border-paper/40 text-paper hover:text-ink focus-visible:text-ink"
      : "border-ink text-ink hover:text-paper focus-visible:text-paper",
    className,
  );
  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-0 transition-[height] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:h-full group-focus-visible:h-full",
          dark ? "bg-paper" : "bg-ink",
        )}
      />
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel} onPointerMove={move} onPointerLeave={reset} className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} onPointerMove={move} onPointerLeave={reset} className={cls}>
      {inner}
    </button>
  );
}

/** microkit "Contact Details Reveal": the dot drops, the label lifts, details slide in. */
export function ContactReveal({ label, detail, href }: { label: string; detail: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative inline-flex h-[46px] items-center pr-2 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terra"
    >
      <span
        aria-hidden="true"
        className="relative size-[10px] shrink-0 rounded-full bg-ink [transition:background-color_.32s_ease,transform_.42s_cubic-bezier(.16,1,.3,1)] group-hover:translate-y-[4px] group-hover:bg-terra group-focus-visible:translate-y-[4px] group-focus-visible:bg-terra"
      />
      <span className="relative ml-3 h-[42px] w-[150px]">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[16px] leading-none [transition:top_.42s_cubic-bezier(.16,1,.3,1),transform_.42s_cubic-bezier(.16,1,.3,1)] group-hover:top-[5px] group-hover:translate-y-0 group-focus-visible:top-[5px] group-focus-visible:translate-y-0">
          {label}
        </span>
        <span className="absolute left-0 top-[26px] whitespace-nowrap font-mono text-[10.5px] leading-none text-muted [clip-path:inset(0_100%_0_0)] [transition:clip-path_.5s_cubic-bezier(.16,1,.3,1)_.05s] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]">
          {detail}
        </span>
      </span>
    </a>
  );
}

/** microkit "Sliding Arrow Label": the pill fills and an arrow slides out from behind. */
export function SlidingArrow({
  children,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = cn(
    "group relative inline-flex items-center overflow-hidden pr-6 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terra",
    className,
  );
  const inner = (
    <>
      <span className="rounded-full px-3 py-1 transition-colors duration-300 group-hover:bg-terra group-hover:text-paper">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-0 flex w-4 -translate-x-3 [clip-path:inset(0_100%_0_0)] transition-[clip-path,transform] duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:[clip-path:inset(0_0_0_0)]"
      >
        <ArrowRight size={16} strokeWidth={2} />
      </span>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** microkit "Focus Field": the border warms and a soft ring grows on focus. */
export function FocusField({
  label,
  name,
  placeholder,
  type = "text",
  textarea = false,
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const cls =
    "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/70 shadow-[0_0_0_0_#9c5b4300] outline-none transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] focus:border-terra focus:shadow-[0_0_0_4px_#9c5b4322]";
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-muted">{label}</span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={3} required={required} className={cn(cls, "resize-none")} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} className={cls} />
      )}
    </label>
  );
}

export { ArrowUpRight };
