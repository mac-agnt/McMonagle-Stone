"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const toneBar: Record<Tone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-ink-faint",
};

/** Thin rounded progress bar, matching the Home rail. */
export function ProgressBar({
  value,
  tone = "accent",
  className,
  animate = true,
}: {
  /** 0–100 */
  value: number;
  tone?: Tone;
  className?: string;
  animate?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-border-soft",
        className
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", toneBar[tone])}
        initial={animate ? { width: 0 } : false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
