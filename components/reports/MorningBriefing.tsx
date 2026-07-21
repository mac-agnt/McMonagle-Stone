"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { fadeUp, ease } from "@/lib/motion";
import {
  dailyBriefing,
  getDepot,
  formatEuro,
  formatEuroShort,
  formatTonnes,
  formatDateLong,
} from "@/lib/mockData";
import type { RowTone } from "@/lib/assistant";

const toneRule: Record<RowTone, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  accent: "bg-accent",
  neutral: "bg-border",
};

const toneText: Record<RowTone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  accent: "text-accent-strong",
  neutral: "text-ink",
};

/** One tight data line: colour rule, label/meta, right-aligned value. */
function DataRow({
  tone,
  label,
  meta,
  value,
}: {
  tone: RowTone;
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className={cn("h-7 w-[2px] shrink-0 rounded-full", toneRule[tone])} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-ink">{label}</p>
        <p className="truncate text-[11.5px] text-ink-faint">{meta}</p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[12.5px] font-semibold tabular-nums",
          toneText[tone]
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 pt-4 text-[13.5px] leading-relaxed text-ink">{children}</p>
  );
}

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col px-5 pb-4">{children}</div>;
}

/**
 * The 6:00 read: a memo, not a dashboard. Short paragraphs in plain prose,
 * each carrying its own tight data lines rather than a grid of stat cards.
 */
export function MorningBriefing() {
  const {
    stockAlerts,
    atSea,
    invoicesOwedTotal,
    invoicesOwedCount,
    topRisk,
    tonnesToday,
    tonnesTarget,
    openOrderValue,
    quotesAwaitingFollowUp,
    avgYieldPct,
  } = dailyBriefing;

  const pctOfTarget = Math.round((tonnesToday / tonnesTarget) * 100);
  const kilkenny = stockAlerts.find((r) => r.productId === "p-kilkenny");
  const liscannor = stockAlerts.find((r) => r.productId === "p-liscannor");
  const otherAlerts = stockAlerts.filter(
    (r) => r.productId !== "p-kilkenny" && r.productId !== "p-liscannor"
  );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      transition={{ duration: 0.35, ease }}
      className="mx-auto flex max-w-2xl flex-col gap-4"
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          6:00 briefing
        </p>
        <h2 className="mt-1 text-[20px] font-light tracking-tight text-ink">
          {formatDateLong(dailyBriefing.date)}
        </h2>
      </div>

      <Card className="flex flex-col divide-y divide-border-soft p-0">
        <div className="flex flex-col">
          <Paragraph>
            {formatTonnes(tonnesToday)} are out the gate so far today, {pctOfTarget}{" "}
            percent of target with the day still running. Yield across this
            month&apos;s production loads is holding at {avgYieldPct} percent,
            level with where it has sat since June.
          </Paragraph>
          <Rows>
            <DataRow
              tone="accent"
              label="Tonnes out today"
              meta={`Against a ${formatTonnes(tonnesTarget)} target`}
              value={formatTonnes(tonnesToday)}
            />
            <DataRow
              tone="neutral"
              label="Average yield"
              meta="This month's production loads"
              value={`${avgYieldPct}%`}
            />
          </Rows>
        </div>

        <div className="flex flex-col">
          <Paragraph>
            Three lines are sitting under their reorder point. Kilkenny Blue
            and Liscannor flagstone have both drifted low at the Donegal
            depot, and {otherAlerts[0]?.product.name} is short at{" "}
            {getDepot(otherAlerts[0]?.depotId ?? "")?.name} as well. None of
            the three can wait past this week.
          </Paragraph>
          <Rows>
            {kilkenny && (
              <DataRow
                tone="danger"
                label={kilkenny.product.name}
                meta={`Donegal depot, reorder point ${formatTonnes(kilkenny.reorderPoint)}`}
                value={formatTonnes(kilkenny.onHand)}
              />
            )}
            {liscannor && (
              <DataRow
                tone="danger"
                label={liscannor.product.name}
                meta={`Donegal depot, reorder point ${formatTonnes(liscannor.reorderPoint)}`}
                value={formatTonnes(liscannor.onHand)}
              />
            )}
            {otherAlerts[0] && (
              <DataRow
                tone="danger"
                label={otherAlerts[0].product.name}
                meta={`${getDepot(otherAlerts[0].depotId)?.name} depot, reorder point ${formatTonnes(otherAlerts[0].reorderPoint)}`}
                value={formatTonnes(otherAlerts[0].onHand)}
              />
            )}
          </Rows>
        </div>

        <div className="flex flex-col">
          <Paragraph>
            {atSea.count} import orders are currently at sea, carrying{" "}
            {formatTonnes(atSea.tonnes)} between them, so there is no quick
            top-up on the stock above until they land. On the money side,{" "}
            {invoicesOwedCount} accounts are running late on payment,{" "}
            {formatEuro(invoicesOwedTotal)} outstanding between them.
          </Paragraph>
          <Rows>
            <DataRow
              tone="neutral"
              label="Import stone at sea"
              meta={`${atSea.count} orders in transit`}
              value={formatTonnes(atSea.tonnes)}
            />
            <DataRow
              tone="danger"
              label="Invoices owed"
              meta={`${invoicesOwedCount} accounts overdue`}
              value={formatEuro(invoicesOwedTotal)}
            />
          </Rows>
        </div>

        <div className="flex flex-col">
          <Paragraph>
            The bigger worry sits with {topRisk.name.toLowerCase()}. {topRisk.note}{" "}
            None of that changes the order book:{" "}
            {formatEuroShort(openOrderValue)} is quoted and confirmed but not
            yet delivered, and {quotesAwaitingFollowUp} quotes are sitting
            without a follow-up call. Get to those before lunch.
          </Paragraph>
          <Rows>
            <DataRow
              tone="warning"
              label={topRisk.name}
              meta={topRisk.category}
              value={`${topRisk.severity}/100`}
            />
            <DataRow
              tone="neutral"
              label="Open order book"
              meta="Quoted and confirmed, awaiting delivery"
              value={formatEuroShort(openOrderValue)}
            />
            <DataRow
              tone="neutral"
              label="Quotes awaiting follow-up"
              meta="Sent, no reply logged"
              value={`${quotesAwaitingFollowUp}`}
            />
          </Rows>
        </div>
      </Card>
    </motion.div>
  );
}
