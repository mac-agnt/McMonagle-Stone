"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlugsConnected } from "@phosphor-icons/react";
import { Badge } from "../ui/Badge";
import { Switch } from "../ui/Switch";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { integrations, type Integration } from "@/lib/mockData";

const statusTone: Record<Integration["status"], "success" | "warning" | "danger"> = {
  connected: "success",
  syncing: "warning",
  error: "danger",
};

const statusLabel: Record<Integration["status"], string> = {
  connected: "Connected",
  syncing: "Syncing",
  error: "Error",
};

export function IntegrationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(integrations.map((i) => [i.id, true]))
  );

  return (
    <div>
      <div className="mb-1">
        <h2 className="text-[15px] font-semibold text-ink">Integrations</h2>
        <p className="mt-0.5 text-[13.5px] text-ink-muted">
          Connected services keeping stock, accounts, and customer data in sync.
        </p>
      </div>

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="mt-4 flex flex-col divide-y divide-border-soft"
      >
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            variants={fadeUp}
            transition={{ duration: 0.22, ease }}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
                <PlugsConnected size={17} weight="fill" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13.5px] font-medium text-ink">{integration.name}</p>
                  <Badge tone="neutral">{integration.category}</Badge>
                  <Badge tone={statusTone[integration.status]}>
                    {statusLabel[integration.status]}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[12px] text-ink-faint">
                  Last synced {integration.lastSynced} &middot;{" "}
                  {integration.recordsSynced.toLocaleString()} records synced
                </p>
              </div>
            </div>
            <Switch
              checked={enabled[integration.id]}
              label={integration.name}
              onChange={(next) =>
                setEnabled((prev) => ({ ...prev, [integration.id]: next }))
              }
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
