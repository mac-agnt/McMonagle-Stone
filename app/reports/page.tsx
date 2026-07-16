"use client";

import { motion } from "framer-motion";
import { Stack, CurrencyEur, ArrowsLeftRight, Target } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarList } from "@/components/ui/BarList";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  tonnageByQuarry,
  volumeByProduct,
  quotesWon,
  quotesLost,
  quotesOpenFresh,
  quotesNeedFollowUp,
  quotesCold,
  getQuarry,
  getProduct,
  formatTonnes,
  formatEuroShort,
} from "@/lib/mockData";
import { ExportButton } from "@/components/reports/ExportButton";
import { SourcingMix } from "@/components/reports/SourcingMix";
import { DepotTable } from "@/components/reports/DepotTable";
import { QuoteOutcomes } from "@/components/reports/QuoteOutcomes";
import { ReportArchive } from "@/components/reports/ReportArchive";

/* ---- Derived figures (all from mockData, consistent with sibling pages) ---- */

const totalTonnes = tonnageByQuarry.reduce((s, q) => s + q.tonnes, 0);
const totalRevenue = tonnageByQuarry.reduce((s, q) => s + q.value, 0);

const ownProducts = volumeByProduct.filter(
  (p) => getProduct(p.productId)?.origin === "own"
);
const importProducts = volumeByProduct.filter(
  (p) => getProduct(p.productId)?.origin === "import"
);
const ownTonnes = ownProducts.reduce((s, p) => s + p.tonnes, 0);
const importTonnes = importProducts.reduce((s, p) => s + p.tonnes, 0);
const ownValue = ownProducts.reduce((s, p) => s + p.value, 0);
const importValue = importProducts.reduce((s, p) => s + p.value, 0);
const mixTonnes = ownTonnes + importTonnes;
const ownPct = mixTonnes ? Math.round((ownTonnes / mixTonnes) * 100) : 0;
const importPct = 100 - ownPct;

const wonValue = quotesWon.reduce((s, q) => s + q.value, 0);
const lostValue = quotesLost.reduce((s, q) => s + q.value, 0);
const openList = [...quotesOpenFresh, ...quotesNeedFollowUp, ...quotesCold];
const openValue = openList.reduce((s, q) => s + q.value, 0);
const conversionPct =
  quotesWon.length + quotesLost.length
    ? Math.round((quotesWon.length / (quotesWon.length + quotesLost.length)) * 100)
    : 0;

const quarryItems = tonnageByQuarry.map((q) => ({
  label: getQuarry(q.quarryId)?.name ?? q.quarryId,
  value: q.tonnes,
  display: formatTonnes(q.tonnes),
}));
const productItems = volumeByProduct.map((p) => ({
  label: getProduct(p.productId)?.name ?? p.productId,
  value: p.tonnes,
  display: formatTonnes(p.tonnes),
}));

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Reports"
        subtitle="July 2026. Tonnage, revenue, sourcing mix and quote conversion on one page."
        right={
          <>
            <Badge tone="neutral">July 2026</Badge>
            <ExportButton />
          </>
        }
      />

      {/* KPI row */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Stack}
            label="Tonnage out"
            value={formatTonnes(totalTonnes)}
            hint="Out the gate across five quarries"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={CurrencyEur}
            label="Revenue"
            value={formatEuroShort(totalRevenue)}
            valueTone="accent"
            hint="Billed across all quarries"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={ArrowsLeftRight}
            label="Own vs import"
            value={`${ownPct}%`}
            hint="Own quarry share of tonnage"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Target}
            label="Quote conversion"
            value={`${conversionPct}%`}
            hint="Won against won and lost"
          />
        </motion.div>
      </motion.div>

      {/* Two charts */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card className="flex h-full flex-col gap-5">
            <div>
              <h2 className="text-[14.5px] font-semibold text-ink">
                Tonnage by quarry
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-faint">
                Where the month&apos;s stone came out of the ground.
              </p>
            </div>
            <BarList items={quarryItems} tone="accent" />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card className="flex h-full flex-col gap-5">
            <div>
              <h2 className="text-[14.5px] font-semibold text-ink">
                Volume by product
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-faint">
                What actually shifted, own quarry and import together.
              </p>
            </div>
            <BarList items={productItems} tone="neutral" />
          </Card>
        </motion.div>
      </motion.div>

      {/* Sourcing mix */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease }}
      >
        <SourcingMix
          own={{ tonnes: ownTonnes, value: ownValue, pct: ownPct }}
          imported={{ tonnes: importTonnes, value: importValue, pct: importPct }}
        />
      </motion.div>

      {/* By depot */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease }}
      >
        <DepotTable />
      </motion.div>

      {/* Quote outcomes */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease }}
      >
        <QuoteOutcomes
          won={{ count: quotesWon.length, value: wonValue }}
          lost={{ count: quotesLost.length, value: lostValue }}
          open={{ count: openList.length, value: openValue }}
          conversionPct={conversionPct}
        />
      </motion.div>

      {/* Report archive */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.35, ease }}
      >
        <ReportArchive />
      </motion.div>
    </div>
  );
}
