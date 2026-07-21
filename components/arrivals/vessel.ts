import type { Order, OrderStage } from "@/lib/mockData";

/**
 * Deterministic short-sea / feeder vessel assignment for import orders.
 * No randomness, no clock: the same trackingId always maps to the same
 * vessel and voyage, so the board is stable across renders.
 */

const VESSELS = [
  "MV Arklow Villa",
  "MV Celtic Trader",
  "MV Shannon Star",
  "MV Wicklow Venture",
  "MV Boyne Endeavour",
  "MV Lee Navigator",
  "MV Foyle Carrier",
  "MV Suir Voyager",
] as const;

/** Simple stable string hash (djb2-ish, unsigned). */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export type Vessel = { vessel: string; voyage: string };

export function vesselFor(order: Order): Vessel {
  const h = hashString(order.trackingId);
  const vessel = VESSELS[h % VESSELS.length];
  const voyage = `V${100 + (h % 800)}`;
  return { vessel, voyage };
}

/* ------------------------------------------------------------------ */
/* Vessel position on the Arrivals map                                 */
/* ------------------------------------------------------------------ */

export type LngLat = { lng: number; lat: number };

/**
 * Fixed progress fraction (0..1) along the port -> depot route for each
 * sea-leg stage. Not derived from real GPS or dates — a simple, deterministic
 * stand-in so the map can show roughly how far along each shipment is.
 */
const STAGE_PROGRESS: Partial<Record<OrderStage, number>> = {
  "On Import Order": 0.35,
  "At Port": 0.85,
};

const VESSEL_STAGES: ReadonlySet<OrderStage> = new Set(
  Object.keys(STAGE_PROGRESS) as OrderStage[],
);

/** Whether an order's current stage should show a moving vessel marker. */
export function isVesselStage(stage: OrderStage): boolean {
  return VESSEL_STAGES.has(stage);
}

/**
 * Tiny deterministic offset (in degrees) derived from the order id, so that
 * two vessels landing on the same interpolated point (same product/port/
 * depot/stage) fan out instead of stacking exactly on top of each other.
 */
function jitterFor(id: string): { dLng: number; dLat: number } {
  const h = hashString(id);
  const angle = (h % 360) * (Math.PI / 180);
  const radius = 0.025; // ~a couple of km at this latitude — enough to separate dots
  return { dLng: Math.cos(angle) * radius, dLat: Math.sin(angle) * radius };
}

/**
 * Interpolates a vessel's position between its port of origin and its
 * destination depot, using a fixed progress fraction for the order's current
 * stage. Returns null for stages that shouldn't show a vessel (already
 * landed, or not yet an import order).
 */
export function getVesselPosition(order: Order, port: LngLat, depot: LngLat): LngLat | null {
  const fraction = STAGE_PROGRESS[order.stage];
  if (fraction === undefined) return null;

  const { dLng, dLat } = jitterFor(order.id);

  return {
    lng: port.lng + (depot.lng - port.lng) * fraction + dLng,
    lat: port.lat + (depot.lat - port.lat) * fraction + dLat,
  };
}
