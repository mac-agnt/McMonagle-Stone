/**
 * ⌘K search index. Nav pages plus every order, quote and customer in the demo
 * data, so the bar finds records, not just screens.
 */

import type { Icon } from "@phosphor-icons/react";
import { Package, FunnelSimple, Buildings, Archive, Factory } from "@phosphor-icons/react/dist/ssr";
import { allNav } from "@/lib/nav";
import {
  orders,
  quotes,
  customers,
  stockRows,
  productionRows,
  getCustomer,
  getProduct,
  formatEuro,
  formatTonnes,
  formatDate,
} from "@/lib/mockData";

export type SearchResult = {
  id: string;
  label: string;
  /** Second line: what this record is. */
  detail: string;
  /** Right-hand column: value, ETA, status. */
  meta?: string;
  group: "Pages" | "Orders" | "Quotes" | "Customers" | "Stock" | "Production";
  icon: Icon;
  href: string;
  /** Everything matchable, lowercased. */
  haystack: string;
};

const navResults: SearchResult[] = allNav.map((n) => ({
  id: `nav-${n.slug}`,
  label: n.label,
  detail: "Page",
  group: "Pages",
  icon: n.icon,
  href: n.href,
  haystack: `${n.label} ${n.slug}`.toLowerCase(),
}));

const orderResults: SearchResult[] = orders.map((o) => {
  const customer = getCustomer(o.customerId);
  const product = getProduct(o.productId);
  return {
    id: `order-${o.id}`,
    label: `${o.id} · ${customer?.name ?? "Order"}`,
    detail: `${product?.name} · ${o.stage}`,
    meta: o.status === "on-time" ? formatDate(o.eta) : o.status === "late" ? "Late" : "At risk",
    group: "Orders",
    icon: Package,
    href: `/orders?order=${o.id}`,
    haystack: `${o.id} ${customer?.name} ${product?.name} ${o.stage} ${o.status}`.toLowerCase(),
  };
});

const quoteResults: SearchResult[] = quotes.map((q) => {
  const customer = getCustomer(q.customerId);
  const product = getProduct(q.productId);
  return {
    id: `quote-${q.id}`,
    label: `${q.id} · ${customer?.name ?? "Quote"}`,
    detail: `${product?.name} · ${q.status}`,
    meta: formatEuro(q.value),
    group: "Quotes",
    icon: FunnelSimple,
    href: "/pipeline",
    haystack: `${q.id} ${customer?.name} ${product?.name} ${q.status} quote`.toLowerCase(),
  };
});

const customerResults: SearchResult[] = customers.map((c) => {
  const live = orders.filter((o) => o.customerId === c.id).length;
  return {
    id: `customer-${c.id}`,
    label: c.name,
    detail: `${c.type === "trade" ? "Trade" : "Retail"} · ${c.location}`,
    meta: `${live} ${live === 1 ? "order" : "orders"}`,
    group: "Customers",
    icon: Buildings,
    href: `/orders?q=${encodeURIComponent(c.name)}`,
    haystack: `${c.name} ${c.location} ${c.type} customer`.toLowerCase(),
  };
});

const stockResults: SearchResult[] = stockRows.map((s) => ({
  id: `stock-${s.productId}`,
  label: s.product.name,
  detail: `Stock · ${s.belowReorder ? "Below reorder point" : "Healthy"}`,
  meta: formatTonnes(s.onHand),
  group: "Stock",
  icon: Archive,
  href: "/stock",
  haystack: `${s.product.name} stock inventory reorder`.toLowerCase(),
}));

const productionResults: SearchResult[] = productionRows.map((p) => ({
  id: `production-${p.id}`,
  label: `${p.id} · ${p.product.name}`,
  detail: `${p.quarry.name} · ${p.qualityFlag}`,
  meta: `${p.yieldPct}% yield`,
  group: "Production",
  icon: Factory,
  href: "/production",
  haystack: `${p.id} ${p.product.name} ${p.quarry.name} production yield ${p.qualityFlag}`.toLowerCase(),
}));

const index: SearchResult[] = [
  ...navResults,
  ...orderResults,
  ...quoteResults,
  ...customerResults,
  ...stockResults,
  ...productionResults,
];

export const GROUP_ORDER: SearchResult["group"][] = [
  "Pages",
  "Orders",
  "Quotes",
  "Customers",
  "Stock",
  "Production",
];

/** Empty query shows the pages, same as before. Otherwise search everything. */
export function search(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return navResults;

  const hits = index.filter((r) => r.haystack.includes(q));

  // Exact id / name starts beat mid-string mentions.
  hits.sort((a, b) => {
    const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
  });

  return hits.slice(0, limit);
}
