export function CatalogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-48 animate-pulse rounded-md bg-muted sm:h-64" />
      <div className="space-y-4">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
