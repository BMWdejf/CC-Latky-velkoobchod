export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
        <div className="flex flex-col justify-center space-y-4">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-9 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-7 w-32 rounded bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
