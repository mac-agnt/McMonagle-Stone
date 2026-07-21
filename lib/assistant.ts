/**
 * Home assistant — scripted answers, real data.
 *
 * No model, no backend. A keyword matcher picks an intent, then the answer is
 * BUILT from `mockData` at module load, so every figure quoted here is the same
 * figure the Dashboard, Orders, Pipeline and Delays pages show.
 *
 * Voice: Daniel's. Calm, direct, no exclamation marks, no dashes.
 */

import {
  ordersAtRisk,
  ordersLate,
  quotes,
  quotesCold,
  openQuoteValue,
  followUpRate,
  avgDaysSlipped,
  dispatchToday,
  tonnageByQuarry,
  repPerformance,
  stockBelowReorder,
  riskFactors,
  getCustomer,
  getProduct,
  getQuarry,
  getOrder,
  stageIndex,
  stagesForSource,
  formatEuro,
  formatEuroShort,
  formatDate,
  formatTonnes,
  type Order,
} from "@/lib/mockData";
import { draftMessage } from "@/components/delays/helpers";

/* ------------------------------------------------------------------ */
/*  Answer shape                                                       */
/* ------------------------------------------------------------------ */

export type RowTone = "danger" | "warning" | "accent" | "neutral";

export type AnswerRow = {
  label: string;
  meta: string;
  value?: string;
  tag?: string;
  tone?: RowTone;
};

export type AnswerCard =
  /** Inline stage bar for one order. */
  | { kind: "stage"; orderId: string }
  /** Compact list of records. */
  | { kind: "list"; rows: AnswerRow[]; footer?: string }
  /** Copy-ready customer message. */
  | { kind: "message"; text: string };

export type AssistantAnswer = {
  intent: string;
  text: string;
  card?: AnswerCard;
  link?: { label: string; href: string };
  /** Datasets this answer drew from, shown as a small chip row. */
  sources?: string[];
};

/* ------------------------------------------------------------------ */
/*  Derived figures — computed once, shared by every answer            */
/* ------------------------------------------------------------------ */

const coldValue = quotesCold.reduce((s, q) => s + q.value, 0);
const lateCount = ordersLate.length;
const atRiskCount = ordersAtRisk.length;

/** Late first, then at-risk, worst slip on top. This is Delay Radar's order. */
const slipping: Order[] = [...ordersLate, ...ordersAtRisk].sort(
  (a, b) => (b.daysSlipped ?? 0) - (a.daysSlipped ?? 0)
);

const tonnesGap = dispatchToday.target - dispatchToday.tonnes;
const tonnesPct = Math.round((dispatchToday.tonnes / dispatchToday.target) * 100);

const topQuarry = [...tonnageByQuarry].sort((a, b) => b.tonnes - a.tonnes)[0];

/** Open (unconverted) quote value carried by one rep. */
function openValueFor(repId: string): number {
  return quotes
    .filter(
      (q) => q.repId === repId && (q.status === "open" || q.status === "cold")
    )
    .reduce((s, q) => s + q.value, 0);
}

const repsByDiscipline = [...repPerformance].sort(
  (a, b) => a.followUpRate - b.followUpRate
);
const worstRep = repsByDiscipline[0];
const bestRep = repsByDiscipline[repsByDiscipline.length - 1];

/** The order the whole Chadwicks story hangs on. */
const CHADWICKS_ORDER_ID = "MS-4419";

function orderRow(o: Order): AnswerRow {
  const customer = getCustomer(o.customerId);
  const product = getProduct(o.productId);
  return {
    label: customer?.name ?? o.id,
    meta: `${product?.name ?? "Order"} · ${o.id}`,
    value: `${formatDate(o.originalEta)} to ${formatDate(o.eta)}`,
    tag: o.delayReason,
    tone: o.status === "late" ? "danger" : "warning",
  };
}

/** Stage completion as a percentage of the order's own stage list. */
export function stagePct(o: Order): number {
  const stages = stagesForSource(o.source);
  return Math.round(((stageIndex(o) + 1) / stages.length) * 100);
}

/* ------------------------------------------------------------------ */
/*  Intents                                                            */
/* ------------------------------------------------------------------ */

type Intent = {
  id: string;
  /** Chip / suggestion label. Also the canonical phrasing. */
  question: string;
  /** Lowercase keywords. Longer, rarer phrases score higher. */
  keywords: string[];
  build: () => AssistantAnswer;
};

const intents: Intent[] = [
  {
    id: "risk",
    question: "What's my biggest risk right now?",
    keywords: ["biggest risk", "risk", "worry", "wrong", "state of", "overview", "how are we doing", "problem"],
    build: () => ({
      intent: "risk",
      text: [
        `Three things, in order. ${lateCount} orders are already late and another ${atRiskCount} are at risk, averaging ${avgDaysSlipped} days slipped between them. ${formatEuroShort(coldValue)} of quotes have gone cold without a single chase, the biggest being ${getCustomer(quotesCold[0].customerId)?.name} at ${formatEuro(quotesCold[0].value)}. And the follow-up rate across the team is ${followUpRate}%, which is what put those quotes on ice in the first place.`,
        `The delays cost you a phone call. The follow-up rate costs you the year.`,
      ].join("\n\n"),
      card: {
        kind: "list",
        rows: [
          {
            label: "Orders late or at risk",
            meta: `Averaging ${avgDaysSlipped} days slipped`,
            value: String(lateCount + atRiskCount),
            tone: "danger",
          },
          {
            label: "Quotes gone cold",
            meta: `${quotesCold.length} quotes, never chased`,
            value: formatEuroShort(coldValue),
            tone: "warning",
          },
          {
            label: "Follow-up rate",
            meta: `${formatEuroShort(openQuoteValue)} open across the pipeline`,
            value: `${followUpRate}%`,
            tone: "warning",
          },
        ],
      },
      link: { label: "View in Dashboard", href: "/dashboard" },
      sources: ["Orders", "Pipeline"],
    }),
  },

  {
    id: "slip",
    question: "Which orders are going to slip this week?",
    keywords: ["slip", "going to slip", "late", "delayed", "delay", "behind", "at risk", "this week"],
    build: () => ({
      intent: "slip",
      text: `${slipping.length} orders are off their promised date. ${lateCount} are already past it, ${atRiskCount} are still recoverable if they move now. The worst is ${getCustomer(slipping[0].customerId)?.name} on ${slipping[0].id}, ${slipping[0].daysSlipped} days out on a ${slipping[0].delayReason?.toLowerCase()}.`,
      card: {
        kind: "list",
        rows: slipping.slice(0, 5).map(orderRow),
        footer:
          slipping.length > 5
            ? `${slipping.length - 5} more on the Delay Radar.`
            : undefined,
      },
      link: { label: "View in Delays", href: "/delays" },
    }),
  },

  {
    id: "chadwicks",
    question: "Where's the Chadwicks order?",
    keywords: ["where", "chadwicks", "raj green", "indian sandstone", "ms-4419", "4419", "track"],
    build: () => {
      const o = getOrder(CHADWICKS_ORDER_ID)!;
      const stages = stagesForSource(o.source);
      const i = stageIndex(o);
      return {
        intent: "chadwicks",
        text: `${o.id}, ${formatTonnes(o.tonnage)} of ${getProduct(o.productId)?.name} for Chadwicks. It is sitting At Port in Dublin, stage ${i + 1} of ${stages.length}, and it is late. Promised ${formatDate(o.originalEta)}, now reading ${formatDate(o.eta)}, ${o.daysSlipped} days out on a ${o.delayReason?.toLowerCase()}. Ciara has it. Last update ${o.lastUpdate.toLowerCase()}.`,
        card: { kind: "stage", orderId: o.id },
        link: { label: "View in Orders", href: `/orders?order=${o.id}` },
      };
    },
  },

  {
    id: "cold",
    question: "Which quotes are going cold and worth most?",
    keywords: ["cold", "going cold", "quotes", "quote", "worth most", "biggest quote", "pipeline", "leaking"],
    build: () => ({
      intent: "cold",
      text: `${quotesCold.length} quotes worth ${formatEuro(coldValue)} have gone quiet, none of them chased once. ${getCustomer(quotesCold[0].customerId)?.name} is the big one at ${formatEuro(quotesCold[0].value)}, untouched for ${quotesCold[0].daysSinceContact} days. Two of the top three are Michael's.`,
      card: {
        kind: "list",
        rows: quotesCold.slice(0, 5).map((q) => ({
          label: getCustomer(q.customerId)?.name ?? q.id,
          meta: `${getProduct(q.productId)?.name} · ${q.id}`,
          value: formatEuro(q.value),
          tag: `${q.daysSinceContact}d quiet`,
          tone: q.daysSinceContact >= 14 ? ("danger" as const) : ("warning" as const),
        })),
        footer:
          quotesCold.length > 5
            ? `${quotesCold.length - 5} more sitting cold.`
            : undefined,
      },
      link: { label: "View in Pipeline", href: "/pipeline" },
      sources: ["Pipeline"],
    }),
  },

  {
    id: "followup-cost",
    question: "What's poor follow-up costing us?",
    keywords: ["costing", "cost", "poor follow-up", "follow up costing", "losing", "leak", "revenue", "money"],
    build: () => ({
      intent: "followup-cost",
      text: [
        `At a ${followUpRate}% follow-up rate with ${formatEuroShort(openQuoteValue)} open and ${formatEuroShort(coldValue)} already cold, you are leaking an estimated 5 to 10% of revenue. On €15M that is €750k to €1.5M a year.`,
        `None of it shows up in the accounts, because a quote nobody chased never becomes a number you can miss.`,
      ].join("\n\n"),
      card: {
        kind: "list",
        rows: [
          {
            label: "Open pipeline",
            meta: "Quotes still live, won or lost undecided",
            value: formatEuroShort(openQuoteValue),
            tone: "accent",
          },
          {
            label: "Already cold",
            meta: `${quotesCold.length} quotes past ${quotesCold[quotesCold.length - 1].daysSinceContact} days quiet`,
            value: formatEuroShort(coldValue),
            tone: "danger",
          },
          {
            label: "Estimated annual leak",
            meta: "5 to 10% of €15M turnover",
            value: "€750k to €1.5M",
            tone: "danger",
          },
        ],
      },
      link: { label: "View in Pipeline", href: "/pipeline" },
    }),
  },

  {
    id: "tonnage",
    question: "How are we tracking on tonnage today?",
    keywords: ["tonnage", "tonnes", "tons", "today", "target", "dispatch", "output", "quarry"],
    build: () => ({
      intent: "tonnage",
      text: `${formatTonnes(dispatchToday.tonnes)} out against a ${formatTonnes(dispatchToday.target)} target, so ${tonnesPct}% and ${formatTonnes(tonnesGap)} behind with the afternoon still to run. ${getQuarry(topQuarry.quarryId)?.name} is carrying it this month on ${formatTonnes(topQuarry.tonnes)}.`,
      card: {
        kind: "list",
        rows: [...tonnageByQuarry]
          .sort((a, b) => b.tonnes - a.tonnes)
          .slice(0, 4)
          .map((row, i) => ({
            label: getQuarry(row.quarryId)?.name ?? row.quarryId,
            meta: "Tonnes out this month",
            value: formatTonnes(row.tonnes),
            tone: i === 0 ? ("accent" as const) : ("neutral" as const),
          })),
      },
      link: { label: "View in Dashboard", href: "/dashboard" },
      sources: ["Dashboard"],
    }),
  },

  {
    id: "delay-note",
    question: "Draft the delay note for Chadwicks",
    keywords: ["draft", "note", "write", "message", "email", "tell them", "update them", "apolog"],
    build: () => {
      const o = getOrder(CHADWICKS_ORDER_ID)!;
      return {
        intent: "delay-note",
        text: `Here is the update for Chadwicks on ${o.id}, ${o.daysSlipped} days out on a ${o.delayReason?.toLowerCase()}. Same tone the Delay Radar uses. Copy it as it is or change the ending.`,
        card: {
          kind: "message",
          text: draftMessage(o, getCustomer(o.customerId), getProduct(o.productId)),
        },
        link: { label: "View in Delays", href: "/delays" },
      };
    },
  },

  {
    id: "chase",
    question: "Who needs to chase their quotes?",
    keywords: ["who needs", "chase", "rep", "reps", "team", "michael", "ciara", "discipline", "seller"],
    build: () => ({
      intent: "chase",
      text: `${worstRep.name}. He is on ${worstRep.followUpRate}% follow-up carrying ${formatEuroShort(openValueFor(worstRep.repId))} of open quotes, which is the widest gap on the team. ${bestRep.name} chases ${bestRep.followUpRate}% of hers and wins ${bestRep.won} of ${bestRep.sent}. Same product, same prices, different habit.`,
      card: {
        kind: "list",
        rows: repsByDiscipline.map((r) => ({
          label: r.name,
          meta: `${r.role} · ${r.followedUp} of ${r.sent} chased`,
          value: `${r.followUpRate}%`,
          tag: formatEuroShort(openValueFor(r.repId)),
          tone:
            r.followUpRate < 50
              ? ("danger" as const)
              : r.followUpRate < 80
                ? ("warning" as const)
                : ("accent" as const),
        })),
      },
      link: { label: "View in Team", href: "/team" },
    }),
  },

  {
    id: "stock",
    question: "Are we about to run out of anything?",
    keywords: ["stock", "run out", "running out", "reorder", "inventory", "short", "restock", "low"],
    build: () => {
      if (stockBelowReorder.length === 0) {
        return {
          intent: "stock",
          text: `Stock is healthy. Nothing is below its reorder point at any depot right now.`,
          link: { label: "View in Stock", href: "/stock" },
          sources: ["Stock"],
        };
      }
      const worst = stockBelowReorder[0];
      return {
        intent: "stock",
        text: `${stockBelowReorder.length} product${stockBelowReorder.length === 1 ? "" : "s"} ${stockBelowReorder.length === 1 ? "is" : "are"} below reorder point. ${worst.product.name} is the tightest, ${formatTonnes(worst.onHand)} on hand against a ${formatTonnes(worst.reorderPoint)} reorder line.`,
        card: {
          kind: "list",
          rows: stockBelowReorder.map((r) => ({
            label: r.product.name,
            meta: `${formatTonnes(r.onHand)} on hand, reorder at ${formatTonnes(r.reorderPoint)}`,
            value: r.runOutWeeks === Infinity ? undefined : `${r.runOutWeeks}w left`,
            tone: "danger" as const,
          })),
        },
        link: { label: "View in Stock", href: "/stock" },
        sources: ["Stock"],
      };
    },
  },

  {
    id: "tariff-exposure",
    question: "What's exposed to tariffs right now?",
    keywords: ["tariff", "tariffs", "exposed", "exposure", "risk factor", "geopolitical"],
    build: () => {
      const tariffRisk = riskFactors.find((f) => f.category === "Tariffs")!;
      const affectedNames = tariffRisk.affectedProductIds
        .map((id) => getProduct(id)?.name)
        .filter(Boolean) as string[];
      return {
        intent: "tariff-exposure",
        text: `${tariffRisk.name}, severity ${tariffRisk.severity} of 100. ${tariffRisk.note} ${affectedNames.length} product${affectedNames.length === 1 ? "" : "s"} sit in the exposure: ${affectedNames.join(", ")}.`,
        card: {
          kind: "list",
          rows: tariffRisk.affectedProductIds.map((id) => {
            const p = getProduct(id);
            return {
              label: p?.name ?? id,
              meta: `Import stone, exposed to ${tariffRisk.category.toLowerCase()}`,
              tone: "warning" as const,
            };
          }),
        },
        link: { label: "View in Delays", href: "/delays" },
        sources: ["Risk factors", "Orders"],
      };
    },
  },
];

/** The four chips on the Home hero — the strongest four. */
export const suggestedQuestions = [
  "What's my biggest risk right now?",
  "Which orders are going to slip this week?",
  "Where's the Chadwicks order?",
  "Are we about to run out of anything?",
] as const;

/* ------------------------------------------------------------------ */
/*  Matching                                                           */
/* ------------------------------------------------------------------ */

/** Longer keyword hits score higher, so "draft the note" beats a bare "chadwicks". */
function score(intent: Intent, q: string): number {
  let total = 0;
  for (const k of intent.keywords) {
    if (q.includes(k)) total += k.length;
  }
  return total;
}

function fallback(question: string): AssistantAnswer {
  return {
    intent: "fallback",
    text: `I cannot answer that one from what is in the system yet. Here is what I can read across Orders, Pipeline, Delays and the yard right now.`,
    card: {
      kind: "list",
      rows: intents.map((i) => ({
        label: i.question,
        meta: "Ask it as it is written, or in your own words",
      })),
      footer:
        question.trim().length > 0
          ? `Nothing matched "${question.trim()}".`
          : undefined,
    },
  };
}

/** Match a free-text question to a scripted, data-backed answer. */
export function answerFor(question: string): AssistantAnswer {
  const q = question.toLowerCase();
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    const s = score(intent, q);
    if (s > bestScore) {
      best = intent;
      bestScore = s;
    }
  }

  if (!best || bestScore < 4) return fallback(question);
  return best.build();
}
