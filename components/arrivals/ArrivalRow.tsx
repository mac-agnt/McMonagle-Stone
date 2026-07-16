"use client";

import { motion } from "framer-motion";
import { StageProgress } from "@/components/ui/StageProgress";
import { StatusDot } from "@/components/ui/StatusDot";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  getCustomer,
  getProduct,
  stagesForSource,
  stageIndex,
  formatDate,
  formatTonnes,
  type Order,
} from "@/lib/mockData";
import { vesselFor } from "./vessel";

/** A single inbound shipment row on the port board. */
export function ArrivalRow({ order }: { order: Order }) {
  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  const stages = stagesForSource(order.source);
  const idx = stageIndex(order);
  const { vessel, voyage } = vesselFor(order);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.3, ease }}
      className={cn(
        "flex items-center gap-4 px-5 py-3.5 transition-colors",
        order.status === "late"
          ? "bg-danger/[0.04] hover:bg-danger/[0.08]"
          : "hover:bg-border-soft/60"
      )}
    >
      {/* Vessel + cargo */}
      <div className="w-[160px] shrink-0 md:w-[220px]">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-[13.5px] font-medium text-ink">{vessel}</p>
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-ink-faint">
            {voyage}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-ink-faint">
          {product?.name ?? "Product"} for {customer?.name ?? "customer"}
        </p>
      </div>

      {/* Tonnage */}
      <div className="hidden w-20 shrink-0 text-right lg:block">
        <p className="text-[13px] font-medium tabular-nums text-ink">
          {formatTonnes(order.tonnage)}
        </p>
      </div>

      {/* Stage progress (hidden on the narrowest widths) */}
      <div className="hidden min-w-0 flex-1 sm:block">
        <StageProgress stages={stages} currentIndex={idx} showLabel />
      </div>

      {/* ETA */}
      <div className="w-16 shrink-0 text-right">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">ETA</p>
        <p className="text-[12.5px] font-medium tabular-nums text-ink">
          {formatDate(order.eta)}
        </p>
      </div>

      {/* Status */}
      <div className="flex shrink-0 items-center">
        <StatusDot status={order.status} pulse={order.status !== "on-time"} />
      </div>
    </motion.div>
  );
}
