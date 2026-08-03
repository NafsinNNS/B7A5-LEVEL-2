import { Skeleton } from "@/components/ui/skeleton";

export default function TenantDashboardLoading() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Skeleton className="h-6 w-48" />
          <div className="mt-4 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="mt-3 h-4 w-1/2" />
                    <Skeleton className="mt-2 h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-5 shadow-sm">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-xl border bg-secondary/50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="mt-3 h-4 w-20" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
