"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/** Fuel-gauge style level bar: fill = onHand, notch = reorder point. */
export function StockLevelBar({
  onHand,
  capacity,
  reorderPoint,
  className,
}: {
  onHand: number;
  capacity: number;
  reorderPoint: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (onHand / capacity) * 100));
  const reorderPct = Math.max(0, Math.min(100, (reorderPoint / capacity) * 100));
  const critical = onHand < reorderPoint * 0.6;
  const below = onHand < reorderPoint;
  const tone = critical ? "bg-danger" : below ? "bg-warning" : "bg-accent";

  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-visible rounded-full bg-border-soft",
        className
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", tone)}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <span
        className="absolute top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-full bg-ink-faint/60"
        style={{ left: `${reorderPct}%` }}
        title="Reorder point"
      />
    </div>
  );
}
