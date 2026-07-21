"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatTonnes } from "@/lib/mockData";

/** Nested tonnage-in/out meter: fill = tonnes out, remainder = waste. */
export function YieldMeter({
  tonnesIn,
  tonnesOut,
  className,
}: {
  tonnesIn: number;
  tonnesOut: number;
  className?: string;
}) {
  const yieldPct = tonnesIn > 0 ? Math.round((tonnesOut / tonnesIn) * 100) : 0;
  const outPct = Math.max(0, Math.min(100, yieldPct));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-border-soft">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${outPct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex items-center justify-between text-[11.5px] text-ink-faint">
        <span className="tabular-nums">
          {formatTonnes(tonnesOut)} out of {formatTonnes(tonnesIn)}
        </span>
        <span className="font-semibold tabular-nums text-ink">{yieldPct}%</span>
      </div>
    </div>
  );
}
