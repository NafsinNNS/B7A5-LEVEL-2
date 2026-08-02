import { Suspense } from "react";
import { PropertySearchBar } from "@/components/property/property-search-bar";
import { PropertyList } from "@/components/property/property-list";
import { getProperties } from "../_actions/getProperties";
import { getCategories } from "../_actions/getCategories";
import type { TCategory, TProperty } from "@/lib/types";

type RentalsPageProps = {
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    categoryName?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};

const RentalsPage = async ({ searchParams }: RentalsPageProps) => {
  const params = await searchParams;

  const [categoriesResult, propertiesResult] = await Promise.all([
    getCategories(),
    getProperties({
      searchTerm: params.searchTerm,
      location: params.location,
      categoryName: params.categoryName,
      maxPrice: params.maxPrice,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
  ]);

  const categories: TCategory[] = categoriesResult?.data || [];
  const properties: TProperty[] = propertiesResult?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Find Your Home
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Rentals
          </h1>
          <p className="mt-2 text-muted-foreground">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} found
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <PropertySearchBar categories={categories} />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          }
        >
          <PropertyList properties={properties} />
        </Suspense>
      </div>
    </div>
  );
};

export default RentalsPage;
