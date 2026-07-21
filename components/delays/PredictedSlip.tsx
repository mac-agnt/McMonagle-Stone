"use client";

import { motion } from "framer-motion";
import { Path } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { RiskScore } from "./RiskScore";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  ordersPredictedSlip,
  getCustomer,
  getProduct,
  formatDate,
  riskScoreFor,
} from "@/lib/mockData";
import { predictedWhy } from "./helpers";

/** Forecast section: on-time orders our tracking thinks will slip. */
export function PredictedSlip() {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-3 px-5 pt-5">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
          <Path size={17} weight="fill" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold text-ink">
            Predicted to slip
          </h2>
          <p className="text-[12px] text-ink-faint">
            On time today, but tracking behind the usual pace. A heads-up, not a
            late order yet.
          </p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-3 divide-y divide-border-soft"
      >
        {ordersPredictedSlip.map((order) => {
          const customer = getCustomer(order.customerId);
          const product = getProduct(order.productId);
          const risk = riskScoreFor(order);
          return (
            <motion.div
              key={order.id}
              variants={fadeUp}
              transition={{ duration: 0.3, ease }}
              className="px-5 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-ink">
                    {customer?.name ?? "Unknown customer"}
                  </p>
                  <p className="truncate text-[12px] text-ink-faint">
                    {product?.name ?? "Order"} · {order.id}
                  </p>
                </div>
                <RiskScore score={risk.score} className="shrink-0" />
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {predictedWhy(order)}
              </p>

              {risk.score > 0 && risk.factors.length > 0 && (
                <p className="mt-1 text-[11.5px] text-ink-faint">
                  Contributing: {risk.factors.map((f) => f.name).join(", ")}
                </p>
              )}

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-faint">
                <span className="tabular-nums">
                  ETA{" "}
                  <span className="font-medium text-ink-muted">
                    {formatDate(order.eta)}
                  </span>
                </span>
                {order.predictedReason && (
                  <span>Likely cause: {order.predictedReason}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
}
