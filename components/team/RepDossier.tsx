"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CaretLeft } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { StageProgress } from "@/components/ui/StageProgress";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  getCustomer,
  getProduct,
  stagesForSource,
  stageIndex,
  formatEuro,
  formatEuroShort,
  type Quote,
  type QuoteStatus,
  type Order,
} from "@/lib/mockData";
import type { RepClass } from "@/components/team/RepCard";
import type { getRepDetail } from "@/lib/mockData";

type RepDetail = NonNullable<ReturnType<typeof getRepDetail>>;

const classMeta: Record<RepClass, { tone: "accent" | "warning" | "neutral"; note: string }> = {
  Closer: { tone: "accent", note: "Sends quotes and chases them down." },
  Building: { tone: "neutral", note: "Chasing some, room to tighten up." },
  "Order-taker": {
    tone: "warning",
    note: "Takes the order, rarely chases the quote.",
  },
};

function classify(rate: number): RepClass {
  if (rate >= 60) return "Closer";
  if (rate < 30) return "Order-taker";
  return "Building";
}

const quoteStatusTone: Record<QuoteStatus, "accent" | "warning" | "success" | "danger"> = {
  open: "accent",
  cold: "warning",
  won: "success",
  lost: "danger",
};

const quoteStatusLabel: Record<QuoteStatus, string> = {
  open: "Open",
  cold: "Cold",
  won: "Won",
  lost: "Lost",
};

export function RepDossier({ detail }: { detail: RepDetail }) {
  const { rep, quotes, openOrders, wonValue, openValue, followUpRate, trend } = detail;
  const klass = classify(followUpRate);
  const meta = classMeta[klass];

  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 pb-24"
    >
      {/* Back affordance */}
      <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition-colors hover:text-ink"
        >
          <CaretLeft size={14} weight="bold" />
          Back to Team
        </Link>
      </motion.div>

      {/* Profile hero */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.35, ease }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Avatar initials={rep.initials} size={64} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-light tracking-tight text-ink sm:text-[27px]">
                {rep.name}
              </h1>
              <Badge tone={meta.tone}>{klass}</Badge>
            </div>
            <p className="mt-1 text-[13.5px] text-ink-muted">{rep.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.35, ease }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <Card className="flex flex-col gap-1">
          <p className="text-[12px] text-ink-faint">Won this month</p>
          <p className="text-[19px] font-semibold tabular-nums text-accent">
            {formatEuro(wonValue)}
          </p>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-[12px] text-ink-faint">Open orders</p>
          <p className="text-[19px] font-semibold tabular-nums text-ink">
            {openOrders.length}
            <span className="ml-1.5 text-[13px] font-normal text-ink-faint">
              {formatEuroShort(openValue)}
            </span>
          </p>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-[12px] text-ink-faint">Follow-up rate</p>
          <p className="text-[19px] font-semibold tabular-nums text-ink">
            {followUpRate}%
          </p>
        </Card>
      </motion.div>

      {/* Sparkline */}
      <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
        <Card className="flex flex-col gap-3">
          <p className="text-[12px] text-ink-faint">
            Follow-up trend, last 8 weeks
          </p>
          <Sparkline data={trend} />
        </Card>
      </motion.div>

      {/* Quotes */}
      <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-[14.5px] font-semibold text-ink">Quotes</h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              Every quote {rep.name} has sent.
            </p>
          </div>
          {quotes.length ? (
            <motion.div
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="show"
              className="flex flex-col divide-y divide-border-soft"
            >
              {quotes.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} />
              ))}
            </motion.div>
          ) : (
            <p className="text-[13px] text-ink-faint">No quotes on record.</p>
          )}
        </Card>
      </motion.div>

      {/* Open orders */}
      <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-[14.5px] font-semibold text-ink">
              Open orders
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              In flight, from confirmed to dispatched.
            </p>
          </div>
          {openOrders.length ? (
            <motion.div
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-5"
            >
              {openOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </motion.div>
          ) : (
            <p className="text-[13px] text-ink-faint">No open orders.</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

function QuoteRow({ quote }: { quote: Quote }) {
  const customer = getCustomer(quote.customerId);
  const product = getProduct(quote.productId);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.3, ease }}
      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
    >
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-ink">
          {customer?.name ?? "Unknown customer"}
        </p>
        <p className="truncate text-[12px] text-ink-faint">
          {product?.name ?? "Unlisted product"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-[12px] tabular-nums text-ink-faint">
          {quote.daysSinceContact} {quote.daysSinceContact === 1 ? "day" : "days"}
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-ink">
          {formatEuro(quote.value)}
        </span>
        <Badge tone={quoteStatusTone[quote.status]}>
          {quoteStatusLabel[quote.status]}
        </Badge>
      </div>
    </motion.div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  const stages = stagesForSource(order.source);
  const currentIndex = stageIndex(order);

  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }} className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-[13px] font-medium text-ink">
          {customer?.name ?? "Unknown customer"}
        </p>
        <p className="shrink-0 text-[12px] text-ink-faint">
          {product?.name ?? "Unlisted product"}
        </p>
      </div>
      <StageProgress stages={stages} currentIndex={currentIndex} showLabel />
    </motion.div>
  );
}
