"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check } from "@phosphor-icons/react";
import { StageProgress } from "@/components/ui/StageProgress";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { getOrder, stagesForSource, stageIndex } from "@/lib/mockData";
import type { AssistantAnswer as Answer, RowTone } from "@/lib/assistant";

const toneText: Record<RowTone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  accent: "text-accent-strong",
  neutral: "text-ink",
};

const toneRule: Record<RowTone, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  accent: "bg-accent",
  neutral: "bg-border",
};

/** Assistant reply: prose, an optional inline card, an optional jump link. */
export function AssistantAnswer({ answer }: { answer: Answer }) {
  return (
    <div className="max-w-[85%] space-y-3">
      {answer.text.split("\n\n").map((para, i) => (
        <p
          key={i}
          className="text-[13.5px] leading-relaxed text-ink-muted first:text-ink"
        >
          {para}
        </p>
      ))}

      {answer.card && <AnswerCardView card={answer.card} />}

      {answer.link && (
        <Link
          href={answer.link.href}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-strong transition-colors hover:text-accent"
        >
          {answer.link.label}
          <ArrowRight size={13} weight="bold" />
        </Link>
      )}
    </div>
  );
}

function AnswerCardView({ card }: { card: NonNullable<Answer["card"]> }) {
  if (card.kind === "stage") return <StageCard orderId={card.orderId} />;
  if (card.kind === "message") return <MessageCard text={card.text} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg">
      <div className="divide-y divide-border-soft">
        {card.rows.map((row, i) => (
          <motion.div
            key={row.label + i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease }}
            className="flex items-center gap-3 px-4 py-2.5"
          >
            <span
              className={cn(
                "h-7 w-[2px] shrink-0 rounded-full",
                toneRule[row.tone ?? "neutral"]
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-ink">
                {row.label}
              </p>
              <p className="truncate text-[11.5px] text-ink-faint">{row.meta}</p>
            </div>
            {row.tag && (
              <span className="hidden shrink-0 rounded-full bg-border-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted sm:inline">
                {row.tag}
              </span>
            )}
            {row.value && (
              <span
                className={cn(
                  "shrink-0 text-[12.5px] font-semibold tabular-nums",
                  toneText[row.tone ?? "neutral"]
                )}
              >
                {row.value}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      {card.footer && (
        <p className="border-t border-border-soft px-4 py-2 text-[11.5px] text-ink-faint">
          {card.footer}
        </p>
      )}
    </div>
  );
}

function StageCard({ orderId }: { orderId: string }) {
  const order = getOrder(orderId);
  if (!order) return null;
  const stages = stagesForSource(order.source);

  return (
    <div className="rounded-2xl border border-border bg-bg px-4 py-3.5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[12.5px] font-medium text-ink">{order.id}</p>
        <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">
          {order.daysSlipped} days late
        </span>
      </div>
      <StageProgress
        stages={stages}
        currentIndex={stageIndex(order)}
        showLabel
      />
    </div>
  );
}

function MessageCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-bg px-4 py-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        Drafted update for the customer
      </p>
      <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
        {text}
      </p>
      <button
        onClick={handleCopy}
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-ink-faint/40",
          copied ? "text-success" : "text-ink-muted"
        )}
      >
        {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy message"}
      </button>
    </div>
  );
}
