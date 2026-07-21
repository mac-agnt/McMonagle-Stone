"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Stepper } from "@/components/ui/Stepper";
import { CountUp } from "@/components/ui/CountUp";
import { CostWaterfall } from "@/components/quoting/CostWaterfall";
import { fadeUp, ease } from "@/lib/motion";
import { products, depots, formatEuro } from "@/lib/mockData";
import { quoteFromInputs } from "@/lib/pricing";

const selectClassName =
  "h-10 rounded-[10px] border border-border bg-bg px-3 text-[13.5px] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export default function QuotingPage() {
  const [productId, setProductId] = useState(products[0].id);
  const [tonnage, setTonnage] = useState(20);
  const [depotId, setDepotId] = useState(depots[0].id);
  const [yieldLossPct, setYieldLossPct] = useState(12);
  const [marginPct, setMarginPct] = useState(30);

  const product = products.find((p) => p.id === productId) ?? products[0];
  const isImport = product.origin === "import";

  const result = useMemo(
    () =>
      quoteFromInputs({
        productId,
        tonnage,
        depotId,
        yieldLossPct: isImport ? 0 : yieldLossPct,
        marginPct,
      }),
    [productId, tonnage, depotId, yieldLossPct, marginPct, isImport]
  );

  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Quoting Engine"
        subtitle="Cost it properly before you send the number."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card className="flex flex-col gap-5">
            <Field label="Product">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className={selectClassName}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Depot">
              <select
                value={depotId}
                onChange={(e) => setDepotId(e.target.value)}
                className={selectClassName}
              >
                {depots.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tonnage">
              <Stepper value={tonnage} onChange={setTonnage} min={1} max={500} step={1} suffix="t" />
            </Field>

            <Field
              label="Yield loss"
              helper={
                isImport
                  ? "Not applicable to imported stone."
                  : "Expected waste from quarry to finished product."
              }
            >
              <Stepper
                value={isImport ? 0 : yieldLossPct}
                onChange={isImport ? () => {} : setYieldLossPct}
                min={0}
                max={40}
                step={1}
                suffix="%"
                className={isImport ? "pointer-events-none opacity-40" : undefined}
              />
            </Field>

            <Field label="Margin">
              <Stepper value={marginPct} onChange={setMarginPct} min={10} max={60} step={5} suffix="%" />
            </Field>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.35, ease, delay: 0.05 }}
        >
          <Card className="flex flex-col gap-6">
            {result ? (
              <>
                <CostWaterfall
                  materialCost={result.materialCost}
                  haulageCost={result.haulageCost}
                  marginValue={result.marginValue}
                  total={result.quotePrice}
                />
                <div className="flex flex-col gap-1 border-t border-border pt-5">
                  <span className="text-[12px] text-ink-faint">Quote price</span>
                  <span className="text-4xl font-semibold tracking-tight tabular-nums text-accent">
                    <CountUp value={result.quotePrice} format={formatEuro} />
                  </span>
                  <span className="text-[13px] text-ink-muted">
                    {formatEuro(result.quotePricePerTonne)}/t
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-ink-faint">
                Enter a tonnage above zero to see a quote.
              </p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
