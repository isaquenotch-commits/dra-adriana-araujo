import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/utils";

const FROM = {
  up: "inset(100% 0% 0% 0% round RADIUS)",
  down: "inset(0% 0% 100% 0% round RADIUS)",
  right: "inset(0% 100% 0% 0% round RADIUS)",
};

/**
 * Wipes its content into view with a clip-path. The in-view check lives on an
 * unclipped wrapper: Chrome's IntersectionObserver treats an element that is
 * fully hidden by its own clip-path as not intersecting, so observing the
 * clipped element directly would never fire.
 */
export function ClipReveal({
  children,
  className,
  innerClassName,
  from = "up",
  delay = 0,
  duration = 1,
  amount = 0.3,
  radius = 0,
  as = "div",
  onSubmit,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  from?: keyof typeof FROM;
  delay?: number;
  duration?: number;
  amount?: number;
  radius?: number;
  as?: "div" | "form";
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
  const variants = {
    hidden: { clipPath: FROM[from].replace("RADIUS", `${radius}px`) },
    shown: { clipPath: `inset(0% 0% 0% 0% round ${radius}px)`, transition: { duration, ease: EASE_OUT, delay } },
  };
  return (
    <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount }}>
      {as === "form" ? (
        <motion.form onSubmit={onSubmit} className={innerClassName} variants={variants}>
          {children}
        </motion.form>
      ) : (
        <motion.div className={innerClassName} variants={variants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
