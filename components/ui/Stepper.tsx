"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/** Numeric +/- control matching the rounded-[10px] input family. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  suffix,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 100) / 100));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 100) / 100));

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1 rounded-[10px] border border-border bg-bg px-1.5",
        className
      )}
    >
      <button
        type="button"
        onClick={dec}
        aria-label="Decrease"
        className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
      >
        <Minus size={14} weight="bold" />
      </button>
      <span className="flex-1 text-center text-[13.5px] font-medium tabular-nums text-ink">
        {value}
        {suffix ? ` ${suffix}` : ""}
      </span>
      <button
        type="button"
        onClick={inc}
        aria-label="Increase"
        className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  );
}
