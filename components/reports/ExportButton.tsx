"use client";

import { useEffect, useRef, useState } from "react";
import { FilePdf } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";

/**
 * Mock PDF export. Clicking shows a brief "Preparing" state, then settles back.
 * No real file is produced; this is the owner-facing gesture, not the plumbing.
 */
export function ExportButton() {
  const [preparing, setPreparing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onClick = () => {
    if (preparing) return;
    setPreparing(true);
    timer.current = setTimeout(() => setPreparing(false), 1600);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      disabled={preparing}
      aria-live="polite"
    >
      <FilePdf size={15} weight="fill" />
      {preparing ? "Preparing" : "Export PDF"}
    </Button>
  );
}
