export default function ProfileLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      ))}
    </div>
  );
}
