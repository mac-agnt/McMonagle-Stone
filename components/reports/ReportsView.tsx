"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { ExportButton } from "@/components/reports/ExportButton";
import { MonthlyReport } from "@/components/reports/MonthlyReport";
import { MorningBriefing } from "@/components/reports/MorningBriefing";
import { dailyBriefing, formatDateLong } from "@/lib/mockData";

type ReportView = "monthly" | "daily";

/**
 * Reports page shell. Holds the monthly-vs-daily view toggle and switches
 * between the existing monthly report and the new 6:00 briefing.
 */
export function ReportsView() {
  const [view, setView] = useState<ReportView>("monthly");

  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Reports"
        subtitle={
          view === "monthly"
            ? "July 2026. Tonnage, revenue, sourcing mix and quote conversion on one page."
            : "The 6:00 read on stock, logistics, money owed and today's risk."
        }
        right={
          <>
            <Badge tone="neutral">
              {view === "monthly" ? "July 2026" : formatDateLong(dailyBriefing.date)}
            </Badge>
            <SegmentedToggle
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "daily", label: "Daily" },
              ]}
              value={view}
              onChange={(value) => setView(value as ReportView)}
            />
            <ExportButton />
          </>
        }
      />

      {view === "monthly" ? <MonthlyReport /> : <MorningBriefing />}
    </div>
  );
}
