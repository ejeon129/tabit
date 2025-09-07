export function Progress({ value, stage }: { value: number; stage?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value*100)));
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{stage ?? 'Processing'}</span><span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
        <div className="h-2 bg-accent-500 transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
