export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />

      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="space-y-4">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-9 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-9 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
