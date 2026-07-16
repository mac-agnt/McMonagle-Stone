"use client";

import { motion } from "framer-motion";
import { Anchor } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { formatTonnes, type Order } from "@/lib/mockData";
import { ArrivalRow } from "./ArrivalRow";

/** One port's board: header plus its inbound shipments, soonest first. */
export function PortSection({ port, orders }: { port: string; orders: Order[] }) {
  const tonnes = orders.reduce((s, o) => s + o.tonnage, 0);

  return (
    <Card className="p-0" variants={fadeUp} transition={{ duration: 0.35, ease }}>
      <div className="flex items-center gap-3 border-b border-border-soft px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
          <Anchor size={17} weight="fill" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold text-ink">{port}</h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            {formatTonnes(tonnes)} at sea or at the quayside
          </p>
        </div>
        <span className="ml-auto rounded-full bg-border-soft px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-ink-muted">
          {orders.length}
        </span>
      </div>

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="divide-y divide-border-soft"
      >
        {orders.map((order) => (
          <ArrivalRow key={order.id} order={order} />
        ))}
      </motion.div>
    </Card>
  );
}
