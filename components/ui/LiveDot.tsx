import { cn } from "@/lib/cn";

/** "Live" indicator matching the Home Recent Activity card. */
export function LiveDot({
  label = "Live",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
      {label}
    </span>
  );
}
