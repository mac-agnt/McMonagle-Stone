"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  getCustomer,
  getProduct,
  formatDate,
  type Order,
  type OrderStage,
} from "@/lib/mockData";
import { vesselFor } from "./vessel";

/** Later stages read as a quiet timeline of sea to port to depot gate. */
const STAGE_TONE: Partial<Record<OrderStage, "neutral" | "accent" | "success">> = {
  Landed: "accent",
  "Ready at Depot": "neutral",
  Dispatched: "neutral",
  Delivered: "success",
};

/** Dimmed strip of import orders that have already made land, most recent first. */
export function RecentlyLanded({ orders }: { orders: Order[] }) {
  const landed = [...orders].sort((a, b) => b.eta.localeCompare(a.eta));
  return (
    <Card className="p-0">
      <div className="flex items-baseline justify-between px-5 py-4">
        <h2 className="text-[14.5px] font-semibold text-ink">Recently landed</h2>
        <span className="text-[12px] tabular-nums text-ink-faint">
          {orders.length} through the port
        </span>
      </div>

      {landed.length === 0 ? (
        <p className="px-5 pb-5 text-[12.5px] text-ink-muted">
          Nothing landed yet this week.
        </p>
      ) : (
        <motion.div
          variants={staggerContainer(0.04)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="divide-y divide-border-soft"
        >
          {landed.map((order) => {
            const customer = getCustomer(order.customerId);
            const product = getProduct(order.productId);
            const { vessel } = vesselFor(order);
            return (
              <motion.div
                key={order.id}
                variants={fadeUp}
                transition={{ duration: 0.3, ease }}
                className="flex items-center gap-4 px-5 py-3 text-ink-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink-muted">
                    {customer?.name ?? "Customer"}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-ink-faint">
                    {product?.name ?? "Product"}, {vessel}
                  </p>
                </div>

                <span className="hidden w-32 shrink-0 truncate text-[12px] text-ink-faint sm:block">
                  {product?.port ?? "Port"}
                </span>

                <span className="hidden w-16 shrink-0 text-right text-[12px] tabular-nums text-ink-faint md:block">
                  {formatDate(order.eta)}
                </span>

                <Badge
                  tone={STAGE_TONE[order.stage] ?? "neutral"}
                  className="shrink-0 px-2 py-0.5 text-[10.5px]"
                >
                  {order.stage}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
}
