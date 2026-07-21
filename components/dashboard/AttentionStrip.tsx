"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { stockBelowReorder, riskFactors, formatTonnes } from "@/lib/mockData";

type StripRow = {
  label: string;
  meta: string;
  value?: string;
  tone: "danger" | "warning";
  href: string;
};

const toneText = {
  danger: "text-danger",
  warning: "text-warning",
} as const;

const toneRule = {
  danger: "bg-danger",
  warning: "bg-warning",
} as const;

/**
 * Slim ribbon under the hero row: the single worst stock alert and the
 * single highest-severity risk factor, each one line, each a jump link.
 * Not a second dashboard. Renders nothing if there is nothing worth flagging.
 */
export function AttentionStrip() {
  const rows: StripRow[] = [];

  const worstStock = [...stockBelowReorder].sort(
    (a, b) => a.runOutWeeks - b.runOutWeeks
  )[0];
  if (worstStock) {
    rows.push({
      label: worstStock.product.name,
      meta: `${formatTonnes(worstStock.onHand)} on hand, reorder at ${formatTonnes(worstStock.reorderPoint)}`,
      value:
        worstStock.runOutWeeks === Infinity
          ? undefined
          : `${worstStock.runOutWeeks}w left`,
      tone: "danger",
      href: "/stock",
    });
  }

  const topRisk = [...riskFactors].sort((a, b) => b.severity - a.severity)[0];
  if (topRisk) {
    rows.push({
      label: topRisk.name,
      meta: `${topRisk.category} · ${topRisk.affectedProductIds.length} products exposed`,
      value: `${topRisk.severity}/100`,
      tone: topRisk.severity >= 70 ? "danger" : "warning",
      href: "/delays",
    });
  }

  if (rows.length === 0) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, ease }}
    >
      <Card className="p-0">
        <div className="divide-y divide-border-soft">
          {rows.map((row) => (
            <Link
              key={row.label}
              href={row.href}
              className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-border-soft/50"
            >
              <span
                className={cn(
                  "h-7 w-[2px] shrink-0 rounded-full",
                  toneRule[row.tone]
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-ink">
                  {row.label}
                </p>
                <p className="truncate text-[11.5px] text-ink-faint">
                  {row.meta}
                </p>
              </div>
              {row.value && (
                <span
                  className={cn(
                    "shrink-0 text-[12.5px] font-semibold tabular-nums",
                    toneText[row.tone]
                  )}
                >
                  {row.value}
                </span>
              )}
              <ArrowRight
                size={13}
                weight="bold"
                className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
