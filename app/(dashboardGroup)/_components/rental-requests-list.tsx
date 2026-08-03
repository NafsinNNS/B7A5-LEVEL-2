"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Eye,
  Loader2,
  MapPin,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/property/property-card";
import { getRentalRequestDetails } from "../_actions/getRentalRequests";
import { ReviewFormModal } from "./review-form-modal";
import type {
  TApproveStatus,
  TPaymentStatus,
  TProperty,
  TRentalRequest,
  TReview,
} from "@/lib/types";

const approveStatusVariant: Record<
  TApproveStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  COMPLETED: "secondary",
};

const paymentStatusVariant: Record<
  TPaymentStatus,
  "success" | "warning" | "destructive"
> = {
  PAID: "success",
  UNPAID: "warning",
  FAILED: "destructive",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type RentalRequestsListProps = {
  requests: TRentalRequest[];
  properties: Record<string, TProperty>;
  reviews?: Record<string, TReview[]>;
  currentUserId?: string;
};

export function RentalRequestsList({
  requests,
  properties,
  reviews = {},
  currentUserId,
}: RentalRequestsListProps) {
  const [pending, startTransition] = useTransition();
  const [details, setDetails] = useState<TRentalRequest | null>(null);
  const [reviewRequest, setReviewRequest] = useState<TRentalRequest | null>(
    null
  );
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const handleViewDetails = (requestId: string) => {
    startTransition(async () => {
      const result = await getRentalRequestDetails(requestId);
      if (result?.success && result?.data) {
        setDetails(result.data);
      } else {
        toast.error(result?.message || "Failed to load request details");
      }
    });
  };

  return (
    <>
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
          <CreditCard className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No rental requests yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Browse properties and send your first rental request to get
            started.
          </p>
          <Link href="/rentals" className="mt-5 inline-block">
            <Button>Browse Rentals</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => {
            const property = properties[request.propertyId];
            const propertyReviews = reviews[request.propertyId] ?? [];
            const hasMyReview = currentUserId
              ? propertyReviews.some(
                  (review) => review.userId === currentUserId
                )
              : false;
            return (
              <div
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {property?.title ?? "Property"}
                      </h3>
                      <Badge variant={approveStatusVariant[request.approveStatus]}>
                        {request.approveStatus}
                      </Badge>
                      <Badge variant={paymentStatusVariant[request.paymentStatus]}>
                        {request.paymentStatus === "UNPAID"
                          ? "Unpaid"
                          : request.paymentStatus}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {property && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary" />
                            {property.location}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatPrice(property.price)}/mo
                          </span>
                        </>
                      )}
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-primary" />
                        Requested {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {request.approveStatus === "COMPLETED" &&
                      request.paymentStatus === "PAID" &&
                      !hasMyReview &&
                      !reviewedIds.has(request.id) && (
                        <Button
                          variant="default"
                          onClick={() => setReviewRequest(request)}
                          disabled={pending}
                        >
                          <Star />
                          Give Review
                        </Button>
                      )}
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(request.id)}
                      disabled={pending}
                    >
                      {pending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Eye />
                      )}
                      Details
                    </Button>
                  </div>
                </div>

                {propertyReviews.length > 0 && (
                  <div className="grid gap-3 border-t pt-4">
                    {propertyReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex flex-col gap-2 rounded-xl bg-secondary/50 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {review.user?.name ?? "Tenant"}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                className={
                                  value <= review.rating
                                    ? "size-3.5 fill-amber-400 text-amber-400"
                                    : "size-3.5 text-muted-foreground/40"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {details && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetails(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Rental Request Details</h2>
              <button
                onClick={() => setDetails(null)}
                aria-label="Close details"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-4 p-6">
              {properties[details.propertyId] && (
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="font-semibold">
                    {properties[details.propertyId].title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    {properties[details.propertyId].location}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatPrice(properties[details.propertyId].price)}/month
                  </p>
                </div>
              )}

              <div className="grid gap-2.5 text-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Request ID</span>
                  <span className="font-mono text-xs">{details.id}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Approval status</span>
                  <Badge variant={approveStatusVariant[details.approveStatus]}>
                    {details.approveStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Payment status</span>
                  <Badge variant={paymentStatusVariant[details.paymentStatus]}>
                    {details.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Requested on</span>
                  <span className="font-medium">
                    {formatDate(details.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">
                    {formatDate(details.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewRequest && (
        <ReviewFormModal
          rentalRequestId={reviewRequest.id}
          property={properties[reviewRequest.propertyId] ?? null}
          onClose={() => setReviewRequest(null)}
          onSuccess={() => {
            setReviewedIds(
              (prev) => new Set(prev).add(reviewRequest.id)
            );
          }}
        />
      )}
    </>
  );
}
