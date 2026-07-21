"use client";

import { motion } from "framer-motion";
import { formatEuro } from "@/lib/mockData";

type Segment = { label: string; value: number; className: string };

/** Live-updating stacked cost receipt: material, haulage, margin -> quote price. */
export function CostWaterfall({
  materialCost,
  haulageCost,
  marginValue,
  total,
}: {
  materialCost: number;
  haulageCost: number;
  marginValue: number;
  total: number;
}) {
  const segments: Segment[] = [
    { label: "Material", value: materialCost, className: "bg-ink-faint" },
    { label: "Haulage", value: haulageCost, className: "bg-ink-muted" },
    { label: "Margin", value: marginValue, className: "bg-accent" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-8 w-full overflow-hidden rounded-[10px] bg-border-soft">
        {segments.map((s) => (
          <motion.div
            key={s.label}
            className={s.className}
            animate={{ width: `${total > 0 ? Math.max(0, (s.value / total) * 100) : 0}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {segments.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${s.className}`} />
              <span className="text-[11.5px] text-ink-muted">{s.label}</span>
            </div>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {formatEuro(s.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
