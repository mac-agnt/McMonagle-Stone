"use client";

import { motion } from "framer-motion";
import { Target, Trophy, Warning } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendArea } from "@/components/ui/TrendArea";
import { YieldMeter } from "@/components/production/YieldMeter";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  productionRows,
  yieldByDay,
  avgYieldPct,
  worstLoad,
  bestLoad,
  formatDate,
  type QualityFlag,
} from "@/lib/mockData";

const qualityTone: Record<QualityFlag, "success" | "warning" | "danger"> = {
  good: "success",
  fair: "warning",
  poor: "danger",
};

const qualityLabel: Record<QualityFlag, string> = {
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const chartData = yieldByDay.map((d) => ({
  label: formatDate(d.date),
  value: d.yieldPct,
}));

export default function ProductionPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Production Yield"
        subtitle="What goes in, what comes out, and where it goes wrong."
      />

      {/* Header stat row - minimal, not the main visual */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Target}
            label="Average yield"
            value={`${avgYieldPct}%`}
            valueTone="accent"
            hint="Across all loads this period"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Trophy}
            label={`Best load, ${bestLoad.quarry.name}`}
            value={`${bestLoad.yieldPct}%`}
            valueTone="success"
            hint={`${bestLoad.product.name}, ${formatDate(bestLoad.date)}`}
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Warning}
            label={`Worst load, ${worstLoad.quarry.name}`}
            value={`${worstLoad.yieldPct}%`}
            valueTone="danger"
            hint={worstLoad.note ?? `${worstLoad.product.name}, ${formatDate(worstLoad.date)}`}
          />
        </motion.div>
      </motion.div>

      {/* Trend chart - the page's main visual, distinct from a KPI grid */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease }}
      >
        <Card className="p-0">
          <div className="px-5 pt-5">
            <h2 className="text-[14.5px] font-semibold text-ink">
              Yield over the last 10 days
            </h2>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">
              Finished tonnes out as a share of raw block in, load by load.
            </p>
          </div>
          <div className="px-3 pb-4 pt-2">
            <TrendArea data={chartData} valueSuffix="%" color="var(--color-accent)" />
          </div>
        </Card>
      </motion.div>

      {/* Loads list, each with its own in vs out meter */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.35, ease }}
      >
        <Card className="p-0">
          <div className="px-5 pt-5">
            <h2 className="text-[14.5px] font-semibold text-ink">Loads</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">
              Every load run through the yard, quarry to finished stone.
            </p>
          </div>

          <div className="mt-3 divide-y divide-border-soft px-5 pb-2">
            {productionRows.map((load) => (
              <div key={load.id} className="py-4 first:pt-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[13.5px] font-medium text-ink">
                    {load.quarry.name} &middot; {load.product.name}
                  </span>
                  <span className="text-[11.5px] text-ink-faint">
                    {formatDate(load.date)}
                  </span>
                </div>

                <YieldMeter tonnesIn={load.tonnesIn} tonnesOut={load.tonnesOut} className="mt-2" />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={qualityTone[load.qualityFlag]}>
                    {qualityLabel[load.qualityFlag]}
                  </Badge>
                  {load.note && (
                    <span className="text-[12px] text-ink-faint">{load.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
