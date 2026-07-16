"use client";

import { motion } from "framer-motion";
import { useId } from "react";

export type TrendPoint = { label: string; value: number };

/**
 * Area + line chart, scaled up from the Home Sparkline language.
 * Used for the "This Week" tonnage chart. Handles trailing zeros (future days).
 */
export function TrendArea({
  data,
  height = 180,
  color = "var(--color-accent)",
  valueSuffix = "",
}: {
  data: TrendPoint[];
  height?: number;
  color?: string;
  valueSuffix?: string;
}) {
  const id = useId();
  const width = 640;
  const padY = 18;
  const padBottom = 26;
  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const chartH = height - padBottom - padY;

  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
    const y = padY + chartH - (d.value / max) * chartH;
    return [x, y] as const;
  });

  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${padY + chartH} L0,${padY + chartH} Z`;
  const baseline = padY + chartH;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line
          x1="0"
          y1={baseline}
          x2={width}
          y2={baseline}
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        <motion.path
          d={area}
          fill={`url(#${id})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* dots on non-zero points */}
        {pts.map(([x, y], i) =>
          data[i].value > 0 ? (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill="var(--color-surface)"
              stroke={color}
              strokeWidth={2}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
            />
          ) : null
        )}
      </svg>

      <div className="mt-2 flex justify-between px-1 text-[11px] text-ink-faint">
        {data.map((d) => (
          <span key={d.label} className="tabular-nums">
            {d.label}
          </span>
        ))}
      </div>
      {valueSuffix ? <span className="sr-only">{valueSuffix}</span> : null}
    </div>
  );
}
