import { LiveDot } from "./LiveDot";

/** Page title block. Headings are light weight per the design tokens. */
export function PageHeader({
  title,
  subtitle,
  live = false,
  right,
}: {
  title: string;
  subtitle?: string;
  live?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-light tracking-tight text-ink sm:text-[27px]">
            {title}
          </h1>
          {live && <LiveDot />}
        </div>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
