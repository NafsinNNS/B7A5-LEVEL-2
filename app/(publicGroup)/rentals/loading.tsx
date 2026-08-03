import { Skeleton } from "@/components/ui/skeleton";
import { PropertyGridSkeleton } from "@/components/property/property-card-skeleton";

export default function RentalsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-4 w-80" />

      <div className="mt-6 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="mt-8">
        <PropertyGridSkeleton count={9} />
      </div>
    </div>
  );
}
