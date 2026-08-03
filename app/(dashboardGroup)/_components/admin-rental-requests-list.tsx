"use client";

import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/property/property-card";
import type {
  TApproveStatus,
  TPaymentStatus,
  TRentalRequest,
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

type AdminRentalRequestsListProps = {
  requests: TRentalRequest[];
};

export function AdminRentalRequestsList({
  requests,
}: AdminRentalRequestsListProps) {
  return (
    <>
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
          <CreditCard className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">
            No rental requests found
          </h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => {
            const property = request.property;
            const tenant = request.user;
            return (
              <div
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {property ? (
                        <Link
                          href={`/rentals/${property.id}`}
                          className="font-semibold transition-colors hover:text-primary"
                        >
                          {property.title}
                        </Link>
                      ) : (
                        <h3 className="font-semibold">Property</h3>
                      )}
                      <Badge
                        variant={approveStatusVariant[request.approveStatus]}
                      >
                        {request.approveStatus}
                      </Badge>
                      <Badge
                        variant={paymentStatusVariant[request.paymentStatus]}
                      >
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
                  <div className="shrink-0 text-sm">
                    {tenant && (
                      <div className="flex flex-col items-end gap-1 text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="size-3.5 text-primary" />
                          {tenant.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-primary" />
                          {tenant.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-t pt-4 text-xs text-muted-foreground">
                  <span>Request ID:</span>
                  <span className="font-mono">{request.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
