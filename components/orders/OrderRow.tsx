"use client";

import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { StageProgress } from "@/components/ui/StageProgress";
import { StatusDot } from "@/components/ui/StatusDot";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  getCustomer,
  getProduct,
  stagesForSource,
  stageIndex,
  formatTonnes,
  formatEuro,
  formatDate,
  type Order,
} from "@/lib/mockData";

export function OrderRow({
  order,
  onSelect,
}: {
  order: Order;
  onSelect: (id: string) => void;
}) {
  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  const stages = stagesForSource(order.source);
  const idx = stageIndex(order);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.3, ease }}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(order.id);
        }
      }}
      className={cn(
        "flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors focus:outline-none focus-visible:bg-border-soft/60",
        order.status === "late"
          ? "bg-danger/[0.04] hover:bg-danger/[0.08]"
          : "hover:bg-border-soft/60"
      )}
    >
      {/* Customer + product */}
      <div className="w-[150px] shrink-0 md:w-[190px]">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13.5px] font-medium text-ink">
            {customer?.name ?? "Unknown customer"}
          </p>
          <Badge
            tone={order.type === "trade" ? "neutral" : "accent"}
            className="hidden shrink-0 px-1.5 py-0.5 text-[10px] sm:inline-flex"
          >
            {order.type === "trade" ? "Trade" : "B2C"}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-ink-faint">
          {product?.name ?? "Product"}
        </p>
      </div>

      {/* Tonnage + value */}
      <div className="hidden w-24 shrink-0 text-right lg:block">
        <p className="text-[13px] font-medium tabular-nums text-ink">
          {formatEuro(order.value)}
        </p>
        <p className="text-[11.5px] tabular-nums text-ink-faint">
          {formatTonnes(order.tonnage)}
        </p>
      </div>

      {/* Stage progress, the star element */}
      <div className="min-w-0 flex-1">
        <StageProgress stages={stages} currentIndex={idx} showLabel />
      </div>

      {/* ETA */}
      <div className="hidden w-16 shrink-0 text-right sm:block">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">ETA</p>
        <p className="text-[12.5px] font-medium tabular-nums text-ink">
          {formatDate(order.eta)}
        </p>
      </div>

      {/* Status */}
      <div className="flex shrink-0 items-center gap-1.5">
        <StatusDot status={order.status} pulse={order.status !== "on-time"} />
        <CaretRight
          size={14}
          className="text-ink-faint/60"
          aria-hidden
        />
      </div>
    </motion.div>
  );
}
