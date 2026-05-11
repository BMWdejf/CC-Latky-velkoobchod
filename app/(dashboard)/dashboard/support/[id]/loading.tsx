export default function SupportDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        {[false, true, false].map((right, i) => (
          <div key={i} className={`flex ${right ? "justify-end" : "justify-start"}`}>
            <div className="h-16 w-52 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
