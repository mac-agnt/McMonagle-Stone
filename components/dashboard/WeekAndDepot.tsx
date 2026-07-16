"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TrendArea } from "@/components/ui/TrendArea";
import { LiveDot } from "@/components/ui/LiveDot";
import { fadeUp, ease } from "@/lib/motion";
import {
  weeklyDispatch,
  depotSummary,
  formatEuro,
  formatTonnes,
} from "@/lib/mockData";

/**
 * Lower row: the week's dispatch curve (today partial, weekend still zero)
 * beside a calm per-depot rollup.
 */
export function WeekAndDepot() {
  const weekData = weeklyDispatch.map((d) => ({ label: d.day, value: d.tonnes }));

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease }}
      className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1.2fr]"
    >
      <Card className="p-0">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-[14.5px] font-semibold text-ink">This week</h2>
          <LiveDot />
        </div>
        <p className="px-5 pt-1 text-[12.5px] text-ink-faint">
          Tonnes dispatched, Monday to Sunday
        </p>
        <div className="px-3 pb-4 pt-2">
          <TrendArea data={weekData} valueSuffix="t" />
        </div>
      </Card>

      <Card className="p-0">
        <div className="px-5 pt-5">
          <h2 className="text-[14.5px] font-semibold text-ink">By depot</h2>
          <p className="pt-1 text-[12.5px] text-ink-faint">Live orders on the books</p>
        </div>

        <div className="mt-3 overflow-x-auto px-5 pb-2">
          <div className="grid min-w-[320px] grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 pb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            <span>Depot</span>
            <span className="text-right">Orders</span>
            <span className="text-right">Tonnes</span>
            <span className="text-right">Value</span>
          </div>

          <div className="divide-y divide-border-soft">
            {depotSummary.map((row) => (
              <div
                key={row.depotId}
                className="grid min-w-[320px] grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 py-2.5 text-[13px]"
              >
                <span className="font-medium text-ink">{row.name}</span>
                <span className="text-right tabular-nums text-ink-muted">
                  {row.orders}
                </span>
                <span className="text-right tabular-nums text-ink-muted">
                  {formatTonnes(row.tonnes)}
                </span>
                <span className="text-right tabular-nums text-ink">
                  {formatEuro(row.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
