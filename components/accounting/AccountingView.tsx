"use client";

import { motion } from "framer-motion";
import { Bank, ChartLineUp, HandCoins, Receipt } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { BarList } from "@/components/ui/BarList";
import { CountUp } from "@/components/ui/CountUp";
import { ProfitAndLoss } from "@/components/accounting/ProfitAndLoss";
import { AgedDebtors } from "@/components/accounting/AgedDebtors";
import { Creditors } from "@/components/accounting/Creditors";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  bankBalance,
  bankBalanceTrend,
  netProfitMTD,
  netMarginPctMTD,
  totalInvoicesOwed,
  invoicesOwed,
  totalCreditors,
  overdueCreditors,
  expenseCategoriesMTD,
  totalOperatingExpensesMTD,
  vatOnSalesMTD,
  vatReclaimableMTD,
  vatDueMTD,
  vatPeriodLabel,
  vatDueDate,
  formatEuro,
  formatEuroShort,
  formatDateLong,
} from "@/lib/mockData";

const expenseItems = expenseCategoriesMTD.map((e) => ({
  label: e.name,
  value: e.amount,
  display: formatEuro(e.amount),
}));

/**
 * Accounting: the numbers that would be sitting in Sage — cash, P&L,
 * who owes us, who we owe, and the VAT position. Month to date, 1–15 Jul.
 */
export function AccountingView() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Accounting"
        subtitle="Cash, profit and what's owed on both sides. Month to date, 1–15 Jul 2026."
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
            icon={Bank}
            label="Bank balance"
            value={<CountUp value={bankBalance} format={formatEuroShort} />}
            hint="Today's close"
            spark={bankBalanceTrend}
          />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={ChartLineUp}
            label="Net profit MTD"
            value={<CountUp value={netProfitMTD} format={formatEuroShort} />}
            hint={`${netMarginPctMTD}% margin`}
            valueTone={netProfitMTD >= 0 ? "success" : "danger"}
          />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={HandCoins}
            label="Owed to us"
            value={<CountUp value={totalInvoicesOwed} format={formatEuroShort} />}
            hint={`${invoicesOwed.length} accounts, all overdue`}
            valueTone="accent"
          />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Receipt}
            label="We owe"
            value={<CountUp value={totalCreditors} format={formatEuroShort} />}
            hint={`${formatEuro(overdueCreditors)} overdue`}
            valueTone={overdueCreditors > 0 ? "danger" : "ink"}
          />
        </motion.div>
      </motion.div>

      {/* P&L + VAT */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <ProfitAndLoss />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Card className="flex h-full flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[14.5px] font-semibold text-ink">
                  VAT position
                </h2>
                <p className="mt-0.5 text-[12px] text-ink-faint">
                  {vatPeriodLabel} return
                </p>
              </div>
              <Badge tone="warning">Due {formatDateLong(vatDueDate)}</Badge>
            </div>

            <div className="flex flex-col divide-y divide-border-soft text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-ink-muted">VAT on sales</span>
                <span className="tabular-nums text-ink">
                  {formatEuro(vatOnSalesMTD)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-ink-muted">VAT reclaimable</span>
                <span className="tabular-nums text-ink-muted">
                  −{formatEuro(vatReclaimableMTD)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold text-ink">Net VAT due</span>
                <span className="tabular-nums font-semibold text-ink">
                  {formatEuro(vatDueMTD)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Aged debtors + creditors */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <AgedDebtors />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <Creditors />
        </motion.div>
      </motion.div>

      {/* Operating expenses */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease }}
      >
        <Card className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14.5px] font-semibold text-ink">
                Operating expenses
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-faint">
                Month to date, excluding cost of goods sold.
              </p>
            </div>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {formatEuro(totalOperatingExpensesMTD)}
            </span>
          </div>
          <BarList items={expenseItems} tone="neutral" />
        </Card>
      </motion.div>
    </div>
  );
}
