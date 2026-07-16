import type { Icon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { PageHeader } from "./PageHeader";

/** On-brand placeholder for routes not yet built in this demo. */
export function ComingSoon({
  title,
  subtitle,
  icon: IconEl,
  note,
}: {
  title: string;
  subtitle: string;
  icon: Icon;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
          <IconEl size={26} weight="light" />
        </span>
        <div className="max-w-sm">
          <p className="text-[15px] font-medium text-ink">In the next build</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{note}</p>
        </div>
      </Card>
    </div>
  );
}
