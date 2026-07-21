import { cn } from "@/lib/cn";

export type ActivityTone = "accent" | "warning" | "danger" | "neutral";

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone?: ActivityTone;
};

const dotTone: Record<ActivityTone, string> = {
  accent: "bg-accent",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-ink-faint",
};

/** Dot + connector vertical timeline, matching the OrderDrawer stage list. */
export function ActivityLog({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 size-2 shrink-0 rounded-full",
                  dotTone[item.tone ?? "neutral"]
                )}
              />
              {!last && <span className="my-1 w-px flex-1 bg-border-soft" />}
            </div>
            <div className={cn("pb-4", last && "pb-0")}>
              <p className="text-[12.5px] font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] text-ink-faint">{item.meta}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
