"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { BarList, type BarItem } from "@/components/ui/BarList";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { fadeUp, ease } from "@/lib/motion";
import {
  tonnageByQuarry,
  volumeByProduct,
  getQuarry,
  getProduct,
  formatTonnes,
  formatEuroShort,
} from "@/lib/mockData";

type Metric = "tonnes" | "euro";

const metricOptions = [
  { value: "tonnes", label: "Tonnes" },
  { value: "euro", label: "€" },
];

function toBars(
  rows: { tonnes: number; value: number; label: string }[],
  metric: Metric
): BarItem[] {
  return rows.map((r) =>
    metric === "euro"
      ? { label: r.label, value: r.value, display: formatEuroShort(r.value) }
      : { label: r.label, value: r.tonnes, display: formatTonnes(r.tonnes) }
  );
}

/**
 * Two throughput charts sharing one metric toggle. Flip to euros and the
 * ranking reorders, which is the honest-metric point made visible.
 */
export function VolumeCharts() {
  const [metric, setMetric] = useState<Metric>("tonnes");

  const quarryRows = tonnageByQuarry.map((q) => ({
    tonnes: q.tonnes,
    value: q.value,
    label: getQuarry(q.quarryId)?.name ?? "Unknown quarry",
  }));

  const productRows = volumeByProduct.map((p) => ({
    tonnes: p.tonnes,
    value: p.value,
    label: getProduct(p.productId)?.name ?? "Unknown product",
  }));

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14.5px] font-semibold text-ink">Throughput this month</h2>
        <SegmentedToggle
          options={metricOptions}
          value={metric}
          onChange={(v) => setMetric(v as Metric)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-[13px] font-medium text-ink-muted">
            Tonnage out by quarry
          </h3>
          <BarList items={toBars(quarryRows, metric)} />
        </Card>

        <Card>
          <h3 className="mb-4 text-[13px] font-medium text-ink-muted">
            Volume by product
          </h3>
          <BarList items={toBars(productRows, metric)} />
        </Card>
      </div>
    </motion.section>
  );
}
