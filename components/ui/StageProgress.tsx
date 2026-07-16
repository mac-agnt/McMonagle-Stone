import { cn } from "@/lib/cn";

/**
 * Horizontal stage-progress indicator.
 * Completed segments = sand, current = bright sand, future = faint.
 * Pass the full ordered stage list for the order's source.
 */
export function StageProgress({
  stages,
  currentIndex,
  showLabel = false,
  className,
}: {
  stages: readonly string[];
  currentIndex: number;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1">
        {stages.map((stage, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          return (
            <span
              key={stage}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                current && "bg-accent",
                done && "bg-accent/50",
                !done && !current && "bg-border-soft"
              )}
            />
          );
        })}
      </div>
      {showLabel && (
        <div className="flex items-center justify-between text-[11px] text-ink-faint">
          <span className="font-medium text-accent-strong">
            {stages[currentIndex]}
          </span>
          <span>
            {currentIndex + 1}/{stages.length}
          </span>
        </div>
      )}
    </div>
  );
}
