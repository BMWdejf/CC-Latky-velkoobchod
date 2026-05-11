export default function AccountOrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-border px-4 py-3 last:border-0">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
