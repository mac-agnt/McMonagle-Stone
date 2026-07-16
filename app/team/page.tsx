"use client";

import { motion } from "framer-motion";
import { ArrowsClockwise, Trophy, Stack, Target } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { BarList } from "@/components/ui/BarList";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  repPerformance,
  quotes,
  orders,
  openOrders,
  openOrderValue,
  isDelivered,
  formatEuroShort,
} from "@/lib/mockData";
import { RepCard, type RepRow, type RepClass } from "@/components/team/RepCard";

function classify(rate: number): RepClass {
  if (rate >= 60) return "Closer";
  if (rate < 30) return "Order-taker";
  return "Building";
}

/** Per-rep view built from the same quotes and orders the other pages use. */
const repRows: RepRow[] = repPerformance.map((r) => {
  const wonValue = quotes
    .filter((q) => q.repId === r.repId && q.status === "won")
    .reduce((s, q) => s + q.value, 0);
  const mineOpen = orders.filter((o) => o.repId === r.repId && !isDelivered(o));
  return {
    ...r,
    wonValue,
    openOrders: mineOpen.length,
    openValue: mineOpen.reduce((s, o) => s + o.value, 0),
    klass: classify(r.followUpRate),
  };
});

const totalSent = repRows.reduce((s, r) => s + r.sent, 0);
const totalChased = repRows.reduce((s, r) => s + r.followedUp, 0);
const teamFollowUpRate = totalSent
  ? Math.round((totalChased / totalSent) * 100)
  : 0;

const wonQuotes = quotes.filter((q) => q.status === "won");
const wonValueTotal = wonQuotes.reduce((s, q) => s + q.value, 0);

const sharpest = repRows.reduce((best, r) =>
  r.followUpRate > best.followUpRate ? r : best
);

const disciplineItems = repRows.map((r) => ({
  label: r.name,
  value: r.followUpRate,
  display: `${r.followUpRate}%`,
}));

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Team"
        subtitle="Who is quoting, who is chasing, who is closing. The same four people, told honestly."
      />

      {/* Team summary */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={ArrowsClockwise}
            label="Team follow-up rate"
            value={`${teamFollowUpRate}%`}
            hint="Across every quote the team has sent"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Trophy}
            label="Quotes won this month"
            value={wonQuotes.length}
            valueTone="accent"
            hint={`${formatEuroShort(wonValueTotal)} closed across the team`}
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Stack}
            label="Open orders on the team"
            value={openOrders.length}
            hint={`${formatEuroShort(openOrderValue)} in flight`}
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Target}
            label="Sharpest follow-up"
            value={sharpest.name}
            valueTone="accent"
            hint={`${sharpest.followUpRate}% of quotes chased`}
          />
        </motion.div>
      </motion.div>

      {/* Roster */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {repRows.map((rep) => (
          <RepCard key={rep.repId} rep={rep} />
        ))}
      </motion.div>

      {/* Follow-up discipline comparison */}
      <Card className="flex flex-col gap-4">
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">
            Follow-up discipline
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            How often each person chases the quotes they send.
          </p>
        </div>
        <BarList items={disciplineItems} tone="accent" />
      </Card>
    </div>
  );
}
