"use client";

import { useMemo } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/mapcn-marker-content";
import { Card } from "@/components/ui/Card";
import { LiveDot } from "@/components/ui/LiveDot";
import { useTheme } from "@/components/ThemeProvider";
import {
  orders,
  getProduct,
  getDepot,
  getCustomer,
  formatTonnes,
  formatDate,
  type OrderStage,
} from "@/lib/mockData";
import { isVesselStage, getVesselPosition, type LngLat } from "./vessel";

/** Import ports (the two arrival gateways) with real coordinates. */
const PORTS: { name: string; lng: number; lat: number }[] = [
  { name: "Dublin Port", lng: -6.2076, lat: 53.3486 },
  { name: "Cork (Ringaskiddy)", lng: -8.3158, lat: 51.8331 },
];

/** The four depots the stone runs on to after it lands. */
const DEPOTS: { name: string; lng: number; lat: number }[] = [
  { name: "Donegal", lng: -8.1096, lat: 54.654 },
  { name: "Dublin", lng: -6.2603, lat: 53.3498 },
  { name: "Cork", lng: -8.4756, lat: 51.8979 },
  { name: "Galway", lng: -9.0568, lat: 53.2707 },
];

const INBOUND_STAGES: ReadonlySet<OrderStage> = new Set<OrderStage>([
  "Quoted",
  "Confirmed",
  "On Import Order",
  "At Port",
]);

export function ArrivalsMap() {
  const { theme } = useTheme();

  const portStats = useMemo(() => {
    const stats: Record<string, { count: number; tonnes: number }> = {};
    for (const p of PORTS) stats[p.name] = { count: 0, tonnes: 0 };
    for (const o of orders) {
      if (o.source !== "import") continue;
      if (!INBOUND_STAGES.has(o.stage)) continue;
      const port = getProduct(o.productId)?.port;
      if (!port || !stats[port]) continue;
      stats[port].count += 1;
      stats[port].tonnes += o.tonnage;
    }
    return stats;
  }, []);

  const vessels = useMemo(() => {
    // Note: local var names avoid shadowing the `Map` component imported above.
    const list: {
      id: string;
      pos: LngLat;
      customerName: string;
      eta: string;
    }[] = [];

    for (const o of orders) {
      if (o.source !== "import" || !isVesselStage(o.stage)) continue;

      const portName = getProduct(o.productId)?.port;
      const depotName = getDepot(o.depotId)?.name;
      const port = PORTS.find((p) => p.name === portName);
      const depot = DEPOTS.find((d) => d.name === depotName);
      if (!port || !depot) continue;

      const pos = getVesselPosition(o, port, depot);
      if (!pos) continue;

      list.push({
        id: o.id,
        pos,
        customerName: getCustomer(o.customerId)?.name ?? "Unknown customer",
        eta: formatDate(o.eta),
      });
    }

    return list;
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">Where it lands</h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            Import ports and the depots the stone runs on to.
          </p>
        </div>
        <LiveDot />
      </div>

      <div className="relative h-[380px] w-full border-t border-border-soft sm:h-[440px]">
        <Map
          theme={theme}
          center={[-8.0, 53.4]}
          zoom={5.35}
          scrollZoom={false}
          dragRotate={false}
          pitchWithRotate={false}
          touchZoomRotate={false}
        >
          {/* Depots first so the accent ports render on top of them */}
          {DEPOTS.map((d) => (
            <MapMarker key={`depot-${d.name}`} longitude={d.lng} latitude={d.lat}>
              <MarkerContent>
                <span className="block size-2.5 rounded-full bg-ink-faint shadow-[0_1px_3px_rgba(0,0,0,0.5)] ring-2 ring-bg transition-shadow hover:ring-ink-faint/40" />
              </MarkerContent>
              <MarkerTooltip>
                <TooltipCard title={`${d.name} depot`} sub="Destination yard" />
              </MarkerTooltip>
            </MapMarker>
          ))}

          {PORTS.map((p) => {
            const stat = portStats[p.name];
            const active = (stat?.count ?? 0) > 0;
            return (
              <MapMarker key={`port-${p.name}`} longitude={p.lng} latitude={p.lat}>
                <MarkerContent>
                  <span className="relative flex items-center justify-center">
                    {active && (
                      <span className="absolute inline-flex size-6 rounded-full bg-accent/25 animate-pulse-dot" />
                    )}
                    <span className="relative inline-flex size-3.5 rounded-full bg-accent shadow-[0_2px_8px_rgba(0,0,0,0.5)] ring-2 ring-bg transition-shadow hover:ring-4 hover:ring-accent/25" />
                  </span>
                </MarkerContent>
                <MarkerTooltip>
                  <TooltipCard
                    title={p.name}
                    sub={
                      active
                        ? `${stat?.count} inbound, ${formatTonnes(stat?.tonnes ?? 0)}`
                        : "No shipments inbound"
                    }
                  />
                </MarkerTooltip>
              </MapMarker>
            );
          })}

          {vessels.map((v) => (
            <MapMarker key={`vessel-${v.id}`} longitude={v.pos.lng} latitude={v.pos.lat}>
              <MarkerContent>
                <span className="relative flex items-center justify-center">
                  <span className="absolute inline-flex size-4 rounded-full bg-warning/30 animate-pulse-dot" />
                  <span className="relative inline-flex size-2 rounded-full bg-warning shadow-[0_1px_4px_rgba(0,0,0,0.5)] ring-2 ring-ink/70" />
                </span>
              </MarkerContent>
              <MarkerTooltip>
                <TooltipCard title={v.id} sub={`${v.customerName} · ETA ${v.eta}`} />
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-3 rounded-full border border-border bg-surface/85 px-3 py-1.5 text-[11px] text-ink-muted shadow-sm backdrop-blur-sm">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" />
            Port
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-faint" />
            Depot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning" />
            Inbound
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Small tooltip body rendered inside the map popup. The popup wrapper is an
 * inverted chip (bg-foreground / text-background), so text colour is inherited
 * to stay readable in both themes; the sub line just softens with opacity.
 */
function TooltipCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="min-w-[8rem]">
      <p className="text-[12px] font-semibold">{title}</p>
      <p className="mt-0.5 text-[11px] opacity-70">{sub}</p>
    </div>
  );
}
