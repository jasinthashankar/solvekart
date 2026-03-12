export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header Skeleton */}
      <div className="bg-navy py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="h-4 w-24 skeleton opacity-20 mb-5" />
          <div className="h-6 w-32 skeleton opacity-20 mb-3" />
          <div className="h-10 w-3/4 skeleton opacity-20 mb-1" />
          <div className="h-4 w-1/3 skeleton opacity-20" />
        </div>
      </div>

      {/* Bundles Skeleton */}
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-96 skeleton" />
        ))}
      </div>
    </div>
  );
}
