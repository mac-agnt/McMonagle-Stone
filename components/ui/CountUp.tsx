"use client";

import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Counts a hero number up on mount. The value runs on a motion value, not React
 * state, so the tween itself costs no re-renders beyond the printed string.
 * Reduced motion lands on the final number immediately.
 */
export function CountUp({
  value,
  format = (n) => Math.round(n).toLocaleString("en-IE"),
  duration = 1.1,
  delay = 0.1,
}: {
  value: number;
  /** Turn the tweened number into what the user reads. */
  format?: (n: number) => string;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const [text, setText] = useState(() => format(reduce ? value : 0));

  useMotionValueEvent(mv, "change", (latest) => setText(format(latest)));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, delay, ease });
    return () => controls.stop();
  }, [value, duration, delay, reduce, mv]);

  return <span className="tabular-nums">{text}</span>;
}
