"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { ease } from "@/lib/motion";

/** Right-side slide-in drawer with a scrim. Translate + opacity only. */
export function Drawer({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-border bg-surface"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-[10px] text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
            >
              <X size={17} />
            </button>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
