"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Loader2, Plus, Tags } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "../_actions/adminActions";
import type { TCategory } from "@/lib/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type AdminCategoriesProps = {
  categories: TCategory[];
};

export function AdminCategories({ categories }: AdminCategoriesProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }
    setPending(true);
    startTransition(async () => {
      const result = await createCategory(trimmed);
      setPending(false);
      if (result?.success) {
        toast.success("Category created successfully");
        setName("");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to create category");
      }
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <div className="grid min-w-60 flex-1 gap-2">
          <Label htmlFor="new-category">Category name</Label>
          <Input
            id="new-category"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apartment, House, Villa"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          {pending ? "Creating..." : "Create category"}
        </Button>
      </form>

      <div className="mt-6">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
            <FolderTree className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Tags className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(category.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
