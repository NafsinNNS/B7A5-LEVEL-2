import { Building2 } from "lucide-react";

import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import type { TProperty } from "@/lib/types";

type PropertyListProps = {
  properties: TProperty[];
};

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
        <Building2 className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or clearing some filters to see more
          results.
        </p>
        <Link href="/rentals" className="mt-5 inline-block">
          <Button variant="outline">Clear all filters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
