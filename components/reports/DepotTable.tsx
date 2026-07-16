"use client";

import { Card } from "@/components/ui/Card";
import { depotSummary, formatEuro, formatTonnes } from "@/lib/mockData";

/**
 * Per-depot rollup with a bold total row. Scrolls sideways on narrow screens
 * so the four columns never fold into each other.
 */
export function DepotTable() {
  const totals = depotSummary.reduce(
    (acc, r) => ({
      orders: acc.orders + r.orders,
      tonnes: acc.tonnes + r.tonnes,
      value: acc.value + r.value,
    }),
    { orders: 0, tonnes: 0, value: 0 }
  );

  return (
    <Card className="p-0">
      <div className="px-5 pt-5">
        <h2 className="text-[14.5px] font-semibold text-ink">By depot</h2>
        <p className="pt-1 text-[12.5px] text-ink-faint">
          Live orders on the books, split across the four yards.
        </p>
      </div>

      <div className="mt-3 overflow-x-auto px-5 pb-5">
        <div className="min-w-[420px]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 border-b border-border-soft pb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            <span>Depot</span>
            <span className="text-right">Orders</span>
            <span className="text-right">Tonnes</span>
            <span className="text-right">Value</span>
          </div>

          <div className="divide-y divide-border-soft">
            {depotSummary.map((row) => (
              <div
                key={row.depotId}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 py-2.5 text-[13px]"
              >
                <span className="font-medium text-ink">{row.name}</span>
                <span className="text-right tabular-nums text-ink-muted">
                  {row.orders}
                </span>
                <span className="text-right tabular-nums text-ink-muted">
                  {formatTonnes(row.tonnes)}
                </span>
                <span className="text-right tabular-nums text-ink">
                  {formatEuro(row.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 border-t border-border pt-3 text-[13px] font-semibold text-ink">
            <span>Total</span>
            <span className="text-right tabular-nums">{totals.orders}</span>
            <span className="text-right tabular-nums">
              {formatTonnes(totals.tonnes)}
            </span>
            <span className="text-right tabular-nums">
              {formatEuro(totals.value)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
