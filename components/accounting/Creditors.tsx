"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { supplierBills, totalCreditors, formatEuro } from "@/lib/mockData";

/**
 * Money we owe: supplier bills, oldest first. Bills not yet due show days
 * remaining instead of a red badge.
 */
export function Creditors() {
  const sorted = [...supplierBills].sort((a, b) => b.daysOverdue - a.daysOverdue);

  return (
    <Card className="flex flex-col gap-4 p-0">
      <div className="px-5 pt-5">
        <h2 className="text-[14.5px] font-semibold text-ink">Money we owe</h2>
        <p className="pt-1 text-[12.5px] text-ink-faint">
          {formatEuro(totalCreditors)} across {supplierBills.length} supplier bills.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border-soft border-t border-border-soft px-5 pb-5">
        {sorted.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between gap-3 py-2.5 text-[13px]"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{bill.supplier}</p>
              <p className="text-[11.5px] text-ink-faint">{bill.id}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {bill.daysOverdue > 0 ? (
                <Badge tone="danger">{bill.daysOverdue}d overdue</Badge>
              ) : (
                <Badge tone="neutral">Due in {Math.abs(bill.daysOverdue)}d</Badge>
              )}
              <span className="w-16 text-right tabular-nums text-ink">
                {formatEuro(bill.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
