"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { staggerContainer, fadeIn, ease } from "@/lib/motion";

export type BarItem = {
  label: string;
  value: number;
  /** Optional right-aligned formatted display; defaults to value. */
  display?: string;
};

/**
 * Horizontal bar list (one row per item): label · bar · value.
 * Calm single-accent bars, length carries the comparison.
 */
export function BarList({
  items,
  tone = "accent",
  className,
}: {
  items: BarItem[];
  tone?: "accent" | "neutral";
  className?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const barColor = tone === "accent" ? "bg-accent" : "bg-ink-faint";

  return (
    <motion.div
      variants={staggerContainer(0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={cn("flex flex-col gap-3.5", className)}
    >
      {items.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeIn}
          transition={{ duration: 0.3, ease }}
          className="flex items-center gap-3"
        >
          <span className="w-28 shrink-0 truncate text-[12.5px] text-ink-muted sm:w-36">
            {item.label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-soft">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.value / max) * 100}%` }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-[12.5px] font-medium tabular-nums text-ink">
            {item.display ?? item.value.toLocaleString("en-IE")}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
