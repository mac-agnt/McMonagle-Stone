"use client";

import { Card } from "@/components/ui/Card";
import { formatEuroShort } from "@/lib/mockData";

type Outcome = { count: number; value: number };

/**
 * Small closing strip: won, lost and still open with counts and value,
 * plus a thin won-against-lost bar that carries the conversion story.
 */
export function QuoteOutcomes({
  won,
  lost,
  open,
  conversionPct,
}: {
  won: Outcome;
  lost: Outcome;
  open: Outcome;
  conversionPct: number;
}) {
  const decidedValue = won.value + lost.value;
  const wonShare = decidedValue ? (won.value / decidedValue) * 100 : 0;
  const lostShare = 100 - wonShare;

  const cells: { label: string; dot: string; data: Outcome }[] = [
    { label: "Won", dot: "bg-success", data: won },
    { label: "Lost", dot: "bg-danger", data: lost },
    { label: "Still open", dot: "bg-ink-faint", data: open },
  ];

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">Quote outcomes</h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            How this month&apos;s quotes closed. Conversion counts won against won and lost.
          </p>
        </div>
        <span className="shrink-0 text-[12px] font-medium tabular-nums text-accent-strong">
          {conversionPct}% converted
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${c.dot}`} />
              <span className="text-[12.5px] text-ink-muted">{c.label}</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
              {c.data.count}
            </p>
            <p className="text-[12px] tabular-nums text-ink-faint">
              {formatEuroShort(c.data.value)}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-border-soft">
          <div className="h-full bg-success" style={{ width: `${wonShare}%` }} />
          <div className="h-full bg-danger" style={{ width: `${lostShare}%` }} />
        </div>
        <p className="mt-2 text-[11.5px] tabular-nums text-ink-faint">
          {formatEuroShort(won.value)} won against {formatEuroShort(lost.value)} lost on decided quotes.
        </p>
      </div>
    </Card>
  );
}
