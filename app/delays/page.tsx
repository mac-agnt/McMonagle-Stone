"use client";

import { motion } from "framer-motion";
import { Warning, Clock, TrendDown } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DelayList } from "@/components/delays/DelayList";
import { PredictedSlip } from "@/components/delays/PredictedSlip";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { ordersAtRisk, ordersLate, avgDaysSlipped } from "@/lib/mockData";

export default function DelaysPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Delay Radar"
        subtitle="What is slipping, and what is about to. Turn the dreaded late call into a calm heads-up."
        live
      />

      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Warning}
            label="Orders at risk"
            value={ordersAtRisk.length}
            hint="Still deliverable, moving slowly"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Clock}
            label="Orders already late"
            value={ordersLate.length}
            valueTone="danger"
            hint="Past the date we promised"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={TrendDown}
            label="Avg days slipped"
            value={avgDaysSlipped}
            hint="Across at-risk and late"
          />
        </motion.div>
      </motion.div>

      <DelayList />

      <PredictedSlip />
    </div>
  );
}
