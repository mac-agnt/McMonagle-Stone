"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarList } from "@/components/ui/BarList";
import {
  invoicesOwed,
  debtorsAging,
  agingBucketOrder,
  agingBucket,
  totalInvoicesOwed,
  getCustomer,
  formatEuro,
} from "@/lib/mockData";

const bucketTone: Record<string, "neutral" | "warning" | "danger"> = {
  current: "neutral",
  "1-30": "neutral",
  "31-60": "warning",
  "61-90": "danger",
  "90+": "danger",
};

/**
 * Money owed to us: aged into the standard 30/60/90 buckets, then the
 * individual invoices behind them, oldest first.
 */
export function AgedDebtors() {
  const bucketItems = agingBucketOrder.map((bucket) => ({
    label: bucket === "current" ? "Not yet due" : `${bucket} days`,
    value: debtorsAging[bucket],
    display: formatEuro(debtorsAging[bucket]),
  }));

  const sorted = [...invoicesOwed].sort((a, b) => b.daysOverdue - a.daysOverdue);

  return (
    <Card className="flex flex-col gap-5 p-0">
      <div className="px-5 pt-5">
        <h2 className="text-[14.5px] font-semibold text-ink">
          Money owed to us
        </h2>
        <p className="pt-1 text-[12.5px] text-ink-faint">
          {formatEuro(totalInvoicesOwed)} across {invoicesOwed.length} accounts, aged.
        </p>
      </div>

      <div className="px-5">
        <BarList items={bucketItems} tone="accent" />
      </div>

      <div className="flex flex-col divide-y divide-border-soft border-t border-border-soft px-5 pb-5">
        {sorted.map((inv) => {
          const customer = getCustomer(inv.customerId);
          const bucket = agingBucket(inv.daysOverdue);
          return (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-3 py-2.5 text-[13px]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">
                  {customer?.name ?? inv.customerId}
                </p>
                <p className="text-[11.5px] text-ink-faint">{inv.id}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={bucketTone[bucket]}>{inv.daysOverdue}d overdue</Badge>
                <span className="w-16 text-right tabular-nums text-ink">
                  {formatEuro(inv.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
