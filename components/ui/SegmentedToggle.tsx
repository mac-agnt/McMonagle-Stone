"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type SegmentOption = { value: string; label: string };

/** Compact segmented toggle (e.g. € / tonnes). Sand pill slides under active. */
export function SegmentedToggle({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const layoutId = useId();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-bg p-0.5",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
              active ? "text-accent-ink" : "text-ink-faint hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent"
                transition={springSoft}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
