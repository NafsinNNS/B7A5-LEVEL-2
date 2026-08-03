import { CreditCard, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/property/property-card";
import type { TPayment, TProperty } from "@/lib/types";

const statusVariant: Record<
  TPayment["status"],
  "success" | "warning" | "destructive" | "secondary"
> = {
  ACTIVE: "success",
  INACTIVE: "warning",
  CANCELLED: "destructive",
  EXPIRED: "secondary",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type PaymentHistoryProps = {
  payments: TPayment[];
  properties?: Record<string, TProperty>;
};

export function PaymentHistory({
  payments,
  properties = {},
}: PaymentHistoryProps) {
  const sorted = [...payments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ReceiptText className="size-5 text-primary" />
          Payment History
        </h2>
        <Badge variant="outline">{payments.length}</Badge>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No payments yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {sorted.map((payment) => {
            const property = properties[payment.rentalRequest?.propertyId ?? ""];
            return (
              <div
                key={payment.id}
                className="rounded-xl border bg-secondary/50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {property?.title ?? "Property"}
                  </p>
                  <Badge variant={statusVariant[payment.status]}>
                    {payment.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CreditCard className="size-3.5 text-primary" />
                    {formatPrice(payment.amount)}/mo
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Paid {formatDate(payment.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Renews {formatDate(payment.currentPeriodEnd)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
