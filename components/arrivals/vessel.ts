import type { Order } from "@/lib/mockData";

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
