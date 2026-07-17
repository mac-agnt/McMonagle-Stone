"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Package, FunnelSimple, Boat, X } from "@phosphor-icons/react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ToastTone = "accent" | "success" | "warning";

const events = [
  {
    icon: Package,
    tone: "accent" as ToastTone,
    title: "Chadwicks · Raj Green",
    detail: "Moved to Dispatched, Dublin depot.",
  },
  {
    icon: FunnelSimple,
    tone: "success" as ToastTone,
    title: "GreenScape quote followed up",
    detail: "Ciara logged a chase. Clock reset to zero.",
  },
  {
    icon: Boat,
    tone: "accent" as ToastTone,
    title: "Container landed · Dublin",
    detail: "132 t off MS-4413 checked in at the port.",
  },
  {
    icon: Package,
    tone: "warning" as ToastTone,
    title: "Croaghan Hill running behind",
    detail: "Granite kerb run is tracking two days late.",
  },
];

const toneTile: Record<ToastTone, string> = {
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

const CYCLE_MS = 12_000;
const VISIBLE_MS = 6_000;

/**
 * The "this thing is live" tell. Cycles yard events past the corner every
 * twelve seconds. Dismissing stops it for the rest of the session, and reduced
 * motion turns it off entirely rather than flashing content in.
 */
export function LiveToast() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || reduce) return;

    let hideTimer: number;
    const show = () => {
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    };

    const firstTimer = window.setTimeout(show, 4_000);
    const cycle = window.setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
      show();
    }, CYCLE_MS);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(cycle);
    };
  }, [dismissed, reduce]);

  const event = events[index];
  const Icon = event.icon;

  // `wait` so a cycling toast never renders on top of the one it replaces.
  return (
    <AnimatePresence mode="wait">
      {visible && !dismissed && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3, ease }}
          className="fixed bottom-20 right-4 z-40 flex w-[min(320px,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-border bg-surface px-3.5 py-3 shadow-[0_18px_44px_-18px_rgba(15,23,42,0.45)] sm:bottom-24 sm:right-6"
        >
          <span
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px]",
              toneTile[event.tone]
            )}
          >
            <Icon size={15} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-ink">
              {event.title}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">
              {event.detail}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss updates"
            className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
          >
            <X size={12} weight="bold" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
