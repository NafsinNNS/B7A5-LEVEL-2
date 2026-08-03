import { Star } from "lucide-react";

import type { TProperty, TReview } from "@/lib/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type LandlordReviewsListProps = {
  reviewsMap: Record<string, TReview[]>;
  properties: TProperty[];
};

export function LandlordReviewsList({
  reviewsMap,
  properties,
}: LandlordReviewsListProps) {
  const propertyById: Record<string, TProperty> = {};
  properties.forEach((property) => {
    propertyById[property.id] = property;
  });

  const allReviews = Object.entries(reviewsMap).flatMap(([propertyId, reviews]) =>
    reviews.map((review) => ({ ...review, propertyId }))
  );

  if (allReviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
        <Star className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Reviews from tenants will appear here once they complete their
          rentals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {allReviews.map((review) => {
        const property = propertyById[review.propertyId];
        return (
          <div
            key={review.id}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{property?.title ?? "Property"}</p>
                <p className="text-sm text-muted-foreground">
                  {review.user?.name ?? "Tenant"} · {formatDate(review.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={
                      value <= review.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground/40"
                    }
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
