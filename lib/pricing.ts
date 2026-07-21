/**
 * Landed-cost / quoting calc — pure functions, no backend.
 *
 * Shared by the Quoting engine (interactive calculator) and the Orders
 * drawer (landed-cost strip on a real order), so both read the same numbers.
 */

import { getProduct, type Order, type Product } from "./mockData";

/** Raw extraction cost per tonne at the quarry gate. */
export const quarryCostPerTonne: Record<string, number> = {
  "q-mountcharles": 38,
  "q-barnesmore": 52,
  "q-croaghan": 44,
  "q-glenties": 46,
  "q-bundoran": 40,
};

export const haulageRatePerTonneKm = 0.14; // eur per tonne per km

/** Quarry -> depot road distance (km), the haulage leg. */
export const quarryToDepotKm: Record<string, Record<string, number>> = {
  "q-mountcharles": { "d-donegal": 14, "d-dublin": 230, "d-cork": 410, "d-galway": 150 },
  "q-barnesmore": { "d-donegal": 22, "d-dublin": 215, "d-cork": 395, "d-galway": 165 },
  "q-croaghan": { "d-donegal": 30, "d-dublin": 205, "d-cork": 385, "d-galway": 140 },
  "q-glenties": { "d-donegal": 26, "d-dublin": 220, "d-cork": 400, "d-galway": 155 },
  "q-bundoran": { "d-donegal": 18, "d-dublin": 195, "d-cork": 370, "d-galway": 120 },
};

/** Freight + customs premium per tonne, already landed at the named port. */
export const importFreightPerTonne: Record<string, number> = {
  "Dublin Port": 34,
  "Cork (Ringaskiddy)": 41,
};

export type CostBreakdown = {
  materialCost: number;
  haulageCost: number;
  landedCost: number;
  landedCostPerTonne: number;
  marginValue: number;
  marginPct: number;
};

/** Landed cost for a real order already on the books. */
export function landedCostForOrder(order: Order): CostBreakdown {
  const product = getProduct(order.productId);
  if (!product || order.tonnage <= 0) {
    return { materialCost: 0, haulageCost: 0, landedCost: 0, landedCostPerTonne: 0, marginValue: 0, marginPct: 0 };
  }

  let materialCost: number;
  let haulageCost: number;

  if (order.source === "own-quarry" && order.originId) {
    const materialRate = quarryCostPerTonne[order.originId] ?? 45;
    const km = quarryToDepotKm[order.originId]?.[order.depotId] ?? 80;
    materialCost = materialRate * order.tonnage;
    haulageCost = km * haulageRatePerTonneKm * order.tonnage;
  } else {
    const port = product.port ?? "Dublin Port";
    materialCost = product.pricePerTonne * 0.55 * order.tonnage;
    haulageCost = (importFreightPerTonne[port] ?? 35) * order.tonnage;
  }

  const landedCost = materialCost + haulageCost;
  const marginValue = order.value - landedCost;
  const marginPct = order.value > 0 ? Math.round((marginValue / order.value) * 100) : 0;

  return {
    materialCost,
    haulageCost,
    landedCost,
    landedCostPerTonne: landedCost / order.tonnage,
    marginValue,
    marginPct,
  };
}

export type QuoteInputs = {
  productId: string;
  tonnage: number;
  depotId: string;
  /** Expected production waste, 0-100. Only applies to own-quarry stone. */
  yieldLossPct: number;
  marginPct: number;
};

export type QuoteBreakdown = CostBreakdown & {
  quotePrice: number;
  quotePricePerTonne: number;
  product: Product;
};

/** Live calculator: cost + margin -> quote price, for stone not yet ordered. */
export function quoteFromInputs(input: QuoteInputs): QuoteBreakdown | null {
  const product = getProduct(input.productId);
  if (!product || input.tonnage <= 0) return null;

  let materialCost: number;
  let haulageCost: number;

  if (product.origin === "own" && product.quarryId) {
    const materialRate = quarryCostPerTonne[product.quarryId] ?? 45;
    const km = quarryToDepotKm[product.quarryId]?.[input.depotId] ?? 80;
    const wasteFactor = 1 / Math.max(0.5, 1 - input.yieldLossPct / 100);
    materialCost = materialRate * input.tonnage * wasteFactor;
    haulageCost = km * haulageRatePerTonneKm * input.tonnage;
  } else {
    const port = product.port ?? "Dublin Port";
    materialCost = product.pricePerTonne * 0.55 * input.tonnage;
    haulageCost = (importFreightPerTonne[port] ?? 35) * input.tonnage;
  }

  const landedCost = materialCost + haulageCost;
  const margin = Math.max(0, Math.min(90, input.marginPct));
  const quotePrice = landedCost / (1 - margin / 100);
  const marginValue = quotePrice - landedCost;

  return {
    materialCost,
    haulageCost,
    landedCost,
    landedCostPerTonne: landedCost / input.tonnage,
    marginValue,
    marginPct: margin,
    quotePrice,
    quotePricePerTonne: quotePrice / input.tonnage,
    product,
  };
}
