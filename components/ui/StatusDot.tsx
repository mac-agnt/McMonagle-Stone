import { cn } from "@/lib/cn";

export type DeliveryStatus = "on-time" | "at-risk" | "late";

const dotClass: Record<DeliveryStatus, string> = {
  "on-time": "bg-success",
  "at-risk": "bg-warning",
  late: "bg-danger",
};

const textClass: Record<DeliveryStatus, string> = {
  "on-time": "text-success",
  "at-risk": "text-warning",
  late: "text-danger",
};

const label: Record<DeliveryStatus, string> = {
  "on-time": "On time",
  "at-risk": "At risk",
  late: "Late",
};

/** Coloured delivery-status dot (green on-time, amber at-risk, red late). */
export function StatusDot({
  status,
  showLabel = false,
  pulse = false,
  className,
}: {
  status: DeliveryStatus;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          dotClass[status],
          pulse && "animate-pulse-dot"
        )}
      />
      {showLabel && (
        <span className={cn("text-[12px] font-medium", textClass[status])}>
          {label[status]}
        </span>
      )}
    </span>
  );
}

export const statusLabel = label;
