"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import type { LossReason } from "@/lib/mockData";

const REASONS: LossReason[] = [
  "Price",
  "Timing",
  "Went elsewhere",
  "No response",
  "Other",
];

/**
 * "Mark lost" action with a small inline menu. A loss reason is required
 * before the quote is moved to Lost, so nothing drops off unlabelled.
 */
export function MarkLostMenu({
  onSelect,
}: {
  onSelect: (reason: LossReason) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="danger-outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Mark lost
        <CaretDown size={12} weight="bold" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-[10px] border border-border bg-surface-raised p-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.28)]"
          >
            <p className="px-2.5 py-1.5 text-[11px] font-medium text-ink-faint">
              Reason for loss
            </p>
            {REASONS.map((reason) => (
              <button
                key={reason}
                role="menuitem"
                onClick={() => {
                  onSelect(reason);
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-[8px] px-2.5 py-1.5 text-left text-[12.5px] text-ink-muted transition-colors hover:bg-border-soft hover:text-ink"
              >
                {reason}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
