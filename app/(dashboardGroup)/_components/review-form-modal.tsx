"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createReview } from "../_actions/getRentalRequests";
import type { TProperty } from "@/lib/types";

type ReviewFormModalProps = {
  rentalRequestId: string;
  property: TProperty | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function ReviewFormModal({
  rentalRequestId,
  property,
  onClose,
  onSuccess,
}: ReviewFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }
    setPending(true);
    try {
      const result = await createReview(rentalRequestId, { rating, comment });
      if (result?.success) {
        toast.success("Review submitted successfully");
        onSuccess();
        onClose();
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to submit review");
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
        className="w-full max-w-md overflow-hidden rounded-2xl border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Give Review</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-6">
          {property && (
            <p className="rounded-xl bg-secondary/50 p-4 text-sm font-medium">
              {property.title}
            </p>
          )}

          <div className="grid gap-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={
                      value <= (hoverRating || rating)
                        ? "size-7 fill-amber-400 text-amber-400"
                        : "size-7 text-muted-foreground"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="review-comment">Comment (optional)</Label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this property..."
              className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Submitting..." : "Submit review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
