"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Landmark,
  MapPin,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  getPropertyImage,
} from "@/components/property/property-card";
import type { TProperty } from "@/lib/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type AdminPropertiesListProps = {
  properties: TProperty[];
};

export function AdminPropertiesList({
  properties,
}: AdminPropertiesListProps) {
  return (
    <>
      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
          <Building2 className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={getPropertyImage(property.id)}
                  alt={property.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <Badge
                  variant={property.isAvailable ? "success" : "destructive"}
                  className="absolute right-3 top-3"
                >
                  {property.isAvailable ? "Available" : "Rented"}
                </Badge>
              </div>
              <div className="p-5">
                <Link
                  href={`/rentals/${property.id}`}
                  className="line-clamp-1 font-semibold transition-colors hover:text-primary"
                >
                  {property.title}
                </Link>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{property.location}</span>
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Tag className="size-3.5 text-primary" />
                    {property.categoryName}
                  </span>
                  <span className="font-semibold text-primary">
                    {formatPrice(property.price)}/mo
                  </span>
                </div>
                <div className="mt-4 grid gap-1.5 border-t pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="size-3.5 text-primary" />
                    Landlord:{" "}
                    <span className="font-mono">{property.landlordId}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-primary" />
                    Listed {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
