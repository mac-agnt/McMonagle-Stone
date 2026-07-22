"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import {
  revenueMTD,
  cogsMTD,
  grossProfitMTD,
  grossMarginPctMTD,
  totalOperatingExpensesMTD,
  netProfitMTD,
  netMarginPctMTD,
  formatEuro,
} from "@/lib/mockData";

/**
 * Sage-style income statement: revenue down to net profit, month to date.
 * Subtotals carry a margin badge so the read doesn't need a calculator.
 */
export function ProfitAndLoss() {
  return (
    <Card className="p-0">
      <div className="px-5 pt-5">
        <h2 className="text-[14.5px] font-semibold text-ink">Profit &amp; loss</h2>
        <p className="pt-1 text-[12.5px] text-ink-faint">Month to date, 1–15 Jul 2026.</p>
      </div>

      <div className="mt-3 flex flex-col divide-y divide-border-soft px-5 pb-5 text-[13px]">
        <div className="flex items-center justify-between py-2.5">
          <span className="text-ink-muted">Revenue</span>
          <span className="tabular-nums text-ink">{formatEuro(revenueMTD)}</span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <span className="text-ink-muted">Cost of goods sold</span>
          <span className="tabular-nums text-ink-muted">−{formatEuro(cogsMTD)}</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="font-semibold text-ink">Gross profit</span>
          <div className="flex items-center gap-2">
            <Badge tone="accent">{grossMarginPctMTD}%</Badge>
            <span className="tabular-nums font-semibold text-ink">
              {formatEuro(grossProfitMTD)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <span className="text-ink-muted">Operating expenses</span>
          <span className="tabular-nums text-ink-muted">
            −{formatEuro(totalOperatingExpensesMTD)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="font-semibold text-ink">Net profit</span>
          <div className="flex items-center gap-2">
            <Badge tone={netProfitMTD >= 0 ? "success" : "danger"}>
              {netMarginPctMTD}%
            </Badge>
            <span
              className={cn(
                "tabular-nums font-semibold",
                netProfitMTD >= 0 ? "text-ink" : "text-danger"
              )}
            >
              {formatEuro(netProfitMTD)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
