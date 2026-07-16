"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Boat, Stack, Timer, Warning } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import {
  orders,
  getCustomer,
  getProduct,
  formatTonnes,
  formatDate,
  type Order,
  type OrderStage,
} from "@/lib/mockData";
import { PortSection } from "@/components/arrivals/PortSection";
import { RecentlyLanded } from "@/components/arrivals/RecentlyLanded";
import { ArrivalsMap } from "@/components/arrivals/ArrivalsMap";

/** Stages where the container is still on its way in. */
const INBOUND_STAGES: ReadonlySet<OrderStage> = new Set<OrderStage>([
  "Quoted",
  "Confirmed",
  "On Import Order",
  "At Port",
]);

/** Ports listed in a fixed order so the board never reshuffles. */
const PORT_ORDER = ["Dublin Port", "Cork (Ringaskiddy)"] as const;

const isInbound = (o: Order) => INBOUND_STAGES.has(o.stage);
const portOf = (o: Order) => getProduct(o.productId)?.port ?? "Other";

export default function ArrivalsPage() {
  const { inbound, arrived, portGroups, stats } = useMemo(() => {
    const importOrders = orders.filter((o) => o.source === "import");

    const inbound = importOrders
      .filter(isInbound)
      .sort((a, b) => a.eta.localeCompare(b.eta));

    const arrived = importOrders
      .filter((o) => !isInbound(o))
      .sort((a, b) => a.eta.localeCompare(b.eta));

    const portGroups = PORT_ORDER.map((port) => ({
      port,
      orders: inbound.filter((o) => portOf(o) === port),
    })).filter((g) => g.orders.length > 0);

    const tonnesInbound = inbound.reduce((s, o) => s + o.tonnage, 0);
    const held = importOrders.filter(
      (o) => o.status === "at-risk" || o.status === "late"
    ).length;
    const next = inbound[0];

    return {
      inbound,
      arrived,
      portGroups,
      stats: { tonnesInbound, held, next },
    };
  }, []);

  const nextCustomer = stats.next
    ? getCustomer(stats.next.customerId)?.name
    : undefined;
  const nextProduct = stats.next
    ? getProduct(stats.next.productId)?.name
    : undefined;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Arrivals"
        subtitle="Every import container, from the sailing to the depot gate."
        live
      />

      {/* Summary stats */}
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Boat}
            label="Shipments inbound"
            value={inbound.length}
            hint="Sailing, booked, or waiting at port"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Stack}
            label="Tonnes inbound"
            value={formatTonnes(stats.tonnesInbound)}
            valueTone="accent"
            hint="Still at sea or at the quayside"
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Timer}
            label="Next arrival"
            value={stats.next ? formatDate(stats.next.eta) : "None due"}
            hint={
              nextCustomer && nextProduct
                ? `${nextCustomer}, ${nextProduct}`
                : "Nothing on the water"
            }
          />
        </motion.div>
        <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
          <StatCard
            icon={Warning}
            label="Held or slipping"
            value={stats.held}
            valueTone={stats.held > 0 ? "danger" : "ink"}
            hint="Imports at risk or already late"
          />
        </motion.div>
      </motion.div>

      {/* Ports and depots map */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.35, ease }}
      >
        <ArrivalsMap />
      </motion.div>

      {/* Port board */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        {portGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-5 py-16 text-center">
            <p className="text-[14px] font-medium text-ink">Nothing inbound</p>
            <p className="mt-1 text-[12.5px] text-ink-muted">
              No import containers are on the water right now.
            </p>
          </div>
        ) : (
          portGroups.map((group) => (
            <PortSection
              key={group.port}
              port={group.port}
              orders={group.orders}
            />
          ))
        )}
      </motion.div>

      {/* Recently landed */}
      <RecentlyLanded orders={arrived} />
    </div>
  );
}
