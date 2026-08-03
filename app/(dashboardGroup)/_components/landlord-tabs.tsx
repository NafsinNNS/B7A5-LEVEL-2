"use client";

import { useState } from "react";
import { Building2, Inbox, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LandlordPropertiesList } from "./landlord-properties-list";
import { LandlordRequestsList } from "./landlord-requests-list";
import { LandlordReviewsList } from "./landlord-reviews-list";
import type {
  TCategory,
  TProperty,
  TRentalRequest,
  TReview,
} from "@/lib/types";

type LandlordTabsProps = {
  properties: TProperty[];
  categories: TCategory[];
  requests: TRentalRequest[];
  reviewsMap: Record<string, TReview[]>;
};

type Tab = "properties" | "requests" | "reviews";

export function LandlordTabs({
  properties,
  categories,
  requests,
  reviewsMap,
}: LandlordTabsProps) {
  const [tab, setTab] = useState<Tab>("properties");

  const tabMeta: Record<Tab, { label: string; icon: typeof Building2 }> = {
    properties: { label: "My Properties", icon: Building2 },
    requests: { label: "Rental Requests", icon: Inbox },
    reviews: { label: "Reviews", icon: Star },
  };

  const reviewCount = Object.values(reviewsMap).reduce(
    (total, reviews) => total + reviews.length,
    0
  );

  const counts: Record<Tab, number> = {
    properties: properties.length,
    requests: requests.length,
    reviews: reviewCount,
  };

  const active = tabMeta[tab];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <active.icon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">{active.label}</h2>
          <Badge variant="outline">{counts[tab]}</Badge>
        </div>
        <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
          {(Object.keys(tabMeta) as Tab[]).map((key) => {
            const meta = tabMeta[key];
            const Icon = meta.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {tab === "properties" && (
          <LandlordPropertiesList
            properties={properties}
            categories={categories}
          />
        )}
        {tab === "requests" && <LandlordRequestsList requests={requests} />}
        {tab === "reviews" && (
          <LandlordReviewsList reviewsMap={reviewsMap} properties={properties} />
        )}
      </div>
    </div>
  );
}
