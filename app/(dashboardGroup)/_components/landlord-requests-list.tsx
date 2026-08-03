"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Inbox,
  Loader2,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/property/property-card";
import { updateRequestStatus } from "../_actions/landlordActions";
import type { TApproveStatus, TPaymentStatus, TRentalRequest } from "@/lib/types";

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

type LandlordRequestsListProps = {
  requests: TRentalRequest[];
};

export function LandlordRequestsList({ requests }: LandlordRequestsListProps) {
  const router = useRouter();
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleStatusChange = (requestId: string, status: TApproveStatus) => {
    setPendingRequestId(requestId);
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, status);
      setPendingRequestId(null);
      if (result?.success) {
        toast.success(
          `Request ${requestId.slice(0, 8)} marked as ${status.toLowerCase()}`
        );
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update request status");
      }
    });
  };

  return (
    <>
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
          <Inbox className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No rental requests yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            When tenants request to rent your properties, their requests will
            show up here for you to approve or reject.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => {
            const property = request.property;
            const tenant = request.user;
            const isPending = pendingRequestId === request.id;
            return (
              <div
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {property?.title ?? "Property"}
                      </h3>
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

                {request.approveStatus !== "COMPLETED" ? (
                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    <span className="text-sm text-muted-foreground">
                      Change status:
                    </span>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={isPending || request.approveStatus === "APPROVED"}
                      onClick={() =>
                        handleStatusChange(request.id, "APPROVED")
                      }
                    >
                      {isPending ? <Loader2 className="animate-spin" /> : null}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isPending || request.approveStatus === "REJECTED"}
                      onClick={() =>
                        handleStatusChange(request.id, "REJECTED")
                      }
                    >
                      {isPending ? <Loader2 className="animate-spin" /> : null}
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        isPending || request.approveStatus === "COMPLETED"
                      }
                      onClick={() =>
                        handleStatusChange(request.id, "COMPLETED")
                      }
                    >
                      {isPending ? <Loader2 className="animate-spin" /> : null}
                      Complete
                    </Button>
                    {isPending ? (
                      <Loader2 className="ml-1 size-4 animate-spin text-primary" />
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
