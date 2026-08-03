import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="h-5 w-28" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="relative aspect-[16/10]">
            <Skeleton className="size-full rounded-none" />
          </div>
          <div className="p-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-3 h-5 w-1/3" />
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
            </div>
            <Skeleton className="mt-8 h-5 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        </div>

        <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-2 h-4 w-40" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-3 h-12 w-full" />
          <div className="mt-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
