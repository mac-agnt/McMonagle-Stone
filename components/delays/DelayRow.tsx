"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CaretDown,
  CaretUp,
  Copy,
  Check,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  getCustomer,
  getProduct,
  formatDate,
  type Order,
} from "@/lib/mockData";
import { draftMessage } from "./helpers";

export function DelayRow({
  order,
  open,
  onToggle,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  const isLate = order.status === "late";
  const message = draftMessage(order, customer, product);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSend = () => {
    setSent(true);
    window.setTimeout(() => setSent(false), 2600);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-border-soft/50 sm:gap-4"
      >
        <Badge tone={isLate ? "danger" : "warning"} dot className="shrink-0">
          {isLate ? "Late" : "At risk"}
        </Badge>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-ink">
            {customer?.name ?? "Unknown customer"}
          </p>
          <p className="truncate text-[12px] text-ink-faint">
            {product?.name ?? "Order"} · {order.id}
          </p>
        </div>

        <div className="hidden items-center gap-2 text-[12.5px] tabular-nums md:flex">
          <span className="text-ink-faint line-through">
            {formatDate(order.originalEta)}
          </span>
          <ArrowRight size={13} weight="bold" className="text-ink-faint" />
          <span className="font-semibold text-ink">{formatDate(order.eta)}</span>
        </div>

        <span className="hidden shrink-0 text-[12px] font-semibold tabular-nums text-ink-muted sm:inline">
          +{order.daysSlipped ?? 0}d
        </span>

        {order.delayReason && (
          <Badge tone="neutral" className="hidden shrink-0 lg:inline-flex">
            {order.delayReason}
          </Badge>
        )}

        <span className="flex size-7 shrink-0 items-center justify-center text-ink-faint">
          {open ? (
            <CaretUp size={15} weight="bold" />
          ) : (
            <CaretDown size={15} weight="bold" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease }}
            className="px-5 pb-5"
          >
            <div className="rounded-2xl bg-surface-raised p-4">
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-faint md:hidden">
                <span className="tabular-nums">
                  <span className="line-through">
                    {formatDate(order.originalEta)}
                  </span>{" "}
                  now{" "}
                  <span className="font-semibold text-ink">
                    {formatDate(order.eta)}
                  </span>
                </span>
                <span className="tabular-nums">
                  +{order.daysSlipped ?? 0}d slipped
                </span>
                {order.delayReason && <span>{order.delayReason}</span>}
              </div>

              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                Drafted update for the customer
              </p>
              <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
                {message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className={cn(copied && "text-success")}
                >
                  {copied ? (
                    <Check size={15} weight="bold" />
                  ) : (
                    <Copy size={15} weight="regular" />
                  )}
                  {copied ? "Copied" : "Copy message"}
                </Button>

                <Button variant="primary" size="sm" onClick={handleSend}>
                  {sent ? (
                    <Check size={15} weight="bold" />
                  ) : (
                    <PaperPlaneTilt size={15} weight="fill" />
                  )}
                  {sent ? "Sent" : "Send"}
                </Button>

                {sent && (
                  <span className="text-[12px] text-ink-faint">
                    Update sent to {customer?.name ?? "the customer"}.
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
