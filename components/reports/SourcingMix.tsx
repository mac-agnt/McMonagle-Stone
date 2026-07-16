"use client";

import { Card } from "@/components/ui/Card";
import { formatEuroShort, formatTonnes } from "@/lib/mockData";

type Side = { tonnes: number; value: number; pct: number };

/**
 * The own-vs-import story in one bar. Own quarry stock (accent) against
 * imported stone (muted), split by tonnage out this month.
 */
export function SourcingMix({ own, imported }: { own: Side; imported: Side }) {
  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 className="text-[14.5px] font-semibold text-ink">Sourcing mix</h2>
        <p className="mt-0.5 text-[12px] text-ink-faint">
          Own quarry against imported stone, measured by tonnage out this month.
        </p>
      </div>

      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-border-soft"
        role="img"
        aria-label={`Own quarry ${own.pct} percent, imported ${imported.pct} percent by tonnage`}
      >
        <div className="h-full bg-accent" style={{ width: `${own.pct}%` }} />
        <div className="h-full bg-ink-faint" style={{ width: `${imported.pct}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="text-[12.5px] text-ink-muted">Own quarry</span>
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
            {own.pct}%
          </p>
          <p className="text-[12px] tabular-nums text-ink-faint">
            {formatTonnes(own.tonnes)} · {formatEuroShort(own.value)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-ink-faint" />
            <span className="text-[12.5px] text-ink-muted">Imported</span>
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
            {imported.pct}%
          </p>
          <p className="text-[12px] tabular-nums text-ink-faint">
            {formatTonnes(imported.tonnes)} · {formatEuroShort(imported.value)}
          </p>
        </div>
      </div>
    </Card>
  );
}
