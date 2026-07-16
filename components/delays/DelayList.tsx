"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { DelayRow } from "./DelayRow";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { ordersLate, ordersAtRisk } from "@/lib/mockData";

/** Late orders first, then at-risk. Single row open at a time. */
const rows = [...ordersLate, ...ordersAtRisk];

export function DelayList() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-[14.5px] font-semibold text-ink">
          Slipping now
        </h2>
        <span className="text-[12px] text-ink-faint tabular-nums">
          {rows.length} orders
        </span>
      </div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="mt-3 divide-y divide-border-soft"
      >
        {rows.map((order) => (
          <motion.div
            key={order.id}
            variants={fadeUp}
            transition={{ duration: 0.3, ease }}
          >
            <DelayRow
              order={order}
              open={openId === order.id}
              onToggle={() =>
                setOpenId((cur) => (cur === order.id ? null : order.id))
              }
            />
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}
