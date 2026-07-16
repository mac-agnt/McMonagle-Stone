"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { fadeUp, ease } from "@/lib/motion";
import { formatEuro, formatEuroShort } from "@/lib/mockData";

export type RepClass = "Closer" | "Building" | "Order-taker";

export type RepRow = {
  repId: string;
  name: string;
  role: string;
  initials: string;
  sent: number;
  followedUp: number;
  won: number;
  followUpRate: number;
  wonValue: number;
  openOrders: number;
  openValue: number;
  klass: RepClass;
};

const classMeta: Record<
  RepClass,
  { tone: "accent" | "warning" | "neutral"; note: string }
> = {
  Closer: { tone: "accent", note: "Sends quotes and chases them down." },
  Building: { tone: "neutral", note: "Chasing some, room to tighten up." },
  "Order-taker": {
    tone: "warning",
    note: "Takes the order, rarely chases the quote.",
  },
};

/** One rich roster card per person: activity, follow-up discipline, output. */
export function RepCard({ rep }: { rep: RepRow }) {
  const meta = classMeta[rep.klass];
  const barTone = rep.followUpRate < 30 ? "warning" : "accent";

  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
      <Card className="flex h-full flex-col gap-5">
        {/* Identity */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar initials={rep.initials} size={46} />
            <div>
              <p className="text-[15px] font-semibold text-ink">{rep.name}</p>
              <p className="text-[12px] text-ink-faint">{rep.role}</p>
            </div>
          </div>
          <Badge tone={meta.tone}>{rep.klass}</Badge>
        </div>

        {/* Sent / Chased / Won */}
        <div className="grid grid-cols-3 gap-3 border-t border-border-soft pt-4">
          <Figure label="Sent" value={rep.sent} />
          <Figure label="Chased" value={rep.followedUp} />
          <Figure label="Won" value={rep.won} />
        </div>

        {/* Follow-up discipline */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-ink-muted">Follow-up rate</span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {rep.followUpRate}%
            </span>
          </div>
          <ProgressBar value={rep.followUpRate} tone={barTone} className="mt-2" />
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
            {meta.note}
          </p>
        </div>

        {/* Output */}
        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border-soft pt-4">
          <div>
            <p className="text-[16px] font-semibold tabular-nums text-accent">
              {formatEuro(rep.wonValue)}
            </p>
            <p className="mt-0.5 text-[11.5px] text-ink-faint">Won this month</p>
          </div>
          <div>
            <p className="text-[16px] font-semibold tabular-nums text-ink">
              {rep.openOrders}
            </p>
            <p className="mt-0.5 text-[11.5px] text-ink-faint">
              Open orders, {formatEuroShort(rep.openValue)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-semibold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-faint">{label}</p>
    </div>
  );
}
