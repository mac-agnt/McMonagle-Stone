"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  reportArchive,
  reportArchiveTotals,
  formatMonthLong,
  formatEuroShort,
  formatTonnes,
  type ReportStatus,
} from "@/lib/mockData";

const statusTone: Record<ReportStatus, "success" | "accent" | "warning"> = {
  final: "success",
  issued: "accent",
  draft: "warning",
};

/**
 * The full back-catalogue of closed monthly reports. One long scrolling log,
 * grouped by year, every month a row you can pull the figures from at a glance.
 */
export function ReportArchive() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? reportArchive.filter((r) => {
          const label = formatMonthLong(r.month).toLowerCase();
          return label.includes(q) || r.by.toLowerCase().includes(q);
        })
      : reportArchive;

    const byYear = new Map<number, typeof reportArchive>();
    for (const r of filtered) {
      const year = Number(r.month.slice(0, 4));
      const list = byYear.get(year) ?? [];
      list.push(r);
      byYear.set(year, list);
    }
    return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
  }, [query]);

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">Previous reports</h2>
          <p className="pt-1 text-[12.5px] text-ink-faint">
            {reportArchiveTotals.months} months on file, back to 2024.{" "}
            {formatTonnes(reportArchiveTotals.tonnes)} and{" "}
            {formatEuroShort(reportArchiveTotals.revenue)} across the archive.
          </p>
        </div>

        <label className="relative w-full sm:w-56">
          <MagnifyingGlass
            size={15}
            weight="bold"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a month"
            className="w-full rounded-lg border border-border-soft bg-transparent py-2 pl-8 pr-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
          />
        </label>
      </div>

      <div className="mt-3 overflow-x-auto px-5 pb-5">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[1.4fr_auto_auto_auto_auto_1fr_auto] items-center gap-x-6 border-b border-border-soft pb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            <span>Month</span>
            <span className="text-right">Tonnage</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Own %</span>
            <span className="text-right">Conv.</span>
            <span>Prepared by</span>
            <span className="text-right">Status</span>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {groups.map(([year, rows]) => (
              <div key={year}>
                <div className="sticky top-0 z-10 bg-surface/95 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint backdrop-blur">
                  {year}
                </div>
                <div className="divide-y divide-border-soft">
                  {rows.map((r) => (
                    <div
                      key={r.id}
                      className="group grid grid-cols-[1.4fr_auto_auto_auto_auto_1fr_auto] items-center gap-x-6 py-2.5 text-[13px]"
                    >
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {formatMonthLong(r.month)}
                        <DownloadSimple
                          size={14}
                          weight="bold"
                          className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </span>
                      <span className="text-right tabular-nums text-ink-muted">
                        {formatTonnes(r.tonnes)}
                      </span>
                      <span className="text-right tabular-nums text-ink">
                        {formatEuroShort(r.revenue)}
                      </span>
                      <span className="text-right tabular-nums text-ink-muted">
                        {r.ownPct}%
                      </span>
                      <span className="text-right tabular-nums text-ink-muted">
                        {r.conversionPct}%
                      </span>
                      <span className="truncate text-ink-muted">{r.by}</span>
                      <span className="flex justify-end">
                        <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {groups.length === 0 && (
              <div className="py-10 text-center text-[13px] text-ink-faint">
                No month matches “{query}”.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
