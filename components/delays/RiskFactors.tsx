"use client";

import { motion } from "framer-motion";
import type { RiskFactor } from "@/lib/mockData";

/** Named external risk factor with a severity meter. */
export function RiskFactorBar({ factor }: { factor: RiskFactor }) {
  const tone =
    factor.severity >= 65 ? "bg-danger" : factor.severity >= 35 ? "bg-warning" : "bg-ink-faint";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-medium text-ink">{factor.name}</span>
        <span className="shrink-0 text-[11px] text-ink-faint">{factor.category}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-soft">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${factor.severity}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="text-[12px] leading-relaxed text-ink-faint">{factor.note}</p>
    </div>
  );
}
