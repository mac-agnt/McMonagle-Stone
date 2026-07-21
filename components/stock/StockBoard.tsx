"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { StockLevelBar } from "@/components/stock/StockLevelBar";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { formatTonnes, getDepot, type StockRow } from "@/lib/mockData";

/** Rough pallets-per-tonne conversion, display only. */
const TONNES_PER_PALLET = 1.4;

type Unit = "tonnes" | "pallets";

function formatByUnit(tonnes: number, unit: Unit): string {
  if (unit === "tonnes") return formatTonnes(tonnes);
  const pallets = tonnes / TONNES_PER_PALLET;
  const rounded = pallets >= 10 ? Math.round(pallets) : Math.round(pallets * 10) / 10;
  return `${rounded.toLocaleString("en-IE")} pl`;
}

function StockRowItem({ row, unit }: { row: StockRow; unit: Unit }) {
  const critical = row.onHand < row.reorderPoint * 0.6;
  const below = row.onHand < row.reorderPoint;
  return (
    <div className="py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <div>
          <p className="text-[13.5px] font-medium text-ink">{row.product.name}</p>
          <p className="text-[12px] text-ink-faint">
            {getDepot(row.depotId)?.name ?? row.depotId} depot
          </p>
        </div>
        {below ? (
          <Badge tone={critical ? "danger" : "warning"}>
            {critical ? "Critical, below reorder" : "Below reorder"}
          </Badge>
        ) : (
          <span className="text-[12px] text-ink-faint">
            {Number.isFinite(row.runOutWeeks) ? `${row.runOutWeeks} weeks left` : "steady"}
          </span>
        )}
      </div>

      <StockLevelBar
        onHand={row.onHand}
        capacity={row.capacity}
        reorderPoint={row.reorderPoint}
        className="mt-3"
      />

      <div className="mt-2 flex items-center justify-between text-[12px] tabular-nums text-ink-muted">
        <span>
          {formatByUnit(row.onHand, unit)} of {formatByUnit(row.capacity, unit)} capacity
        </span>
        <span className="text-ink-faint">reorder at {formatByUnit(row.reorderPoint, unit)}</span>
      </div>
    </div>
  );
}

export function StockBoard({
  ownRows,
  importRows,
  belowReorderCount,
  totalTonnesOnHand,
}: {
  ownRows: StockRow[];
  importRows: StockRow[];
  belowReorderCount: number;
  totalTonnesOnHand: number;
}) {
  const [unit, setUnit] = useState<Unit>("tonnes");

  return (
    <>
      <PageHeader
        title="Stock & Inventory"
        subtitle="Every product, what's on the yard, and what's about to run short."
        right={
          <SegmentedToggle
            options={[
              { value: "tonnes", label: "Tonnes" },
              { value: "pallets", label: "Pallets" },
            ]}
            value={unit}
            onChange={(v) => setUnit(v as Unit)}
          />
        }
      />

      <Card>
        <p className="text-[13.5px] text-ink-muted">
          <span className="font-semibold tabular-nums text-ink">{belowReorderCount}</span>{" "}
          products below reorder point
          <span className="mx-2 text-ink-faint">·</span>
          <span className="font-semibold tabular-nums text-ink">
            {formatByUnit(totalTonnesOnHand, unit)}
          </span>{" "}
          on hand
        </p>
      </Card>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card>
            <h2 className="text-[14.5px] font-semibold text-ink">Own quarry stock</h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              Stone cut from our own ground, held across the depot network.
            </p>
            <div className="mt-2 divide-y divide-border-soft">
              {ownRows.map((row) => (
                <StockRowItem key={`${row.productId}-${row.depotId}`} row={row} unit={unit} />
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card>
            <h2 className="text-[14.5px] font-semibold text-ink">Imported stock</h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              Brought in from overseas ports, held for finish and dispatch.
            </p>
            <div className="mt-2 divide-y divide-border-soft">
              {importRows.map((row) => (
                <StockRowItem key={`${row.productId}-${row.depotId}`} row={row} unit={unit} />
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
