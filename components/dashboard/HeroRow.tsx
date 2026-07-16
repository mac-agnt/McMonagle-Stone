"use client";

import { motion } from "framer-motion";
import { Package, Coins, ClockCountdown, Warning } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Sparkline } from "@/components/ui/Sparkline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LiveDot } from "@/components/ui/LiveDot";
import { fadeUp, staggerContainer, ease } from "@/lib/motion";
import {
  dispatchToday,
  dashboardKpis,
  formatEuroShort,
  formatTonnes,
} from "@/lib/mockData";

/**
 * Hero row: the honest "number of the day" (tonnes dispatched) beside three
 * supporting stat cards. Volume leads, euros support.
 */
export function HeroRow() {
  const pct = dashboardKpis.pctOfTarget;
  const onTarget = pct >= 100;
  const atRisk = dashboardKpis.ordersAtRisk;
  const followUps = dashboardKpis.quotesAwaitingFollowUp;

  return (
    <motion.section
      variants={staggerContainer(0.07)}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_2fr]"
    >
      {/* Number of the day */}
      <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
        <Card className="flex h-full flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
              <Package size={17} weight="fill" />
            </span>
            <LiveDot />
          </div>

          <div>
            <p className="text-[12.5px] text-ink-faint">Tonnes dispatched today</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums text-accent sm:text-6xl">
              {dispatchToday.tonnes.toLocaleString("en-IE")}
            </p>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              of {formatTonnes(dispatchToday.target)} target
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className={
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold " +
                  (onTarget
                    ? "bg-success/15 text-success"
                    : "bg-warning/15 text-warning")
                }
              >
                {pct}% of target
              </span>
              <div className="text-accent">
                <Sparkline data={dispatchToday.trend} height={36} />
              </div>
            </div>
            <ProgressBar value={pct} tone={onTarget ? "success" : "accent"} />
          </div>
        </Card>
      </motion.div>

      {/* Supporting stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Coins}
            label="Open order value"
            value={formatEuroShort(dashboardKpis.openOrderValue)}
            hint="Across orders not yet delivered"
            valueTone="accent"
          />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={ClockCountdown}
            label="Quotes awaiting follow-up"
            value={followUps}
            hint="Open 3 days or more, not yet chased"
            valueTone={followUps > 0 ? "danger" : "ink"}
          />
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Warning}
            label="Orders at risk"
            value={atRisk}
            hint="At-risk or already late"
            valueTone={atRisk > 0 ? "danger" : "ink"}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
