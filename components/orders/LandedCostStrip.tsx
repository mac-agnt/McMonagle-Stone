import { formatEuro, type Order } from "@/lib/mockData";
import { landedCostForOrder } from "@/lib/pricing";

/** What this order cost us: material + haulage stacked against margin. */
export function LandedCostStrip({ order }: { order: Order }) {
  const cost = landedCostForOrder(order);
  const materialPct = cost.landedCost > 0 ? (cost.materialCost / cost.landedCost) * 100 : 0;

  return (
    <div className="border-t border-border-soft px-6 py-5">
      <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
        What this order cost us
      </h3>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-border-soft">
        <div className="h-full bg-ink-faint" style={{ width: `${materialPct}%` }} />
        <div className="h-full bg-ink-muted" style={{ width: `${100 - materialPct}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11.5px] text-ink-faint">Material + haulage</p>
          <p className="text-[13.5px] font-semibold tabular-nums text-ink">
            {formatEuro(cost.landedCost)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11.5px] text-ink-faint">Margin</p>
          <p
            className={`text-[13.5px] font-semibold tabular-nums ${
              cost.marginValue >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {formatEuro(cost.marginValue)} ({cost.marginPct}%)
          </p>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-ink-faint">
        {formatEuro(cost.landedCostPerTonne)} per tonne landed.
      </p>
    </div>
  );
}
