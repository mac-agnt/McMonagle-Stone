"use client";

import { motion } from "framer-motion";
import { Gauge } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { RiskFactorBar } from "./RiskFactors";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { riskFactors } from "@/lib/mockData";

/** External conditions currently feeding into every order's risk score. */
export function RiskFactorsPanel() {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-3 px-5 pt-5">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
          <Gauge size={17} weight="fill" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold text-ink">
            Risk factors in play
          </h2>
          <p className="text-[12px] text-ink-faint">
            External conditions affecting shipping and production right now.
          </p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-4 flex flex-col gap-5 px-5 pb-5"
      >
        {riskFactors.map((factor) => (
          <motion.div key={factor.id} variants={fadeUp} transition={{ duration: 0.3, ease }}>
            <RiskFactorBar factor={factor} />
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}
