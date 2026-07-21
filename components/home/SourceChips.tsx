/** Small muted pill row showing which datasets an assistant answer drew from. */
export function SourceChips({ sources }: { sources: string[] }) {
  if (!sources.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-ink-faint">Read:</span>
      {sources.map((s) => (
        <span
          key={s}
          className="rounded-full bg-border-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
