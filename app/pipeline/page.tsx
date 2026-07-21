"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, ArrowsClockwise, Snowflake } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { CountUp } from "@/components/ui/CountUp";
import { BarList } from "@/components/ui/BarList";
import { ActivityLog } from "@/components/ui/ActivityLog";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  quotes as seedQuotes,
  reps,
  automationEvents,
  formatEuroShort,
  type Quote,
  type LossReason,
  type RepPerformance,
} from "@/lib/mockData";
import { QuoteCard } from "@/components/pipeline/QuoteCard";
import { RepDiscipline } from "@/components/pipeline/RepDiscipline";

const LOSS_ORDER: LossReason[] = [
  "Price",
  "Timing",
  "Went elsewhere",
  "No response",
  "Other",
];

type ColumnKey = "open" | "follow" | "cold" | "won" | "lost";

const COLUMN_META: { key: ColumnKey; title: string; empty: string }[] = [
  { key: "open", title: "Open", empty: "No fresh quotes" },
  { key: "follow", title: "Needs follow-up", empty: "Nothing waiting to be chased" },
  { key: "cold", title: "Cold", empty: "Nothing gone cold" },
  { key: "won", title: "Won", empty: "None won yet" },
  { key: "lost", title: "Lost", empty: "None marked lost" },
];

export default function PipelinePage() {
  const [quotes, setQuotes] = useState<Quote[]>(() => seedQuotes.map((q) => ({ ...q })));

  /** Logging a follow-up resets the clock. A cold quote comes back to Open. */
  const logFollowUp = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              daysSinceContact: 0,
              followedUp: true,
              status: q.status === "cold" ? "open" : q.status,
            }
          : q
      )
    );
  };

  const markLost = (id: string, reason: LossReason) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "lost", lossReason: reason } : q
      )
    );
  };

  const columns = useMemo(() => {
    const open = quotes.filter((q) => q.status === "open" && q.daysSinceContact < 3);
    const follow = quotes.filter((q) => q.status === "open" && q.daysSinceContact >= 3);
    const cold = quotes
      .filter((q) => q.status === "cold")
      .sort((a, b) => b.value - a.value);
    const won = quotes.filter((q) => q.status === "won");
    const lost = quotes.filter((q) => q.status === "lost");
    return { open, follow, cold, won, lost };
  }, [quotes]);

  const stats = useMemo(() => {
    const openValue = quotes
      .filter((q) => q.status === "open" || q.status === "cold")
      .reduce((s, q) => s + q.value, 0);

    const chaseable = quotes.filter((q) => q.status !== "won");
    const chased = chaseable.filter((q) => q.followedUp).length;
    const followUpRate = chaseable.length
      ? Math.round((chased / chaseable.length) * 100)
      : 0;

    const goneCold = quotes.filter((q) => q.status === "cold").length;
    return { openValue, followUpRate, goneCold };
  }, [quotes]);

  const lossReasons = useMemo(() => {
    const counts = new Map<LossReason, number>(LOSS_ORDER.map((r) => [r, 0]));
    for (const q of quotes) {
      if (q.status === "lost" && q.lossReason) {
        counts.set(q.lossReason, (counts.get(q.lossReason) ?? 0) + 1);
      }
    }
    return LOSS_ORDER.map((reason) => ({
      label: reason,
      value: counts.get(reason) ?? 0,
    })).filter((r) => r.value > 0);
  }, [quotes]);

  const repRows: RepPerformance[] = useMemo(
    () =>
      reps.map((rep) => {
        const mine = quotes.filter((q) => q.repId === rep.id);
        const sent = mine.length;
        const followedUp = mine.filter((q) => q.followedUp).length;
        const won = mine.filter((q) => q.status === "won").length;
        return {
          repId: rep.id,
          name: rep.name,
          role: rep.role,
          initials: rep.initials,
          sent,
          followedUp,
          won,
          followUpRate: sent ? Math.round((followedUp / sent) * 100) : 0,
        };
      }),
    [quotes]
  );

  const columnData: Record<ColumnKey, Quote[]> = {
    open: columns.open,
    follow: columns.follow,
    cold: columns.cold,
    won: columns.won,
    lost: columns.lost,
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Quote Pipeline"
        subtitle="Every quote, and every one going cold. This is the money that used to leak away unseen."
      />

      {/* Top stats */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Coins}
            label="Total open quote value"
            value={<CountUp value={stats.openValue} format={formatEuroShort} />}
            valueTone="accent"
            hint="Open and cold quotes still live"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={ArrowsClockwise}
            label="Follow-up rate"
            value={
              <CountUp
                value={stats.followUpRate}
                format={(n) => `${Math.round(n)}%`}
              />
            }
            hint="Quotes chased at least once"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Snowflake}
            label="Quotes gone cold"
            value={<CountUp value={stats.goneCold} />}
            valueTone="danger"
            hint="Seven days or more, never chased"
          />
        </motion.div>
      </motion.div>

      {/* Board */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="flex gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0"
      >
        {COLUMN_META.map((col) => {
          const list = columnData[col.key];
          const sum = list.reduce((s, q) => s + q.value, 0);
          return (
            <motion.div
              key={col.key}
              variants={fadeUp}
              transition={{ duration: 0.35, ease }}
              className="flex min-w-[280px] flex-col gap-3 xl:min-w-0"
            >
              <div className="flex items-baseline justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[13.5px] font-semibold text-ink">
                    {col.title}
                  </h2>
                  <span className="rounded-full bg-border-soft px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-ink-muted">
                    {list.length}
                  </span>
                </div>
                <span className="text-[11.5px] tabular-nums text-ink-faint">
                  {formatEuroShort(sum)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {list.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-[12px] text-ink-faint">
                    {col.empty}
                  </div>
                ) : (
                  list.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      onLogFollowUp={logFollowUp}
                      onMarkLost={markLost}
                    />
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer strip */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-[14.5px] font-semibold text-ink">
              Loss reasons this month
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              Where the quotes we lost actually went.
            </p>
          </div>
          {lossReasons.length > 0 ? (
            <BarList items={lossReasons} tone="accent" />
          ) : (
            <p className="text-[12.5px] text-ink-muted">
              Nothing marked lost yet this month.
            </p>
          )}
        </Card>

        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-[14.5px] font-semibold text-ink">
              Follow-up discipline by rep
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              Quotes sent against quotes actually chased.
            </p>
          </div>
          <RepDiscipline rows={repRows} />
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">
            Automation activity
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            Follow-ups the system queued on its own, so nothing sits forgotten.
          </p>
        </div>
        <ActivityLog
          items={automationEvents.map((event) => ({
            id: event.id,
            title: `${event.customerName} · ${event.trigger}`,
            meta: event.action,
            tone: event.action.toLowerCase().includes("escalation")
              ? "danger"
              : "warning",
          }))}
        />
      </Card>
    </div>
  );
}
