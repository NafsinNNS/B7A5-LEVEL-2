import { Skeleton } from "@/components/ui/skeleton";
import { PropertyGridSkeleton } from "@/components/property/property-card-skeleton";

export default function HomeLoading() {
  return (
    <div>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-12 w-full max-w-xl" />
          <Skeleton className="mt-3 h-12 w-2/3 max-w-lg" />
          <Skeleton className="mt-6 h-5 w-1/2 max-w-md" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-4 h-4 w-72" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-9 w-64" />
          <div className="mt-10">
            <PropertyGridSkeleton count={6} />
          </div>
        </div>
      </section>
    </div>
  );
}
