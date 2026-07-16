"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { HeroRow } from "@/components/dashboard/HeroRow";
import { VolumeCharts } from "@/components/dashboard/VolumeCharts";
import { WeekAndDepot } from "@/components/dashboard/WeekAndDepot";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader
        title="Command Dashboard"
        subtitle="The morning read on the yard. Tonnage first, because euros swing and stone does not."
        live
      />
      <HeroRow />
      <VolumeCharts />
      <WeekAndDepot />
    </div>
  );
}
