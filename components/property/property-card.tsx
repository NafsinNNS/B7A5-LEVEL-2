import Image from "next/image";
import Link from "next/link";
import { BedDouble, Building2, MapPin, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TProperty } from "@/lib/types";

const propertyImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
];

export const getPropertyImage = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return propertyImages[hash % propertyImages.length];
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
};

type PropertyCardProps = {
  property: TProperty;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const image = getPropertyImage(property.id);

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={property.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
          <Building2 className="size-3" />
          {property.categoryName}
        </Badge>
        <Badge
          variant={property.isAvailable ? "success" : "destructive"}
          className="absolute right-3 top-3 backdrop-blur"
        >
          {property.isAvailable ? "Available" : "Rented"}
        </Badge>
        <div className="absolute bottom-3 left-3 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur">
          <p className="text-sm font-bold text-foreground">
            {formatPrice(property.price)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              /month
            </span>
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold leading-tight">
            {property.title}
          </h3>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {property.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1"
            >
              {amenity.toLowerCase().includes("bed") ? (
                <BedDouble className="size-3" />
              ) : (
                <Ruler className="size-3" />
              )}
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-muted-foreground">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <Link href={`/rentals/${property.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/rentals/${property.id}`} className="flex-1">
            <Button className="w-full">Rent Now</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
