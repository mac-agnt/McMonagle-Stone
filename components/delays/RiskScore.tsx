import { cn } from "@/lib/cn";

/** Tone-graded composite risk chip, 0-100. */
export function RiskScore({ score, className }: { score: number; className?: string }) {
  const toneClass =
    score >= 65
      ? "bg-danger/15 text-danger"
      : score >= 35
        ? "bg-warning/15 text-warning"
        : "bg-border-soft text-ink-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold tabular-nums",
        toneClass,
        className
      )}
    >
      Risk {score}
    </span>
  );
}
