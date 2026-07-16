"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import type { RepPerformance } from "@/lib/mockData";

/**
 * Follow-up discipline per rep. First read on the seller-vs-order-taker
 * split: who sends quotes and actually chases them, and who does not.
 */
export function RepDiscipline({ rows }: { rows: RepPerformance[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col divide-y divide-border-soft"
    >
      {rows.map((rep) => (
        <motion.div
          key={rep.repId}
          variants={fadeUp}
          transition={{ duration: 0.3, ease }}
          className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
        >
          <Avatar initials={rep.initials} size={34} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-medium text-ink">
                {rep.name}
                <span className="ml-1.5 text-[11.5px] font-normal text-ink-faint">
                  {rep.role}
                </span>
              </p>
              <span className="shrink-0 text-[12px] font-medium tabular-nums text-ink">
                {rep.followUpRate}%
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] tabular-nums text-ink-faint">
              {rep.sent} sent, {rep.followedUp} chased, {rep.won} won
            </p>
            <ProgressBar value={rep.followUpRate} tone="accent" className="mt-2" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
