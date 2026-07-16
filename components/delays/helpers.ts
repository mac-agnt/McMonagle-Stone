import { TODAY, formatDateLong } from "@/lib/mockData";
import type { Order, DelayReason, Customer, Product } from "@/lib/mockData";

/** Delay reason in plain, calm words for a customer message. */
export function reasonInWords(reason: DelayReason): string {
  switch (reason) {
    case "Shipping delay":
      return "a delay with the shipping line";
    case "Production":
      return "a short delay in production";
    case "Weather":
      return "poor weather at the quarry";
    case "Supplier":
      return "a delay from our supplier";
  }
}

/** Greeting that reads naturally for both trade and B2C customers. */
function greeting(customer: Customer | undefined): string {
  if (!customer) return "there";
  if (customer.type === "trade") return `${customer.name} team`;
  return customer.name.split(" ")[0];
}

/**
 * Pre-drafted update in Daniel/Michael's calm, professional tone.
 * No exclamation marks, no dashes.
 */
export function draftMessage(
  order: Order,
  customer: Customer | undefined,
  product: Product | undefined
): string {
  const who = greeting(customer);
  const item = product?.name ?? "your order";
  const reason = order.delayReason
    ? reasonInWords(order.delayReason)
    : "a delay in transit";
  const newEta = formatDateLong(order.eta);
  const oldEta = formatDateLong(order.originalEta);

  return [
    `Hi ${who},`,
    "",
    `A quick update on your ${item} order. It is now expected ${newEta} rather than ${oldEta}, due to ${reason}. Everything else is on track and we will have it moving to you as soon as it lands.`,
    "",
    "Thanks for your patience,",
    "Michael",
  ].join("\n");
}

/** Whole days from today to an ISO date (positive = future). */
export function daysUntil(iso: string): number {
  const today = new Date(`${TODAY}T00:00:00`).getTime();
  const target = new Date(`${iso}T00:00:00`).getTime();
  return Math.round((target - today) / 86_400_000);
}

/**
 * Short forecast rationale for an order predicted to slip.
 * Composed in plain words from the current stage and days remaining.
 */
export function predictedWhy(order: Order): string {
  const days = daysUntil(order.eta);
  const reason = order.predictedReason;

  if (reason === "Production") {
    return `Still in production with ${days} days to ETA. A run this size usually needs closer to ${days + 3}.`;
  }
  if (reason === "Shipping delay") {
    return `On import order with the sailing not yet booked. The line is running about a week behind, tightening the ${days} day window.`;
  }
  if (reason === "Weather") {
    return `Quarry output is behind after a wet week, with only ${days} days of slack before the promised date.`;
  }
  if (reason === "Supplier") {
    return `Waiting on the supplier to confirm the load, with ${days} days to ETA and no firm date back yet.`;
  }
  return `Tracking behind the usual pace with ${days} days to ETA.`;
}
