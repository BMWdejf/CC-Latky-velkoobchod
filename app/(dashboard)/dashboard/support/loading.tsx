export default function SupportLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 flex gap-8">
          {[80, 64, 80, 64].map((w, i) => (
            <div key={i} className={`h-4 w-${w} animate-pulse rounded bg-muted`} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-8 border-b border-border px-4 py-3 last:border-0">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
