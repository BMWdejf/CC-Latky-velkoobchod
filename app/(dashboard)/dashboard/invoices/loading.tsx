export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 flex gap-8">
          {[96, 80, 64, 72, 72, 48].map((w, i) => (
            <div key={i} style={{ width: w }} className="h-4 animate-pulse rounded bg-muted" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-8 border-b border-border px-4 py-3 last:border-0">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
