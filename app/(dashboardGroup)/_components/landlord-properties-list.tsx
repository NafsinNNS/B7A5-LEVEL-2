"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Building2, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  getPropertyImage,
} from "@/components/property/property-card";
import { deleteLandlordProperty } from "../_actions/landlordActions";
import { PropertyEditModal } from "./property-edit-modal";
import { PropertyCreateModal } from "./property-create-modal";
import type { TCategory, TProperty } from "@/lib/types";

type LandlordPropertiesListProps = {
  properties: TProperty[];
  categories: TCategory[];
};

export function LandlordPropertiesList({
  properties,
  categories,
}: LandlordPropertiesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TProperty | null>(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (propertyId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(propertyId);
    try {
      const result = await deleteLandlordProperty(propertyId);
      if (result?.success) {
        toast.success("Property deleted");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to delete property");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
        <Building2 className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Your listed properties will appear here.
        </p>
        <Button className="mt-5" onClick={() => setCreating(true)}>
          <Plus />
          Create Property
        </Button>
        {creating && (
          <PropertyCreateModal
            categories={categories}
            onClose={() => setCreating(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus />
          Create Property
        </Button>
      </div>
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
              <h3 className="truncate font-semibold">{property.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span className="truncate">{property.location}</span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {property.categoryName}
                </span>
                <span className="font-semibold text-primary">
                  {formatPrice(property.price)}/mo
                </span>
              </div>
              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditing(property)}
                >
                  <Pencil />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(property.id, property.title)}
                  disabled={deletingId === property.id}
                >
                  {deletingId === property.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <PropertyEditModal
          property={editing}
          categories={categories}
          onClose={() => setEditing(null)}
        />
      )}
      {creating && (
        <PropertyCreateModal
          categories={categories}
          onClose={() => setCreating(false)}
        />
      )}
    </>
  );
}