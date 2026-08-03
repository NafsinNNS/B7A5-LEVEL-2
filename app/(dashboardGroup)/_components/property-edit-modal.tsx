"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/property/image-upload-field";
import { updateLandlordProperty } from "../_actions/landlordActions";
import type { TCategory, TProperty } from "@/lib/types";

type PropertyEditModalProps = {
  property: TProperty;
  categories: TCategory[];
  onClose: () => void;
};

export function PropertyEditModal({
  property,
  categories,
  onClose,
}: PropertyEditModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description);
  const [price, setPrice] = useState(String(property.price));
  const [location, setLocation] = useState(property.location);
  const [categoryName, setCategoryName] = useState(property.categoryName);
  const [amenities, setAmenities] = useState(property.amenities.join(", "));
  const [imageUrl, setImageUrl] = useState(property.imageUrl ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const result = await updateLandlordProperty(property.id, {
        title,
        description,
        price: Number(price),
        location,
        categoryName,
        amenities: amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrl: imageUrl || undefined,
      });
      if (result?.success) {
        toast.success("Property updated successfully");
        onClose();
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update property");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Edit Property</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-6">
          <div className="grid gap-2">
            <Label htmlFor={`title-${property.id}`}>Title</Label>
            <Input
              id={`title-${property.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`desc-${property.id}`}>Description</Label>
            <textarea
              id={`desc-${property.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`price-${property.id}`}>Price (per month)</Label>
              <Input
                id={`price-${property.id}`}
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`cat-${property.id}`}>Category</Label>
              <select
                id={`cat-${property.id}`}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`loc-${property.id}`}>Location</Label>
            <Input
              id={`loc-${property.id}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`am-${property.id}`}>
              Amenities (comma separated)
            </Label>
            <Input
              id={`am-${property.id}`}
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="2 Bedrooms, 1 Bathroom, Balcony..."
            />
          </div>
          <ImageUploadField
            id={`img-${property.id}`}
            value={imageUrl}
            onChange={setImageUrl}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}