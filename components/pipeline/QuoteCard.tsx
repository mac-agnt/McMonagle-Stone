"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { fadeUp, ease } from "@/lib/motion";
import {
  getCustomer,
  getProduct,
  getRep,
  formatEuro,
  type Quote,
  type LossReason,
} from "@/lib/mockData";
import { MarkLostMenu } from "./MarkLostMenu";

type Nudge = { tone: "warning" | "danger"; label: string } | null;

function nudgeFor(quote: Quote): Nudge {
  if (quote.status !== "open" && quote.status !== "cold") return null;
  if (quote.daysSinceContact >= 7) return { tone: "danger", label: "Going cold" };
  if (quote.daysSinceContact >= 3) return { tone: "warning", label: "Follow up" };
  return null;
}

/** One quote as a board card: who, what, how much, who owns it, and the nudge. */
export function QuoteCard({
  quote,
  onLogFollowUp,
  onMarkLost,
}: {
  quote: Quote;
  onLogFollowUp: (id: string) => void;
  onMarkLost: (id: string, reason: LossReason) => void;
}) {
  const customer = getCustomer(quote.customerId);
  const product = getProduct(quote.productId);
  const rep = getRep(quote.repId);
  const closed = quote.status === "won" || quote.status === "lost";
  const nudge = nudgeFor(quote);

  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }}>
      <Card className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13.5px] font-medium leading-snug text-ink">
            {customer?.name ?? "Unknown customer"}
          </p>
          <p className="shrink-0 text-[14px] font-semibold tabular-nums text-accent">
            {formatEuro(quote.value)}
          </p>
        </div>

        <p className="text-[12px] text-ink-faint">
          {product?.name ?? "Unlisted product"}
        </p>

        <div className="flex items-center gap-2">
          <Avatar initials={rep?.initials ?? "?"} size={22} />
          <span className="text-[12px] text-ink-muted">
            {rep?.name ?? "Unassigned"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11.5px] tabular-nums text-ink-faint">
            {quote.daysSinceContact} {quote.daysSinceContact === 1 ? "day" : "days"} since contact
          </span>
          {nudge && <Badge tone={nudge.tone}>{nudge.label}</Badge>}
        </div>

        {closed ? (
          <div className="flex items-center gap-2 pt-0.5">
            <Badge tone={quote.status === "won" ? "success" : "danger"}>
              {quote.status === "won" ? "Won" : "Lost"}
            </Badge>
            {quote.status === "lost" && quote.lossReason && (
              <span className="text-[11.5px] text-ink-faint">
                {quote.lossReason}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onLogFollowUp(quote.id)}
            >
              Log follow-up
            </Button>
            <MarkLostMenu onSelect={(reason) => onMarkLost(quote.id, reason)} />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
