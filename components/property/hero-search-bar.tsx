"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TCategory } from "@/lib/types";

type HeroSearchBarProps = {
  categories: TCategory[];
};

export function HeroSearchBar({ categories }: HeroSearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (location) params.set("location", location);
    if (categoryName) params.set("categoryName", categoryName);
    router.push(`/rentals${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto grid w-full max-w-3xl gap-2 rounded-2xl border bg-background/95 p-2 shadow-xl backdrop-blur sm:grid-cols-[1.2fr_1fr_auto]"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search apartments, houses, studios..."
          className="h-12 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="h-12 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          aria-label="Category"
          className="flex h-12 flex-1 items-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] sm:hidden"
        >
          <option value="">All types</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit" size="xl" className="flex-1 sm:flex-none">
          <Search className="size-4 sm:hidden" />
          <SlidersHorizontal className="hidden size-4 sm:block" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  );
}
