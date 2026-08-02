"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TCategory } from "@/lib/types";

type PropertySearchBarProps = {
  categories: TCategory[];
};

const sortOptions = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function PropertySearchBar({ categories }: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );
  const [categoryName, setCategoryName] = useState(
    searchParams.get("categoryName") || ""
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(
    searchParams.get("sortBy")
      ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}`
      : "createdAt-desc"
  );

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const debouncedLocation = useDebouncedValue(location, 400);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("searchTerm", debouncedSearchTerm);
    if (debouncedLocation) params.set("location", debouncedLocation);
    if (categoryName) params.set("categoryName", categoryName);
    if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
    if (sort && sort !== "createdAt-desc") {
      const [sortBy, sortOrder] = sort.split("-");
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    const queryString = params.toString();
    router.replace(`/rentals${queryString ? `?${queryString}` : ""}`);
  }, [
    debouncedSearchTerm,
    debouncedLocation,
    categoryName,
    debouncedMaxPrice,
    sort,
    router,
  ]);

  const hasActiveFilters =
    debouncedSearchTerm || debouncedLocation || categoryName || debouncedMaxPrice || sort !== "createdAt-desc";

  const handleReset = () => {
    setSearchTerm("");
    setLocation("");
    setCategoryName("");
    setMaxPrice("");
    setSort("createdAt-desc");
    router.replace("/rentals");
  };

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description, location..."
            className="h-11 pl-9"
            aria-label="Search properties"
          />
        </div>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="h-11 pl-9"
            aria-label="Filter by location"
          />
        </div>
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          aria-label="Filter by category"
          className="h-11 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
            min={0}
            placeholder="Max price"
            className="h-11 pl-9"
            aria-label="Filter by maximum price"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort properties"
          className="h-11 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasActiveFilters
            ? "Filters applied — results update as you type"
            : "Showing all available properties"}
        </p>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <RotateCcw />
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}
