/**
 * McMonagle Stone — shared demo data.
 *
 * Single source of truth for every page (Dashboard, Orders, Pipeline, Delays).
 * Numbers are internally consistent: the same orders/customers/products/reps
 * surface across pages. `TODAY` is fixed so the demo is deterministic.
 *
 * Company shape: 5 Donegal quarries, 2 production centres, 4 depots, ~€15M/yr.
 * Own-quarry stock has historically had WORSE tracking visibility than imports
 * (imports get a shipping trail); this OS finally tracks own-quarry stock too.
 */

export const TODAY = "2026-07-15"; // Wed 15 Jul 2026

/* ------------------------------------------------------------------ */
/*  Reference entities                                                 */
/* ------------------------------------------------------------------ */

export type Quarry = {
  id: string;
  name: string;
  county: string;
};

export const quarries: Quarry[] = [
  { id: "q-mountcharles", name: "Mountcharles", county: "Donegal" },
  { id: "q-barnesmore", name: "Barnesmore", county: "Donegal" },
  { id: "q-croaghan", name: "Croaghan Hill", county: "Donegal" },
  { id: "q-glenties", name: "Glenties", county: "Donegal" },
  { id: "q-bundoran", name: "Bundoran", county: "Donegal" },
];

export type Depot = {
  id: string;
  name: string;
  county: string;
};

export const depots: Depot[] = [
  { id: "d-donegal", name: "Donegal", county: "Donegal" },
  { id: "d-dublin", name: "Dublin", county: "Dublin" },
  { id: "d-cork", name: "Cork", county: "Cork" },
  { id: "d-galway", name: "Galway", county: "Galway" },
];

export const productionCentres = [
  { id: "pc-mountcharles", name: "Mountcharles Production" },
  { id: "pc-ballybofey", name: "Ballybofey Production" },
];

export type ProductOrigin = "own" | "import";

export type Product = {
  id: string;
  name: string;
  origin: ProductOrigin;
  /** Home quarry (own) — the dispatch origin shown on tracking. */
  quarryId?: string;
  /** Arrival port (import). */
  port?: string;
  /** Indicative price per tonne (€), used to keep order value ~ tonnage. */
  pricePerTonne: number;
  /** picsum seed for the neutral "stage photo" placeholder. */
  imageSeed: string;
};

export const products: Product[] = [
  {
    id: "p-quartzite",
    name: "Donegal Quartzite Paving",
    origin: "own",
    quarryId: "q-mountcharles",
    pricePerTonne: 95,
    imageSeed: "mcm-quartzite",
  },
  {
    id: "p-kilkenny",
    name: "Kilkenny Blue Limestone",
    origin: "own",
    quarryId: "q-barnesmore",
    pricePerTonne: 210,
    imageSeed: "mcm-limestone",
  },
  {
    id: "p-liscannor",
    name: "Liscannor Flagstone",
    origin: "own",
    quarryId: "q-glenties",
    pricePerTonne: 185,
    imageSeed: "mcm-flagstone",
  },
  {
    id: "p-granite-kerb",
    name: "Silver Grey Granite Kerb",
    origin: "own",
    quarryId: "q-croaghan",
    pricePerTonne: 120,
    imageSeed: "mcm-granite-kerb",
  },
  {
    id: "p-setts",
    name: "Sandstone Setts",
    origin: "own",
    quarryId: "q-bundoran",
    pricePerTonne: 140,
    imageSeed: "mcm-setts",
  },
  {
    id: "p-indian",
    name: "Indian Sandstone (Raj Green)",
    origin: "import",
    port: "Dublin Port",
    pricePerTonne: 58,
    imageSeed: "mcm-indian-raj",
  },
  {
    id: "p-g654",
    name: "Chinese Granite G654",
    origin: "import",
    port: "Cork (Ringaskiddy)",
    pricePerTonne: 68,
    imageSeed: "mcm-g654",
  },
  {
    id: "p-cobble",
    name: "Portuguese Cobblestone",
    origin: "import",
    port: "Dublin Port",
    pricePerTonne: 88,
    imageSeed: "mcm-cobble",
  },
];

export type Rep = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export const reps: Rep[] = [
  { id: "r-michael", name: "Michael", role: "Co-owner", initials: "MC" },
  { id: "r-ciara", name: "Ciara", role: "Sales", initials: "CD" },
  { id: "r-liam", name: "Liam", role: "Sales", initials: "LB" },
  { id: "r-fintan", name: "Fintan", role: "Sales / Counter", initials: "FK" },
];

export type CustomerType = "trade" | "B2C";

export type Customer = {
  id: string;
  name: string;
  type: CustomerType;
  location: string;
};

export const customers: Customer[] = [
  { id: "c-donegalcc", name: "Donegal County Council", type: "trade", location: "Lifford" },
  { id: "c-chadwicks", name: "Chadwicks", type: "trade", location: "Dublin" },
  { id: "c-murdock", name: "Murdock Builders Merchants", type: "trade", location: "Letterkenny" },
  { id: "c-greenscape", name: "GreenScape Contractors", type: "trade", location: "Galway" },
  { id: "c-glanbia", name: "Glanbia Landscaping", type: "trade", location: "Kilkenny" },
  { id: "c-sarah", name: "Sarah Kelly", type: "B2C", location: "Sligo" },
  { id: "c-tom", name: "Tom Ferguson", type: "B2C", location: "Bundoran" },
  { id: "c-oreilly", name: "O'Reilly Residence", type: "B2C", location: "Donegal Town" },
  { id: "c-patrick", name: "Patrick Doyle", type: "B2C", location: "Ballyshannon" },
];

/* ------------------------------------------------------------------ */
/*  Order stages                                                       */
/* ------------------------------------------------------------------ */

export type OrderSource = "own-quarry" | "import";

/** Full canonical stage vocabulary, in order. */
export const OWN_STAGES = [
  "Quoted",
  "Confirmed",
  "In Production",
  "Ready at Depot",
  "Dispatched",
  "Delivered",
] as const;

export const IMPORT_STAGES = [
  "Quoted",
  "Confirmed",
  "On Import Order",
  "At Port",
  "Landed",
  "Ready at Depot",
  "Dispatched",
  "Delivered",
] as const;

export type OwnStage = (typeof OWN_STAGES)[number];
export type ImportStage = (typeof IMPORT_STAGES)[number];
export type OrderStage = OwnStage | ImportStage;

export function stagesForSource(source: OrderSource): readonly OrderStage[] {
  return source === "import" ? IMPORT_STAGES : OWN_STAGES;
}

export type OrderStatus = "on-time" | "at-risk" | "late";

export type DelayReason = "Shipping delay" | "Production" | "Weather" | "Supplier";

export type Order = {
  id: string;
  customerId: string;
  type: CustomerType;
  productId: string;
  source: OrderSource;
  /** Quarry (own) or port (import) — the dispatch origin. */
  originId?: string; // quarryId for own-quarry
  depotId: string;
  repId: string;
  tonnage: number;
  value: number;
  stage: OrderStage;
  status: OrderStatus;
  /** Current promised ETA (ISO). */
  eta: string;
  /** The ETA originally promised (ISO) — differs from eta when slipped. */
  originalEta: string;
  lastUpdate: string;
  atRisk: boolean;
  /** Delay bookkeeping (present when at-risk / late / predicted). */
  delayReason?: DelayReason;
  daysSlipped?: number;
  /** On-time now, but forecast to slip from stage-vs-cycle-time. */
  predictedSlip?: boolean;
  predictedReason?: DelayReason;
  /** Public tracking slug. */
  trackingId: string;
};

/**
 * ~24 live orders. Value ≈ tonnage × product price for bulk; small B2C
 * orders carry a bag/handling premium so value isn't strictly linear.
 * Spread runs from a €40 counter sample to a €62k council contract.
 */
export const orders: Order[] = [
  // 1 — flagship council contract, mid-production, on time
  {
    id: "MS-4412",
    customerId: "c-donegalcc",
    type: "trade",
    productId: "p-kilkenny",
    source: "own-quarry",
    originId: "q-barnesmore",
    depotId: "d-donegal",
    repId: "r-michael",
    tonnage: 295,
    value: 61950,
    stage: "In Production",
    status: "on-time",
    eta: "2026-07-24",
    originalEta: "2026-07-24",
    lastUpdate: "Today 08:15",
    atRisk: false,
    trackingId: "ms4412",
  },
  // 2 — import, at port, slipped (shipping) — LATE
  {
    id: "MS-4419",
    customerId: "c-chadwicks",
    type: "trade",
    productId: "p-indian",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-dublin",
    repId: "r-ciara",
    tonnage: 168,
    value: 9744,
    stage: "At Port",
    status: "late",
    eta: "2026-07-14",
    originalEta: "2026-07-09",
    lastUpdate: "Today 07:40",
    atRisk: true,
    delayReason: "Shipping delay",
    daysSlipped: 5,
    trackingId: "ms4419",
  },
  // 3 — own quarry, ready at depot, on time
  {
    id: "MS-4423",
    customerId: "c-murdock",
    type: "trade",
    productId: "p-quartzite",
    source: "own-quarry",
    originId: "q-mountcharles",
    depotId: "d-donegal",
    repId: "r-liam",
    tonnage: 84,
    value: 7980,
    stage: "Ready at Depot",
    status: "on-time",
    eta: "2026-07-16",
    originalEta: "2026-07-16",
    lastUpdate: "Today 09:02",
    atRisk: false,
    trackingId: "ms4423",
  },
  // 4 — own quarry, in production, AT RISK (production slip)
  {
    id: "MS-4425",
    customerId: "c-greenscape",
    type: "trade",
    productId: "p-granite-kerb",
    source: "own-quarry",
    originId: "q-croaghan",
    depotId: "d-galway",
    repId: "r-ciara",
    tonnage: 132,
    value: 15840,
    stage: "In Production",
    status: "at-risk",
    eta: "2026-07-20",
    originalEta: "2026-07-18",
    lastUpdate: "Yesterday 16:20",
    atRisk: true,
    delayReason: "Production",
    daysSlipped: 2,
    trackingId: "ms4425",
  },
  // 5 — import, on import order, on time (predicted to slip)
  {
    id: "MS-4431",
    customerId: "c-glanbia",
    type: "trade",
    productId: "p-cobble",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-dublin",
    repId: "r-liam",
    tonnage: 96,
    value: 8448,
    stage: "On Import Order",
    status: "on-time",
    eta: "2026-08-05",
    originalEta: "2026-08-05",
    lastUpdate: "Yesterday 11:05",
    atRisk: false,
    predictedSlip: true,
    predictedReason: "Shipping delay",
    trackingId: "ms4431",
  },
  // 6 — B2C small pallet, dispatched today, on time
  {
    id: "MS-4433",
    customerId: "c-sarah",
    type: "B2C",
    productId: "p-setts",
    source: "own-quarry",
    originId: "q-bundoran",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 2.4,
    value: 336,
    stage: "Dispatched",
    status: "on-time",
    eta: "2026-07-15",
    originalEta: "2026-07-15",
    lastUpdate: "Today 06:50",
    atRisk: false,
    trackingId: "ms4433",
  },
  // 7 — B2C counter sample, delivered, on time (€40 low end)
  {
    id: "MS-4402",
    customerId: "c-tom",
    type: "B2C",
    productId: "p-indian",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 0.5,
    value: 40,
    stage: "Delivered",
    status: "on-time",
    eta: "2026-07-11",
    originalEta: "2026-07-11",
    lastUpdate: "11 Jul 15:30",
    atRisk: false,
    trackingId: "ms4402",
  },
  // 8 — import, landed, on time
  {
    id: "MS-4428",
    customerId: "c-chadwicks",
    type: "trade",
    productId: "p-g654",
    source: "import",
    originId: "Cork (Ringaskiddy)",
    depotId: "d-cork",
    repId: "r-ciara",
    tonnage: 240,
    value: 16320,
    stage: "Landed",
    status: "on-time",
    eta: "2026-07-19",
    originalEta: "2026-07-19",
    lastUpdate: "Today 08:44",
    atRisk: false,
    trackingId: "ms4428",
  },
  // 9 — own quarry, dispatched, on time
  {
    id: "MS-4430",
    customerId: "c-donegalcc",
    type: "trade",
    productId: "p-quartzite",
    source: "own-quarry",
    originId: "q-croaghan",
    depotId: "d-donegal",
    repId: "r-michael",
    tonnage: 156,
    value: 14820,
    stage: "Dispatched",
    status: "on-time",
    eta: "2026-07-15",
    originalEta: "2026-07-15",
    lastUpdate: "Today 07:10",
    atRisk: false,
    trackingId: "ms4430",
  },
  // 10 — own quarry, quoted stage, on time
  {
    id: "MS-4440",
    customerId: "c-murdock",
    type: "trade",
    productId: "p-liscannor",
    source: "own-quarry",
    originId: "q-glenties",
    depotId: "d-donegal",
    repId: "r-liam",
    tonnage: 62,
    value: 11470,
    stage: "Quoted",
    status: "on-time",
    eta: "2026-08-01",
    originalEta: "2026-08-01",
    lastUpdate: "Today 10:30",
    atRisk: false,
    trackingId: "ms4440",
  },
  // 11 — import, at port, on time
  {
    id: "MS-4421",
    customerId: "c-greenscape",
    type: "trade",
    productId: "p-indian",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-galway",
    repId: "r-ciara",
    tonnage: 144,
    value: 8352,
    stage: "At Port",
    status: "on-time",
    eta: "2026-07-18",
    originalEta: "2026-07-18",
    lastUpdate: "Today 08:20",
    atRisk: false,
    trackingId: "ms4421",
  },
  // 12 — own quarry, confirmed, LATE (weather at quarry)
  {
    id: "MS-4415",
    customerId: "c-glanbia",
    type: "trade",
    productId: "p-setts",
    source: "own-quarry",
    originId: "q-bundoran",
    depotId: "d-dublin",
    repId: "r-liam",
    tonnage: 78,
    value: 10920,
    stage: "Confirmed",
    status: "late",
    eta: "2026-07-13",
    originalEta: "2026-07-08",
    lastUpdate: "Yesterday 14:10",
    atRisk: true,
    delayReason: "Weather",
    daysSlipped: 5,
    trackingId: "ms4415",
  },
  // 13 — B2C, ready at depot, on time
  {
    id: "MS-4435",
    customerId: "c-oreilly",
    type: "B2C",
    productId: "p-quartzite",
    source: "own-quarry",
    originId: "q-mountcharles",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 6.5,
    value: 780,
    stage: "Ready at Depot",
    status: "on-time",
    eta: "2026-07-17",
    originalEta: "2026-07-17",
    lastUpdate: "Today 09:35",
    atRisk: false,
    trackingId: "ms4435",
  },
  // 14 — import, on import order, AT RISK (supplier)
  {
    id: "MS-4438",
    customerId: "c-chadwicks",
    type: "trade",
    productId: "p-g654",
    source: "import",
    originId: "Cork (Ringaskiddy)",
    depotId: "d-cork",
    repId: "r-ciara",
    tonnage: 210,
    value: 14280,
    stage: "On Import Order",
    status: "at-risk",
    eta: "2026-08-12",
    originalEta: "2026-08-08",
    lastUpdate: "Yesterday 09:15",
    atRisk: true,
    delayReason: "Supplier",
    daysSlipped: 4,
    trackingId: "ms4438",
  },
  // 15 — own quarry, delivered, on time
  {
    id: "MS-4408",
    customerId: "c-donegalcc",
    type: "trade",
    productId: "p-granite-kerb",
    source: "own-quarry",
    originId: "q-croaghan",
    depotId: "d-donegal",
    repId: "r-michael",
    tonnage: 188,
    value: 22560,
    stage: "Delivered",
    status: "on-time",
    eta: "2026-07-10",
    originalEta: "2026-07-10",
    lastUpdate: "10 Jul 13:20",
    atRisk: false,
    trackingId: "ms4408",
  },
  // 16 — B2C, in production, on time
  {
    id: "MS-4442",
    customerId: "c-patrick",
    type: "B2C",
    productId: "p-liscannor",
    source: "own-quarry",
    originId: "q-glenties",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 4.2,
    value: 820,
    stage: "In Production",
    status: "on-time",
    eta: "2026-07-22",
    originalEta: "2026-07-22",
    lastUpdate: "Today 10:12",
    atRisk: false,
    trackingId: "ms4442",
  },
  // 17 — own quarry, in production, on time (predicted slip — behind cycle)
  {
    id: "MS-4426",
    customerId: "c-murdock",
    type: "trade",
    productId: "p-quartzite",
    source: "own-quarry",
    originId: "q-mountcharles",
    depotId: "d-donegal",
    repId: "r-liam",
    tonnage: 120,
    value: 11400,
    stage: "In Production",
    status: "on-time",
    eta: "2026-07-21",
    originalEta: "2026-07-21",
    lastUpdate: "Yesterday 15:40",
    atRisk: false,
    predictedSlip: true,
    predictedReason: "Production",
    trackingId: "ms4426",
  },
  // 18 — import, dispatched, on time
  {
    id: "MS-4417",
    customerId: "c-greenscape",
    type: "trade",
    productId: "p-cobble",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-galway",
    repId: "r-liam",
    tonnage: 72,
    value: 6336,
    stage: "Dispatched",
    status: "on-time",
    eta: "2026-07-15",
    originalEta: "2026-07-15",
    lastUpdate: "Today 06:30",
    atRisk: false,
    trackingId: "ms4417",
  },
  // 19 — own quarry, confirmed, on time
  {
    id: "MS-4441",
    customerId: "c-glanbia",
    type: "trade",
    productId: "p-kilkenny",
    source: "own-quarry",
    originId: "q-barnesmore",
    depotId: "d-dublin",
    repId: "r-michael",
    tonnage: 205,
    value: 43050,
    stage: "Confirmed",
    status: "on-time",
    eta: "2026-07-30",
    originalEta: "2026-07-30",
    lastUpdate: "Today 09:50",
    atRisk: false,
    trackingId: "ms4441",
  },
  // 20 — B2C, delivered, on time
  {
    id: "MS-4399",
    customerId: "c-sarah",
    type: "B2C",
    productId: "p-cobble",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 1.8,
    value: 198,
    stage: "Delivered",
    status: "on-time",
    eta: "2026-07-09",
    originalEta: "2026-07-09",
    lastUpdate: "09 Jul 12:00",
    atRisk: false,
    trackingId: "ms4399",
  },
  // 21 — own quarry, ready at depot, AT RISK (transport/weather)
  {
    id: "MS-4432",
    customerId: "c-greenscape",
    type: "trade",
    productId: "p-setts",
    source: "own-quarry",
    originId: "q-bundoran",
    depotId: "d-galway",
    repId: "r-ciara",
    tonnage: 90,
    value: 12600,
    stage: "Ready at Depot",
    status: "at-risk",
    eta: "2026-07-19",
    originalEta: "2026-07-17",
    lastUpdate: "Today 08:05",
    atRisk: true,
    delayReason: "Weather",
    daysSlipped: 2,
    trackingId: "ms4432",
  },
  // 22 — import, landed, LATE (customs / supplier)
  {
    id: "MS-4413",
    customerId: "c-chadwicks",
    type: "trade",
    productId: "p-indian",
    source: "import",
    originId: "Dublin Port",
    depotId: "d-dublin",
    repId: "r-ciara",
    tonnage: 132,
    value: 7656,
    stage: "Landed",
    status: "late",
    eta: "2026-07-12",
    originalEta: "2026-07-07",
    lastUpdate: "Yesterday 17:30",
    atRisk: true,
    delayReason: "Supplier",
    daysSlipped: 5,
    trackingId: "ms4413",
  },
  // 23 — own quarry, quoted, on time (big B2C driveway)
  {
    id: "MS-4443",
    customerId: "c-oreilly",
    type: "B2C",
    productId: "p-liscannor",
    source: "own-quarry",
    originId: "q-glenties",
    depotId: "d-donegal",
    repId: "r-fintan",
    tonnage: 9.0,
    value: 1665,
    stage: "Quoted",
    status: "on-time",
    eta: "2026-08-03",
    originalEta: "2026-08-03",
    lastUpdate: "Today 11:20",
    atRisk: false,
    trackingId: "ms4443",
  },
  // 24 — own quarry, in production, AT RISK (production), predicted-ish
  {
    id: "MS-4427",
    customerId: "c-donegalcc",
    type: "trade",
    productId: "p-granite-kerb",
    source: "own-quarry",
    originId: "q-croaghan",
    depotId: "d-donegal",
    repId: "r-michael",
    tonnage: 260,
    value: 31200,
    stage: "In Production",
    status: "at-risk",
    eta: "2026-07-27",
    originalEta: "2026-07-24",
    lastUpdate: "Yesterday 13:05",
    atRisk: true,
    delayReason: "Production",
    daysSlipped: 3,
    trackingId: "ms4427",
  },
];

/* ------------------------------------------------------------------ */
/*  Quotes (pipeline)                                                  */
/* ------------------------------------------------------------------ */

export type QuoteStatus = "open" | "cold" | "won" | "lost";
export type LossReason =
  | "Price"
  | "Timing"
  | "Went elsewhere"
  | "No response"
  | "Other";

export type Quote = {
  id: string;
  customerId: string;
  productId: string;
  repId: string;
  value: number;
  sentDate: string; // ISO
  daysSinceContact: number;
  status: QuoteStatus;
  /** Did the rep chase this quote at least once? (drives seller-vs-taker split) */
  followedUp: boolean;
  lossReason?: LossReason;
};

/**
 * ~30 quotes. Rep mix exposes the seller-vs-order-taker split:
 * Ciara/Liam chase, Michael (busy owner) and Fintan (counter) mostly don't.
 * Cold quotes are the invisible leak — high value, never chased.
 */
export const quotes: Quote[] = [
  // --- Open, fresh (days < 3) ---
  { id: "Q-8801", customerId: "c-greenscape", productId: "p-quartzite", repId: "r-ciara", value: 18400, sentDate: "2026-07-14", daysSinceContact: 1, status: "open", followedUp: true },
  { id: "Q-8802", customerId: "c-murdock", productId: "p-granite-kerb", repId: "r-liam", value: 9600, sentDate: "2026-07-14", daysSinceContact: 1, status: "open", followedUp: true },
  { id: "Q-8803", customerId: "c-oreilly", productId: "p-liscannor", repId: "r-fintan", value: 1650, sentDate: "2026-07-13", daysSinceContact: 2, status: "open", followedUp: false },
  { id: "Q-8804", customerId: "c-chadwicks", productId: "p-indian", repId: "r-ciara", value: 12200, sentDate: "2026-07-15", daysSinceContact: 0, status: "open", followedUp: true },
  { id: "Q-8805", customerId: "c-tom", productId: "p-setts", repId: "r-fintan", value: 540, sentDate: "2026-07-13", daysSinceContact: 2, status: "open", followedUp: false },

  // --- Open, needs follow-up (3–6 days) ---
  { id: "Q-8806", customerId: "c-donegalcc", productId: "p-kilkenny", repId: "r-michael", value: 47500, sentDate: "2026-07-10", daysSinceContact: 5, status: "open", followedUp: false },
  { id: "Q-8807", customerId: "c-glanbia", productId: "p-cobble", repId: "r-liam", value: 8800, sentDate: "2026-07-11", daysSinceContact: 4, status: "open", followedUp: false },
  { id: "Q-8808", customerId: "c-greenscape", productId: "p-g654", repId: "r-ciara", value: 15600, sentDate: "2026-07-09", daysSinceContact: 6, status: "open", followedUp: true },
  { id: "Q-8809", customerId: "c-patrick", productId: "p-quartzite", repId: "r-fintan", value: 2100, sentDate: "2026-07-11", daysSinceContact: 4, status: "open", followedUp: false },
  { id: "Q-8810", customerId: "c-murdock", productId: "p-setts", repId: "r-michael", value: 6400, sentDate: "2026-07-10", daysSinceContact: 5, status: "open", followedUp: false },

  // --- Cold (≥7 days, never chased) — the leak, sorted by value in UI ---
  { id: "Q-8811", customerId: "c-donegalcc", productId: "p-granite-kerb", repId: "r-michael", value: 38900, sentDate: "2026-06-28", daysSinceContact: 17, status: "cold", followedUp: false },
  { id: "Q-8812", customerId: "c-chadwicks", productId: "p-kilkenny", repId: "r-michael", value: 29400, sentDate: "2026-07-01", daysSinceContact: 14, status: "cold", followedUp: false },
  { id: "Q-8813", customerId: "c-glanbia", productId: "p-liscannor", repId: "r-fintan", value: 16750, sentDate: "2026-07-02", daysSinceContact: 13, status: "cold", followedUp: false },
  { id: "Q-8814", customerId: "c-greenscape", productId: "p-cobble", repId: "r-liam", value: 11200, sentDate: "2026-07-03", daysSinceContact: 12, status: "cold", followedUp: false },
  { id: "Q-8815", customerId: "c-murdock", productId: "p-indian", repId: "r-fintan", value: 7300, sentDate: "2026-07-04", daysSinceContact: 11, status: "cold", followedUp: false },
  { id: "Q-8816", customerId: "c-sarah", productId: "p-quartzite", repId: "r-fintan", value: 1450, sentDate: "2026-07-05", daysSinceContact: 10, status: "cold", followedUp: false },

  // --- Won ---
  { id: "Q-8817", customerId: "c-donegalcc", productId: "p-kilkenny", repId: "r-michael", value: 61950, sentDate: "2026-06-20", daysSinceContact: 8, status: "won", followedUp: true },
  { id: "Q-8818", customerId: "c-chadwicks", productId: "p-g654", repId: "r-ciara", value: 16320, sentDate: "2026-06-25", daysSinceContact: 6, status: "won", followedUp: true },
  { id: "Q-8819", customerId: "c-greenscape", productId: "p-granite-kerb", repId: "r-ciara", value: 15840, sentDate: "2026-06-27", daysSinceContact: 9, status: "won", followedUp: true },
  { id: "Q-8820", customerId: "c-murdock", productId: "p-quartzite", repId: "r-liam", value: 7980, sentDate: "2026-06-30", daysSinceContact: 7, status: "won", followedUp: true },
  { id: "Q-8821", customerId: "c-glanbia", productId: "p-kilkenny", repId: "r-michael", value: 43050, sentDate: "2026-06-22", daysSinceContact: 10, status: "won", followedUp: true },
  { id: "Q-8822", customerId: "c-oreilly", productId: "p-quartzite", repId: "r-fintan", value: 780, sentDate: "2026-07-02", daysSinceContact: 5, status: "won", followedUp: true },
  { id: "Q-8823", customerId: "c-greenscape", productId: "p-indian", repId: "r-ciara", value: 8352, sentDate: "2026-06-29", daysSinceContact: 4, status: "won", followedUp: true },
  { id: "Q-8824", customerId: "c-chadwicks", productId: "p-indian", repId: "r-liam", value: 9744, sentDate: "2026-07-01", daysSinceContact: 6, status: "won", followedUp: true },

  // --- Lost (with reason) ---
  { id: "Q-8825", customerId: "c-glanbia", productId: "p-setts", repId: "r-liam", value: 10920, sentDate: "2026-06-24", daysSinceContact: 12, status: "lost", followedUp: true, lossReason: "Price" },
  { id: "Q-8826", customerId: "c-murdock", productId: "p-cobble", repId: "r-fintan", value: 5600, sentDate: "2026-06-26", daysSinceContact: 15, status: "lost", followedUp: false, lossReason: "No response" },
  { id: "Q-8827", customerId: "c-greenscape", productId: "p-g654", repId: "r-ciara", value: 13900, sentDate: "2026-06-21", daysSinceContact: 9, status: "lost", followedUp: true, lossReason: "Went elsewhere" },
  { id: "Q-8828", customerId: "c-donegalcc", productId: "p-granite-kerb", repId: "r-michael", value: 24800, sentDate: "2026-06-18", daysSinceContact: 20, status: "lost", followedUp: false, lossReason: "No response" },
  { id: "Q-8829", customerId: "c-chadwicks", productId: "p-quartzite", repId: "r-liam", value: 6900, sentDate: "2026-06-23", daysSinceContact: 11, status: "lost", followedUp: true, lossReason: "Timing" },
  { id: "Q-8830", customerId: "c-patrick", productId: "p-liscannor", repId: "r-fintan", value: 1980, sentDate: "2026-07-01", daysSinceContact: 8, status: "lost", followedUp: false, lossReason: "Price" },
];

/* ------------------------------------------------------------------ */
/*  Curated operational aggregates (dashboard charts)                  */
/*  Whole-operation throughput — larger than the 24 tracked orders.    */
/* ------------------------------------------------------------------ */

/** Tonnes out this month per quarry, with € equivalent for the toggle. */
export const tonnageByQuarry: { quarryId: string; tonnes: number; value: number }[] = [
  { quarryId: "q-mountcharles", tonnes: 1840, value: 174800 },
  { quarryId: "q-barnesmore", tonnes: 1220, value: 256200 },
  { quarryId: "q-croaghan", tonnes: 1560, value: 187200 },
  { quarryId: "q-glenties", tonnes: 980, value: 181300 },
  { quarryId: "q-bundoran", tonnes: 1130, value: 158200 },
];

/** Volume this month per product, with € equivalent for the toggle. */
export const volumeByProduct: { productId: string; tonnes: number; value: number }[] = [
  { productId: "p-quartzite", tonnes: 1640, value: 155800 },
  { productId: "p-kilkenny", tonnes: 720, value: 151200 },
  { productId: "p-liscannor", tonnes: 540, value: 99900 },
  { productId: "p-granite-kerb", tonnes: 1180, value: 141600 },
  { productId: "p-setts", tonnes: 860, value: 120400 },
  { productId: "p-indian", tonnes: 1420, value: 82360 },
  { productId: "p-g654", tonnes: 980, value: 66640 },
  { productId: "p-cobble", tonnes: 610, value: 53680 },
];

/** Tonnage dispatched Mon–Sun for the current week (Wed = today). */
export const weeklyDispatch: { day: string; date: string; tonnes: number }[] = [
  { day: "Mon", date: "2026-07-13", tonnes: 742 },
  { day: "Tue", date: "2026-07-14", tonnes: 861 },
  { day: "Wed", date: "2026-07-15", tonnes: 690 }, // today, in progress
  { day: "Thu", date: "2026-07-16", tonnes: 0 },
  { day: "Fri", date: "2026-07-17", tonnes: 0 },
  { day: "Sat", date: "2026-07-18", tonnes: 0 },
  { day: "Sun", date: "2026-07-19", tonnes: 0 },
];

/** "Number of the day" — tonnes dispatched today vs target. */
export const dispatchToday = {
  tonnes: 690,
  target: 780,
  /** Last 10 days of dispatch tonnage for the hero sparkline. */
  trend: [612, 705, 668, 742, 690, 803, 861, 690, 774, 690],
};

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                     */
/* ------------------------------------------------------------------ */

const byId = <T extends { id: string }>(arr: T[]) => {
  const m = new Map<string, T>();
  for (const item of arr) m.set(item.id, item);
  return m;
};

const quarryMap = byId(quarries);
const depotMap = byId(depots);
const productMap = byId(products);
const repMap = byId(reps);
const customerMap = byId(customers);
const orderMap = byId(orders);

export const getQuarry = (id: string) => quarryMap.get(id);
export const getDepot = (id: string) => depotMap.get(id);
export const getProduct = (id: string) => productMap.get(id);
export const getRep = (id: string) => repMap.get(id);
export const getCustomer = (id: string) => customerMap.get(id);
export const getOrder = (id: string) => orderMap.get(id);

/** Index of the order's current stage within its source's stage list. */
export function stageIndex(order: Order): number {
  return stagesForSource(order.source).indexOf(order.stage);
}

/** Origin label: quarry name (own) or port (import). */
export function orderOrigin(order: Order): string {
  if (order.source === "import") return order.originId ?? order.eta;
  const q = order.originId ? getQuarry(order.originId) : undefined;
  return q ? `${q.name} Quarry` : "Own quarry";
}

/** Public customer tracking URL (no internal data). */
export function customerTrackingUrl(order: Order): string {
  return `mcmonaglestone.ie/track/${order.trackingId}`;
}

/** Neutral stone stage-photo placeholder. */
export function stonePhoto(productId: string, w = 800, h = 600): string {
  const p = getProduct(productId);
  const seed = p?.imageSeed ?? productId;
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/* ------------------------------------------------------------------ */
/*  Derived selectors — keep pages consistent                          */
/* ------------------------------------------------------------------ */

export const isDelivered = (o: Order) => o.stage === "Delivered";
export const openOrders = orders.filter((o) => !isDelivered(o));

export const ordersAtRisk = orders.filter((o) => o.status === "at-risk");
export const ordersLate = orders.filter((o) => o.status === "late");
export const ordersPredictedSlip = orders.filter(
  (o) => o.predictedSlip && o.status === "on-time"
);

/** Total € value of orders not yet delivered. */
export const openOrderValue = openOrders.reduce((s, o) => s + o.value, 0);

/** Average days slipped across at-risk + late orders. */
export const avgDaysSlipped = (() => {
  const slipped = [...ordersAtRisk, ...ordersLate].filter((o) => o.daysSlipped);
  if (!slipped.length) return 0;
  const total = slipped.reduce((s, o) => s + (o.daysSlipped ?? 0), 0);
  return Math.round((total / slipped.length) * 10) / 10;
})();

export type DepotRow = {
  depotId: string;
  name: string;
  orders: number;
  tonnes: number;
  value: number;
};

/** Per-depot rollup of the tracked live orders. */
export const depotSummary: DepotRow[] = depots.map((d) => {
  const rows = orders.filter((o) => o.depotId === d.id);
  return {
    depotId: d.id,
    name: d.name,
    orders: rows.length,
    tonnes: Math.round(rows.reduce((s, o) => s + o.tonnage, 0)),
    value: rows.reduce((s, o) => s + o.value, 0),
  };
});

/* --- Pipeline selectors --- */

/** Open quote needs a follow-up nudge once 3+ days since contact. */
export const needsFollowUp = (q: Quote) =>
  q.status === "open" && q.daysSinceContact >= 3;

export const quotesOpenFresh = quotes.filter(
  (q) => q.status === "open" && q.daysSinceContact < 3
);
export const quotesNeedFollowUp = quotes.filter(needsFollowUp);
export const quotesCold = quotes
  .filter((q) => q.status === "cold")
  .sort((a, b) => b.value - a.value); // biggest leaks on top
export const quotesWon = quotes.filter((q) => q.status === "won");
export const quotesLost = quotes.filter((q) => q.status === "lost");

/** Open quote value = open + cold (still live, unconverted). */
export const openQuoteValue = quotes
  .filter((q) => q.status === "open" || q.status === "cold")
  .reduce((s, q) => s + q.value, 0);

export const quotesGoneColdCount = quotesCold.length;

/** Follow-up rate = quotes chased ÷ quotes that warranted chasing. */
export const followUpRate = (() => {
  const chaseable = quotes.filter(
    (q) => q.status !== "won" // won are closed; everything else warranted a chase
  );
  if (!chaseable.length) return 0;
  const chased = chaseable.filter((q) => q.followedUp).length;
  return Math.round((chased / chaseable.length) * 100);
})();

export const lossReasonsThisMonth: { reason: LossReason; count: number }[] = (() => {
  const order: LossReason[] = ["Price", "Timing", "Went elsewhere", "No response", "Other"];
  const counts = new Map<LossReason, number>();
  for (const r of order) counts.set(r, 0);
  for (const q of quotesLost) {
    if (q.lossReason) counts.set(q.lossReason, (counts.get(q.lossReason) ?? 0) + 1);
  }
  return order.map((reason) => ({ reason, count: counts.get(reason) ?? 0 }));
})();

export type RepPerformance = {
  repId: string;
  name: string;
  role: string;
  initials: string;
  sent: number;
  followedUp: number;
  won: number;
  followUpRate: number;
};

/** Per-rep sent vs followed-up vs won — the seller-vs-order-taker hint. */
export const repPerformance: RepPerformance[] = reps.map((rep) => {
  const mine = quotes.filter((q) => q.repId === rep.id);
  const sent = mine.length;
  const followedUp = mine.filter((q) => q.followedUp).length;
  const won = mine.filter((q) => q.status === "won").length;
  return {
    repId: rep.id,
    name: rep.name,
    role: rep.role,
    initials: rep.initials,
    sent,
    followedUp,
    won,
    followUpRate: sent ? Math.round((followedUp / sent) * 100) : 0,
  };
});

/* --- Dashboard KPI bundle --- */

export const dashboardKpis = {
  tonnesToday: dispatchToday.tonnes,
  tonnesTarget: dispatchToday.target,
  pctOfTarget: Math.round((dispatchToday.tonnes / dispatchToday.target) * 100),
  openOrderValue,
  quotesAwaitingFollowUp: quotesNeedFollowUp.length,
  ordersAtRisk: ordersAtRisk.length + ordersLate.length,
};

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

/** Exact euros, no decimals: 61950 → "€61,950". */
export function formatEuro(n: number): string {
  return `€${Math.round(n).toLocaleString("en-IE")}`;
}

/** Compact euros for big KPIs: 1250000 → "€1.25M", 47500 → "€47.5k". */
export function formatEuroShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `€${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `€${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `€${Math.round(n)}`;
}

/** Tonnes with thousands separators: 1840 → "1,840 t", 2.4 → "2.4 t". */
export function formatTonnes(n: number): string {
  const rounded = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  return `${rounded.toLocaleString("en-IE")} t`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO date → "24 Jul". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]}`;
}

/** ISO date → "24 Jul 2026". */
export function formatDateLong(iso: string): string {
  const [y] = iso.split("-").map(Number);
  return `${formatDate(iso)} ${y}`;
}

/** ISO date → "July 2026". */
export function formatMonthLong(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const full = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${full[m - 1]} ${y}`;
}

/* ----------------------------- Report archive ---------------------------- */

export type ReportStatus = "final" | "issued" | "draft";

export interface MonthlyReport {
  id: string;
  /** First day of the reported month, e.g. "2026-06-01". */
  month: string;
  tonnes: number;
  revenue: number;
  ownPct: number;
  conversionPct: number;
  quotes: number;
  orders: number;
  status: ReportStatus;
  /** Signed-off by / prepared by. */
  by: string;
}

/**
 * A long back-catalogue of closed-off monthly reports, generated deterministically
 * so figures stay stable across renders. Runs from the current month backwards.
 * Seasonal: quarry output dips through the Donegal winter, lifts through summer.
 */
export const reportArchive: MonthlyReport[] = (() => {
  // Deterministic hash → 0..1, seeded per month so there is no Math.random at build.
  const rand = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const preparers = ["N. Doherty", "S. Gallagher", "C. Boyle", "M. Sweeney"];

  const [ty, tm] = TODAY.split("-").map(Number);
  const MONTHS_BACK = 30;

  const rows: MonthlyReport[] = [];
  for (let i = 1; i <= MONTHS_BACK; i++) {
    // Walk back i months from the current month.
    let y = ty;
    let m = tm - i;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    const seed = y * 100 + m;
    // Seasonal factor: peak Jun–Aug, trough Dec–Feb.
    const season = 0.82 + 0.22 * Math.sin(((m - 4) / 12) * 2 * Math.PI);
    // Mild year-on-year growth going forward (older months slightly lower).
    const trend = 1 - i * 0.006;
    const jitter = 0.92 + rand(seed) * 0.16;

    const tonnes = Math.round((6730 * season * trend * jitter) / 10) * 10;
    const eurPerT = 138 + Math.round(rand(seed + 7) * 20);
    const revenue = Math.round((tonnes * eurPerT) / 100) * 100;
    const ownPct = 58 + Math.round(rand(seed + 3) * 14);
    const conversionPct = 44 + Math.round(rand(seed + 5) * 20);
    const quotes = 30 + Math.round(rand(seed + 9) * 26);
    const orders = 110 + Math.round(rand(seed + 11) * 70);

    rows.push({
      id: `rep-${y}-${String(m).padStart(2, "0")}`,
      month: `${y}-${String(m).padStart(2, "0")}-01`,
      tonnes,
      revenue,
      ownPct,
      conversionPct,
      quotes,
      orders,
      status: i === 1 ? "issued" : "final",
      by: preparers[seed % preparers.length],
    });
  }
  return rows;
})();

/** Rolling totals across the whole archive, for the log header strip. */
export const reportArchiveTotals = {
  months: reportArchive.length,
  tonnes: reportArchive.reduce((s, r) => s + r.tonnes, 0),
  revenue: reportArchive.reduce((s, r) => s + r.revenue, 0),
};

/* ------------------------------------------------------------------ */
/*  Stock & inventory                                                  */
/*  Own-quarry stock has historically been the blind spot (imports get */
/*  a shipping trail; own stone never had visibility until now).       */
/* ------------------------------------------------------------------ */

export type StockLevel = {
  productId: string;
  depotId: string;
  onHand: number; // tonnes
  capacity: number; // tonnes
  reorderPoint: number; // tonnes
  lastRestock: string; // ISO date
};

export const stockLevels: StockLevel[] = [
  { productId: "p-quartzite", depotId: "d-donegal", onHand: 420, capacity: 900, reorderPoint: 300, lastRestock: "2026-07-10" },
  { productId: "p-kilkenny", depotId: "d-donegal", onHand: 180, capacity: 600, reorderPoint: 220, lastRestock: "2026-06-29" },
  { productId: "p-liscannor", depotId: "d-donegal", onHand: 96, capacity: 500, reorderPoint: 150, lastRestock: "2026-06-24" },
  { productId: "p-granite-kerb", depotId: "d-donegal", onHand: 340, capacity: 700, reorderPoint: 250, lastRestock: "2026-07-08" },
  { productId: "p-setts", depotId: "d-donegal", onHand: 210, capacity: 550, reorderPoint: 180, lastRestock: "2026-07-05" },
  { productId: "p-indian", depotId: "d-dublin", onHand: 88, capacity: 400, reorderPoint: 150, lastRestock: "2026-06-20" },
  { productId: "p-g654", depotId: "d-cork", onHand: 260, capacity: 500, reorderPoint: 200, lastRestock: "2026-07-01" },
  { productId: "p-cobble", depotId: "d-dublin", onHand: 150, capacity: 350, reorderPoint: 120, lastRestock: "2026-07-03" },
];

export type StockRow = StockLevel & {
  product: Product;
  pct: number; // onHand / capacity, 0-100
  belowReorder: boolean;
  weeklyConsumption: number;
  runOutWeeks: number;
};

/** Weekly draw-down estimated from this month's volume (tonnes/mo ÷ 4.33). */
function weeklyConsumptionFor(productId: string): number {
  const row = volumeByProduct.find((v) => v.productId === productId);
  return row ? row.tonnes / 4.33 : 0;
}

export const stockRows: StockRow[] = stockLevels.map((s) => {
  const product = getProduct(s.productId)!;
  const weeklyConsumption = weeklyConsumptionFor(s.productId);
  return {
    ...s,
    product,
    pct: Math.round((s.onHand / s.capacity) * 100),
    belowReorder: s.onHand < s.reorderPoint,
    weeklyConsumption,
    runOutWeeks: weeklyConsumption > 0 ? Math.round((s.onHand / weeklyConsumption) * 10) / 10 : Infinity,
  };
});

export const stockOwnRows = stockRows.filter((r) => r.product.origin === "own");
export const stockImportRows = stockRows.filter((r) => r.product.origin === "import");
export const stockBelowReorder = stockRows.filter((r) => r.belowReorder);
export const stockTotalTonnesOnHand = stockRows.reduce((s, r) => s + r.onHand, 0);

/* ------------------------------------------------------------------ */
/*  Production yield                                                   */
/*  Tonnage in (raw block) vs tonnage out (finished, saleable stone).  */
/* ------------------------------------------------------------------ */

export type QualityFlag = "good" | "fair" | "poor";

export type ProductionLoad = {
  id: string;
  quarryId: string;
  productId: string;
  date: string; // ISO
  tonnesIn: number;
  tonnesOut: number;
  qualityFlag: QualityFlag;
  note?: string;
};

export const productionLoads: ProductionLoad[] = [
  { id: "PL-101", quarryId: "q-mountcharles", productId: "p-quartzite", date: "2026-07-05", tonnesIn: 40, tonnesOut: 34, qualityFlag: "good", note: "Clean run, standard block size." },
  { id: "PL-102", quarryId: "q-barnesmore", productId: "p-kilkenny", date: "2026-07-06", tonnesIn: 32, tonnesOut: 21, qualityFlag: "poor", note: "Digger loaded gravel in with the block, high reject rate." },
  { id: "PL-103", quarryId: "q-glenties", productId: "p-liscannor", date: "2026-07-07", tonnesIn: 26, tonnesOut: 19, qualityFlag: "fair", note: "Some colour variation through the seam." },
  { id: "PL-104", quarryId: "q-croaghan", productId: "p-granite-kerb", date: "2026-07-08", tonnesIn: 38, tonnesOut: 33, qualityFlag: "good" },
  { id: "PL-105", quarryId: "q-bundoran", productId: "p-setts", date: "2026-07-09", tonnesIn: 24, tonnesOut: 20, qualityFlag: "good" },
  { id: "PL-106", quarryId: "q-mountcharles", productId: "p-quartzite", date: "2026-07-10", tonnesIn: 36, tonnesOut: 30, qualityFlag: "good" },
  { id: "PL-107", quarryId: "q-barnesmore", productId: "p-kilkenny", date: "2026-07-11", tonnesIn: 30, tonnesOut: 24, qualityFlag: "fair" },
  { id: "PL-108", quarryId: "q-glenties", productId: "p-liscannor", date: "2026-07-12", tonnesIn: 28, tonnesOut: 11, qualityFlag: "poor", note: "Fault line ran through most of the block, heavy reject." },
  { id: "PL-109", quarryId: "q-croaghan", productId: "p-granite-kerb", date: "2026-07-13", tonnesIn: 34, tonnesOut: 29, qualityFlag: "good" },
  { id: "PL-110", quarryId: "q-bundoran", productId: "p-setts", date: "2026-07-14", tonnesIn: 22, tonnesOut: 18, qualityFlag: "fair" },
  { id: "PL-111", quarryId: "q-mountcharles", productId: "p-quartzite", date: "2026-07-15", tonnesIn: 30, tonnesOut: 26, qualityFlag: "good" },
];

export type ProductionRow = ProductionLoad & {
  quarry: Quarry;
  product: Product;
  yieldPct: number;
};

export const productionRows: ProductionRow[] = productionLoads.map((l) => ({
  ...l,
  quarry: getQuarry(l.quarryId)!,
  product: getProduct(l.productId)!,
  yieldPct: Math.round((l.tonnesOut / l.tonnesIn) * 100),
}));

export const yieldByDay: { date: string; yieldPct: number }[] = productionRows.map((r) => ({
  date: r.date,
  yieldPct: r.yieldPct,
}));

export const avgYieldPct = Math.round(
  productionRows.reduce((s, r) => s + r.yieldPct, 0) / productionRows.length
);

export const worstLoad = [...productionRows].sort((a, b) => a.yieldPct - b.yieldPct)[0];
export const bestLoad = [...productionRows].sort((a, b) => b.yieldPct - a.yieldPct)[0];

/* ------------------------------------------------------------------ */
/*  Risk factors                                                       */
/*  Named external conditions driving delay/cost risk, replacing the   */
/*  plain predictedSlip boolean with something a composite score can   */
/*  be built from.                                                     */
/* ------------------------------------------------------------------ */

export type RiskCategory = "Tariffs" | "Freight" | "Seasonal demand" | "Weather";

export type RiskFactor = {
  id: string;
  name: string;
  category: RiskCategory;
  severity: number; // 0-100
  note: string;
  affectedProductIds: string[];
};

export const riskFactors: RiskFactor[] = [
  {
    id: "rf-tariffs",
    name: "US tariff realignment",
    category: "Tariffs",
    severity: 62,
    note: "American warehouses emptied early in the year are now restocking in volume, much of it routed through the same European ports we import through.",
    affectedProductIds: ["p-indian", "p-g654", "p-cobble"],
  },
  {
    id: "rf-freight",
    name: "Freight cost spike",
    category: "Freight",
    severity: 74,
    note: "Shipping lines are using the wider Middle East disruption to hold rates high on any lane touching the region, ours included.",
    affectedProductIds: ["p-indian", "p-g654", "p-cobble"],
  },
  {
    id: "rf-season",
    name: "Early Christmas stock pull-forward",
    category: "Seasonal demand",
    severity: 58,
    note: "Wholesale buyers moved their Christmas stock bookings earlier than usual this year, congesting the lines we use from late May.",
    affectedProductIds: ["p-indian", "p-cobble"],
  },
  {
    id: "rf-weather",
    name: "Wet-week quarry output",
    category: "Weather",
    severity: 35,
    note: "A run of wet weather slows both extraction and yard haulage across the Donegal quarries.",
    affectedProductIds: ["p-liscannor", "p-kilkenny", "p-setts"],
  },
];

export type RiskAssessment = {
  score: number; // 0-100
  factors: RiskFactor[];
};

/** Composite risk score for an order: factor severity plus current slip state. */
export function riskScoreFor(order: Order): RiskAssessment {
  const factors = riskFactors.filter((f) => f.affectedProductIds.includes(order.productId));
  if (factors.length === 0) return { score: 0, factors: [] };

  const avgSeverity = factors.reduce((s, f) => s + f.severity, 0) / factors.length;
  const stateBump = order.status === "late" ? 20 : order.status === "at-risk" ? 12 : order.predictedSlip ? 8 : 0;
  const score = Math.min(100, Math.round(avgSeverity * 0.6 + stateBump));

  return { score, factors };
}

/* ------------------------------------------------------------------ */
/*  Integrations (Sage 200 / Sycon)                                    */
/* ------------------------------------------------------------------ */

export type IntegrationStatus = "connected" | "syncing" | "error";

export type Integration = {
  id: string;
  name: string;
  category: "Accounting" | "Warehouse" | "CRM";
  status: IntegrationStatus;
  lastSynced: string;
  recordsSynced: number;
};

export const integrations: Integration[] = [
  { id: "int-sage200", name: "Sage 200", category: "Accounting", status: "connected", lastSynced: "Today 06:15", recordsSynced: 1842 },
  { id: "int-sycon-wh", name: "Sycon Warehousing", category: "Warehouse", status: "connected", lastSynced: "Today 06:15", recordsSynced: 640 },
  { id: "int-sycon-crm", name: "Sycon CRM", category: "CRM", status: "connected", lastSynced: "Yesterday 22:40", recordsSynced: 214 },
];

/* ------------------------------------------------------------------ */
/*  Automation log (Pipeline)                                          */
/*  Follow-up reminders auto-triggered by quote stage, derived from the */
/*  same quotes/needsFollowUp data Pipeline already shows.              */
/* ------------------------------------------------------------------ */

export type AutomationEvent = {
  id: string;
  quoteId: string;
  customerName: string;
  trigger: string;
  action: string;
  repName: string;
};

export const automationEvents: AutomationEvent[] = [...quotesNeedFollowUp, ...quotesCold]
  .sort((a, b) => b.daysSinceContact - a.daysSinceContact)
  .slice(0, 8)
  .map((q) => {
    const customer = getCustomer(q.customerId);
    const rep = getRep(q.repId);
    const cold = q.status === "cold";
    return {
      id: `auto-${q.id}`,
      quoteId: q.id,
      customerName: customer?.name ?? q.id,
      trigger: cold
        ? `Crossed ${q.daysSinceContact} days with no contact`
        : `${q.daysSinceContact} days since last contact`,
      action: cold
        ? `Escalation flagged for ${rep?.name ?? "rep"}`
        : `Reminder queued for ${rep?.name ?? "rep"}`,
      repName: rep?.name ?? "Unassigned",
    };
  });

/* ------------------------------------------------------------------ */
/*  Invoices owed (accounts) — feeds the morning briefing               */
/* ------------------------------------------------------------------ */

export type InvoiceOwed = {
  id: string;
  customerId: string;
  amount: number;
  daysOverdue: number;
};

export const invoicesOwed: InvoiceOwed[] = [
  { id: "INV-3301", customerId: "c-chadwicks", amount: 8200, daysOverdue: 12 },
  { id: "INV-3288", customerId: "c-donegalcc", amount: 15400, daysOverdue: 5 },
  { id: "INV-3312", customerId: "c-greenscape", amount: 3100, daysOverdue: 74 },
  { id: "INV-3320", customerId: "c-murdock", amount: 640, daysOverdue: 3 },
  { id: "INV-3295", customerId: "c-glanbia", amount: 2200, daysOverdue: 45 },
];

export const totalInvoicesOwed = invoicesOwed.reduce((s, i) => s + i.amount, 0);

/* ------------------------------------------------------------------ */
/*  Accounting — Sage-style snapshot: cash, P&L, debtors, creditors, VAT */
/*  Figures are month-to-date (through 15 Jul), consistent with the     */
/*  tonnage/revenue pace already established in reportArchive.          */
/* ------------------------------------------------------------------ */

export type ExpenseCategory = {
  name: string;
  amount: number;
};

/** Direct cost of stone produced/imported this month — quarry labour, blasting, primary haulage, freight. */
export const cogsMTD = 258_500;

/** Everything else it costs to run the business, month to date. */
export const expenseCategoriesMTD: ExpenseCategory[] = [
  { name: "Wages (office & sales)", amount: 34_200 },
  { name: "Vehicle & haulage fleet", amount: 22_400 },
  { name: "Plant & equipment hire", amount: 11_600 },
  { name: "Insurance", amount: 8_100 },
  { name: "Admin & marketing", amount: 5_300 },
  { name: "Professional fees", amount: 3_800 },
];

export const totalOperatingExpensesMTD = expenseCategoriesMTD.reduce(
  (s, e) => s + e.amount,
  0
);

export const revenueMTD = 431_600;
export const revenueLastMonth = reportArchive[0].revenue;

export const grossProfitMTD = revenueMTD - cogsMTD;
export const grossMarginPctMTD = Math.round((grossProfitMTD / revenueMTD) * 100);
export const netProfitMTD = grossProfitMTD - totalOperatingExpensesMTD;
export const netMarginPctMTD = Math.round((netProfitMTD / revenueMTD) * 100);

/** Irish standard VAT rate, applied to sales out and cost in. */
const VAT_RATE = 0.23;
export const vatOnSalesMTD = Math.round(revenueMTD * VAT_RATE);
export const vatReclaimableMTD = Math.round(
  (cogsMTD + totalOperatingExpensesMTD) * VAT_RATE
);
export const vatDueMTD = vatOnSalesMTD - vatReclaimableMTD;
export const vatPeriodLabel = "Jul–Aug 2026";
export const vatDueDate = "2026-09-19";

export type AgingBucket = "current" | "1-30" | "31-60" | "61-90" | "90+";

export const agingBucketOrder: AgingBucket[] = [
  "current",
  "1-30",
  "31-60",
  "61-90",
  "90+",
];

export function agingBucket(daysOverdue: number): AgingBucket {
  if (daysOverdue <= 0) return "current";
  if (daysOverdue <= 30) return "1-30";
  if (daysOverdue <= 60) return "31-60";
  if (daysOverdue <= 90) return "61-90";
  return "90+";
}

/** Money owed to us, grouped into the standard aging buckets. */
export const debtorsAging: Record<AgingBucket, number> = (() => {
  const buckets: Record<AgingBucket, number> = {
    current: 0,
    "1-30": 0,
    "31-60": 0,
    "61-90": 0,
    "90+": 0,
  };
  for (const inv of invoicesOwed) {
    buckets[agingBucket(inv.daysOverdue)] += inv.amount;
  }
  return buckets;
})();

export type SupplierBill = {
  id: string;
  supplier: string;
  amount: number;
  /** Negative = not yet due. */
  daysOverdue: number;
};

/** Money we owe — quarry contractors and haulage/fuel suppliers. */
export const supplierBills: SupplierBill[] = [
  { id: "PO-2201", supplier: "Errigal Haulage Ltd", amount: 12_400, daysOverdue: 4 },
  { id: "PO-2214", supplier: "Cassidy Plant Hire", amount: 6_800, daysOverdue: -6 },
  { id: "PO-2198", supplier: "Dublin Port Handling", amount: 9_100, daysOverdue: 18 },
  { id: "PO-2220", supplier: "Sweeney Fuels", amount: 5_300, daysOverdue: -2 },
  { id: "PO-2205", supplier: "Ulster Explosives Co", amount: 3_900, daysOverdue: 11 },
];

export const totalCreditors = supplierBills.reduce((s, b) => s + b.amount, 0);
export const overdueCreditors = supplierBills
  .filter((b) => b.daysOverdue > 0)
  .reduce((s, b) => s + b.amount, 0);

export const bankBalance = 246_800;
/** Last 8 weeks, Mon close of business. */
export const bankBalanceTrend = [
  198_200, 211_400, 205_900, 219_300, 228_100, 221_600, 238_400, 246_800,
];

/* ------------------------------------------------------------------ */
/*  Daily / morning briefing                                           */
/*  Computed once from the selectors above — no new raw data.          */
/* ------------------------------------------------------------------ */

export const dailyBriefing = {
  date: TODAY,
  stockAlerts: stockBelowReorder,
  atSea: {
    count: orders.filter((o) => o.source === "import" && !isDelivered(o)).length,
    tonnes: orders
      .filter((o) => o.source === "import" && !isDelivered(o))
      .reduce((s, o) => s + o.tonnage, 0),
  },
  invoicesOwedTotal: totalInvoicesOwed,
  invoicesOwedCount: invoicesOwed.length,
  topRisk: [...riskFactors].sort((a, b) => b.severity - a.severity)[0],
  tonnesToday: dispatchToday.tonnes,
  tonnesTarget: dispatchToday.target,
  openOrderValue,
  quotesAwaitingFollowUp: quotesNeedFollowUp.length,
  avgYieldPct,
};

/* ------------------------------------------------------------------ */
/*  Rep detail (Team drill-in)                                         */
/* ------------------------------------------------------------------ */

export function getRepDetail(repId: string) {
  const rep = getRep(repId);
  if (!rep) return undefined;

  const myQuotes = quotes.filter((q) => q.repId === repId);
  const myOrders = orders.filter((o) => o.repId === repId);
  const openMine = myOrders.filter((o) => !isDelivered(o));
  const wonValue = myQuotes
    .filter((q) => q.status === "won")
    .reduce((s, q) => s + q.value, 0);
  const openValue = openMine.reduce((s, o) => s + o.value, 0);
  const sent = myQuotes.length;
  const followedUp = myQuotes.filter((q) => q.followedUp).length;
  const followUpRate = sent ? Math.round((followedUp / sent) * 100) : 0;

  // Deterministic 8-week follow-up trend, seeded off the rep id so it never
  // changes between renders but differs per person.
  const seed = repId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const rand = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const trend = Array.from({ length: 8 }, (_, i) => {
    const jitter = Math.round((rand(seed + i) - 0.5) * 24);
    return Math.max(10, Math.min(100, followUpRate + jitter));
  });

  return {
    rep,
    quotes: myQuotes,
    orders: myOrders,
    openOrders: openMine,
    wonValue,
    openValue,
    sent,
    followedUp,
    followUpRate,
    trend,
  };
}
