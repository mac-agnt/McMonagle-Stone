"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MagnifyingGlass, X, Info } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusDot } from "@/components/ui/StatusDot";
import { OrderRow } from "@/components/orders/OrderRow";
import { OrderDrawer } from "@/components/orders/OrderDrawer";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  orders,
  getCustomer,
  isDelivered,
  getOrder,
  type Order,
  type OrderSource,
} from "@/lib/mockData";

type StageFilter =
  | "All"
  | "In Production"
  | "At Port"
  | "Ready at Depot"
  | "Dispatched";
type SourceFilter = "All" | OrderSource;

const STAGE_FILTERS: StageFilter[] = [
  "All",
  "In Production",
  "At Port",
  "Ready at Depot",
  "Dispatched",
];

const SOURCE_FILTERS: { value: SourceFilter; label: string }[] = [
  { value: "All", label: "All sources" },
  { value: "own-quarry", label: "Own quarry" },
  { value: "import", label: "Import" },
];

/** Non-delivered first, then problems (late, at-risk) surfaced above on-time. */
const statusRank: Record<Order["status"], number> = {
  late: 0,
  "at-risk": 1,
  "on-time": 2,
};

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersRoute />
    </Suspense>
  );
}

/**
 * `?order=MS-4419` opens that order's drawer, `?q=Chadwicks` prefills the
 * filter. Both are how ⌘K, the Home rail and the assistant jump to a record.
 * Keying on the params remounts the view when a new record is linked, so the
 * deep link lands even when we are already sitting on this page.
 */
function OrdersRoute() {
  const params = useSearchParams();
  return (
    <OrdersView
      key={params.toString()}
      initialOrder={params.get("order")}
      initialQuery={params.get("q") ?? ""}
    />
  );
}

function OrdersView({
  initialOrder,
  initialQuery,
}: {
  initialOrder: string | null;
  initialQuery: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [stage, setStage] = useState<StageFilter>("All");
  const [source, setSource] = useState<SourceFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(initialOrder);

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      const deliveredDiff = Number(isDelivered(a)) - Number(isDelivered(b));
      if (deliveredDiff !== 0) return deliveredDiff;
      return statusRank[a.status] - statusRank[b.status];
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((o) => {
      if (stage !== "All" && o.stage !== stage) return false;
      if (source !== "All" && o.source !== source) return false;
      if (q) {
        const name = getCustomer(o.customerId)?.name.toLowerCase() ?? "";
        if (!name.includes(q) && !o.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [sorted, search, stage, source]);

  const liveCount = filtered.filter((o) => !isDelivered(o)).length;
  const selectedOrder: Order | null = selectedId
    ? getOrder(selectedId) ?? null
    : null;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Live Order Tracker"
        subtitle="Every order, every stage, one place. Own-quarry stock used to be a black box, now it is tracked end to end."
        live
        right={
          <div className="flex items-center gap-3">
            <StatusDot status="on-time" showLabel />
            <StatusDot status="at-risk" showLabel />
            <StatusDot status="late" showLabel />
          </div>
        }
      />

      {/* Filter bar */}
      <Card className="sticky top-4 z-20 p-4">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-[10px] border border-border bg-surface-raised px-3 py-2 transition-colors focus-within:border-accent/40">
            <MagnifyingGlass size={16} className="shrink-0 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or order number"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-ink-faint hover:bg-border-soft hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ChipGroup label="Stage">
              {STAGE_FILTERS.map((s) => (
                <Chip
                  key={s}
                  active={stage === s}
                  onClick={() => setStage(s)}
                >
                  {s}
                </Chip>
              ))}
            </ChipGroup>

            <ChipGroup label="Source">
              {SOURCE_FILTERS.map((s) => (
                <Chip
                  key={s.value}
                  active={source === s.value}
                  onClick={() => setSource(s.value)}
                >
                  {s.label}
                </Chip>
              ))}
            </ChipGroup>

            <span className="ml-auto text-[12.5px] font-medium tabular-nums text-ink-muted">
              {liveCount} live {liveCount === 1 ? "order" : "orders"}
            </span>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-faint">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>
              Own-quarry stock used to have the thinnest paper trail. Imports had
              a shipping trail, quarry stock had a phone call. Every order here is
              now tracked the same way, stage by stage.
            </p>
          </div>
        </div>
      </Card>

      {/* Order list */}
      <Card className="p-0">
        {/* Column header (desktop) */}
        <div className="hidden items-center gap-4 border-b border-border-soft px-5 py-2.5 text-[11px] uppercase tracking-wide text-ink-faint sm:flex">
          <span className="w-[150px] shrink-0 md:w-[190px]">Customer</span>
          <span className="hidden w-24 shrink-0 text-right lg:block">
            Value
          </span>
          <span className="min-w-0 flex-1">Stage</span>
          <span className="w-16 shrink-0 text-right">ETA</span>
          <span className="w-[52px] shrink-0 text-right">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-border-soft text-ink-faint">
              <MagnifyingGlass size={19} />
            </span>
            <p className="mt-3 text-[14px] font-medium text-ink">
              No orders match
            </p>
            <p className="mt-1 max-w-xs text-[12.5px] text-ink-muted">
              Try a different customer name, order number, or clear the filters.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.04)}
            initial="hidden"
            animate="show"
            className="divide-y divide-border-soft"
          >
            {filtered.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onSelect={setSelectedId}
              />
            ))}
          </motion.div>
        )}
      </Card>

      <OrderDrawer
        order={selectedOrder}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

function ChipGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-accent-soft text-accent-strong"
          : "text-ink-muted hover:bg-border-soft hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
