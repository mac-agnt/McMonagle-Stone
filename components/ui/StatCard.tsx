"use client";

import type { Icon } from "@phosphor-icons/react";
import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react";
import { Card } from "./Card";
import { Sparkline } from "./Sparkline";
import { LiveDot } from "./LiveDot";
import { cn } from "@/lib/cn";

type ValueTone = "ink" | "accent" | "danger" | "success";

const valueToneClass: Record<ValueTone, string> = {
  ink: "text-ink",
  accent: "text-accent",
  danger: "text-danger",
  success: "text-success",
};

/** Standard stat card: icon tile, big value, label, optional delta/spark/live. */
export function StatCard({
  icon: IconEl,
  label,
  value,
  hint,
  valueTone = "ink",
  delta,
  spark,
  live = false,
  className,
}: {
  icon: Icon;
  label: string;
  value: string | number;
  hint?: string;
  valueTone?: ValueTone;
  delta?: { label: string; positive: boolean };
  spark?: number[];
  live?: boolean;
  className?: string;
}) {
  const DeltaIcon = delta?.positive ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
          <IconEl size={17} weight="fill" />
        </span>
        {live ? (
          <LiveDot />
        ) : delta ? (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
              delta.positive
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
            )}
          >
            <DeltaIcon size={12} weight="bold" />
            {delta.label}
          </span>
        ) : null}
      </div>

      <div>
        <p
          className={cn(
            "text-2xl font-semibold tracking-tight tabular-nums",
            valueToneClass[valueTone]
          )}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[12.5px] text-ink-faint">{label}</p>
        {hint && <p className="mt-1 text-[11.5px] text-ink-muted">{hint}</p>}
      </div>

      {spark && (
        <Sparkline
          data={spark}
          color={
            valueTone === "danger"
              ? "var(--color-danger)"
              : valueTone === "success"
                ? "var(--color-success)"
                : "var(--color-accent)"
          }
        />
      )}
    </Card>
  );
}
