import type { AppKey } from "@/components/icons/AppLogo";

export type PushNotification = {
  id: string;
  app: AppKey;
  appLabel: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

/**
 * The feed Daniel actually gets. Stage moves and quote chases come from the
 * system itself; the WhatsApp at the top is the whole problem in one line, a
 * customer asking where their stone is because nobody told them.
 */
export const notifications: PushNotification[] = [
  {
    id: "n1",
    app: "whatsapp",
    appLabel: "WhatsApp",
    title: "Murdock Builders",
    detail: "Any update on our kerb order?",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    app: "mcmonagle",
    appLabel: "Order tracker",
    title: "MS-4419 moved to At Port",
    detail: "Indian Sandstone (Raj Green) for Chadwicks, 168 t at Dublin Port.",
    time: "14m ago",
    unread: true,
  },
  {
    id: "n3",
    app: "gmail",
    appLabel: "Gmail",
    title: "GreenScape Contractors",
    detail: "Quote followed up. €15,600 on Chinese Granite G654, clock reset.",
    time: "38m ago",
    unread: false,
  },
  {
    id: "n4",
    app: "mcmonagle",
    appLabel: "Arrivals",
    title: "Shipment landed",
    detail: "Dublin depot checked in 132 t off MS-4413.",
    time: "1h ago",
    unread: false,
  },
  {
    id: "n5",
    app: "aib",
    appLabel: "AIB",
    title: "Payment received",
    detail: "Donegal County Council paid invoice 4408 for €22,560.",
    time: "2h ago",
    unread: false,
  },
];
