"use client";

import { useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  Check,
  Copy,
  MapPin,
  Warehouse,
  Clock,
  UserCircle,
  Stack,
  Eye,
} from "@phosphor-icons/react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { LandedCostStrip } from "@/components/orders/LandedCostStrip";
import { cn } from "@/lib/cn";
import {
  getCustomer,
  getProduct,
  getDepot,
  getRep,
  stagesForSource,
  stageIndex,
  orderOrigin,
  customerTrackingUrl,
  stonePhoto,
  formatTonnes,
  formatEuro,
  formatDate,
  formatDateLong,
  type Order,
} from "@/lib/mockData";

export function OrderDrawer({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} labelledBy="order-drawer-title">
      {order ? <OrderDetail order={order} /> : null}
    </Drawer>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  const depot = getDepot(order.depotId);
  const rep = getRep(order.repId);
  const stages = stagesForSource(order.source);
  const currentIndex = stageIndex(order);
  const url = customerTrackingUrl(order);

  const originLabel =
    order.source === "import"
      ? `Import via ${orderOrigin(order)}`
      : orderOrigin(order);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border-soft px-6 pb-5 pt-6">
        <div className="flex items-center gap-2 pr-10">
          <span className="font-mono text-[12px] text-ink-faint">
            {order.id}
          </span>
          <Badge tone={order.type === "trade" ? "neutral" : "accent"}>
            {order.type === "trade" ? "Trade" : "B2C"}
          </Badge>
        </div>
        <h2
          id="order-drawer-title"
          className="mt-2 text-[19px] font-light tracking-tight text-ink"
        >
          {customer?.name ?? "Unknown customer"}
        </h2>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          {product?.name ?? "Product"}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <StatusDot status={order.status} showLabel />
          {order.status !== "on-time" && order.delayReason ? (
            <span className="text-[12px] text-ink-faint">
              {order.delayReason}
              {order.daysSlipped
                ? ` (${order.daysSlipped} day${
                    order.daysSlipped === 1 ? "" : "s"
                  } slipped)`
                : ""}
            </span>
          ) : order.predictedSlip ? (
            <span className="text-[12px] text-warning">
              Forecast to slip ({order.predictedReason})
            </span>
          ) : null}
        </div>
      </div>

      {/* Vertical stage timeline */}
      <div className="px-6 py-5">
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          Stage timeline
        </h3>
        <ol className="flex flex-col">
          {stages.map((stage, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            const last = i === stages.length - 1;
            return (
              <li key={stage} className="flex gap-3">
                {/* Dot + connector */}
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full",
                      done && "bg-accent/50",
                      current && "bg-accent animate-pulse-dot",
                      !done && !current && "border border-border bg-surface"
                    )}
                  >
                    {done && (
                      <Check
                        size={8}
                        weight="bold"
                        className="text-accent-ink"
                      />
                    )}
                  </span>
                  {!last && (
                    <span
                      className={cn(
                        "my-1 w-px flex-1",
                        i < currentIndex ? "bg-accent/40" : "bg-border-soft"
                      )}
                    />
                  )}
                </div>
                {/* Label */}
                <div className={cn("pb-5", last && "pb-0")}>
                  <p
                    className={cn(
                      "text-[13px] leading-none",
                      current
                        ? "font-semibold text-ink"
                        : done
                          ? "font-medium text-ink-muted"
                          : "text-ink-faint"
                    )}
                  >
                    {stage}
                  </p>
                  {current && (
                    <p className="mt-1.5 text-[11.5px] text-accent-strong">
                      Current stage
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Meta */}
      <div className="border-t border-border-soft px-6 py-5">
        <div className="grid grid-cols-1 gap-y-3">
          <MetaRow
            icon={Clock}
            label="Delivery ETA"
            value={formatDateLong(order.eta)}
            note={
              order.eta !== order.originalEta
                ? `was ${formatDate(order.originalEta)}`
                : undefined
            }
          />
          <MetaRow icon={MapPin} label="Origin" value={originLabel} />
          <MetaRow
            icon={Warehouse}
            label="Depot"
            value={depot ? `${depot.name} depot` : "Not assigned"}
          />
          <MetaRow
            icon={Stack}
            label="Tonnage / value"
            value={`${formatTonnes(order.tonnage)} · ${formatEuro(order.value)}`}
          />
          <MetaRow
            icon={UserCircle}
            label="Rep"
            value={rep ? `${rep.name} (${rep.role})` : "Unassigned"}
          />
          <MetaRow icon={Clock} label="Last update" value={order.lastUpdate} />
        </div>
      </div>

      {/* Current stage photo */}
      <div className="px-6 pb-5">
        <div className="overflow-hidden rounded-2xl bg-surface-raised">
          <img
            src={stonePhoto(order.productId)}
            alt={`${product?.name ?? "Stone"} at ${order.stage} stage`}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <p className="mt-2 text-[11.5px] text-ink-faint">
          {product?.name ?? "Product"}, {order.stage.toLowerCase()}.
        </p>
      </div>

      {/* Landed cost breakdown */}
      <LandedCostStrip order={order} />

      {/* Customer tracking preview */}
      <CustomerPreview order={order} url={url} />
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: Icon;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[10px] bg-border-soft text-ink-faint">
        <Icon size={15} weight="regular" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] text-ink-faint">{label}</p>
        <p className="text-[13px] text-ink">
          {value}
          {note ? (
            <span className="ml-1.5 text-[12px] text-ink-faint">{note}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function CustomerPreview({ order, url }: { order: Order; url: string }) {
  const product = getProduct(order.productId);
  const [copied, setCopied] = useState(false);

  function copy() {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {
        /* clipboard blocked, no-op */
      }
    );
  }

  return (
    <div className="border-t border-border-soft px-6 py-5">
      <div className="mb-3 flex items-center gap-2">
        <Eye size={15} weight="regular" className="text-ink-faint" />
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          What your customer sees
        </h3>
      </div>

      {/* Framed mini public tracking card */}
      <div className="rounded-2xl border border-border bg-surface-raised p-4">
        <div className="overflow-hidden rounded-[10px] bg-border-soft">
          <img
            src={stonePhoto(order.productId, 600, 360)}
            alt={`${product?.name ?? "Stone"} order`}
            loading="lazy"
            className="aspect-[5/3] w-full object-cover"
          />
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">
              Stage
            </p>
            <p className="text-[14px] font-medium text-ink">{order.stage}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">
              Expected
            </p>
            <p className="text-[14px] font-medium tabular-nums text-ink">
              {formatDate(order.eta)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-ink-faint">
          A date, a stage, a photo. No pricing, no internal notes.
        </p>
      </div>

      {/* URL + copy */}
      <div className="mt-3 flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate rounded-[10px] bg-border-soft px-3 py-2 font-mono text-[12px] text-ink-muted">
          {url}
        </span>
        <button
          onClick={copy}
          className={cn(
            "flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] border border-border px-3 text-[12.5px] font-medium transition-colors",
            copied
              ? "border-success/30 text-success"
              : "text-ink-muted hover:bg-surface hover:text-ink"
          )}
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
