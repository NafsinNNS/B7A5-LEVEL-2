import { redirect } from "next/navigation";
import { Building2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getMe } from "@/service/getMe";
import { getRentalRequests } from "../_actions/getRentalRequests";
import { getMyPayments } from "../_actions/paymentActions";
import {
  getPropertyById,
  getPropertyReviews,
} from "@/app/(publicGroup)/_actions/getProperties";
import { RentalRequestsList } from "../_components/rental-requests-list";
import { PaymentHistory } from "../_components/payment-history";
import type {
  TPayment,
  TProperty,
  TRentalRequest,
  TReview,
} from "@/lib/types";

const TenantDashboardPage = async () => {
  const userResult = await getMe();
  const user = userResult?.success ? userResult?.data : null;

  if (!user) {
    redirect("/login");
  }
  if (user.role === "LANDLORD") {
    redirect("/landlord-dashboard");
  }
  if (user.role === "ADMIN") {
    redirect("/admin-dashboard");
  }

  const [requestsResult, paymentsResult] = await Promise.all([
    getRentalRequests(),
    getMyPayments(),
  ]);
  const requests: TRentalRequest[] = requestsResult?.data || [];

  const payments: TPayment[] = paymentsResult?.data || [];
  const paidRequestIds = new Set(
    payments.map((payment) => payment.rentalRequestId)
  );
  const paymentsMap: Record<string, TPayment> = {};
  payments.forEach((payment) => {
    paymentsMap[payment.rentalRequestId] = payment;
  });

  const propertyMap: Record<string, TProperty> = {};
  const reviewsMap: Record<string, TReview[]> = {};
  const propertyIds = [...new Set(requests.map((r) => r.propertyId))];
  await Promise.all(
    propertyIds.map(async (propertyId) => {
      const propertyResult = await getPropertyById(propertyId);
      if (propertyResult?.success && propertyResult?.data) {
        propertyMap[propertyId] = propertyResult.data;
      }
      const reviewsResult = await getPropertyReviews(propertyId);
      if (reviewsResult?.success) {
        reviewsMap[propertyId] = reviewsResult.data || [];
      }
    })
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Tenant Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
          <Building2 className="size-4" />
          {user.role}
        </Badge>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">My Rental Requests</h2>
            <Badge variant="outline">{requests.length}</Badge>
          </div>

          <div className="mt-4">
            <RentalRequestsList
              requests={requests}
              properties={propertyMap}
              reviews={reviewsMap}
              currentUserId={user.id}
              paidRequestIds={paidRequestIds}
              payments={paymentsMap}
            />
          </div>
        </div>

        <aside>
          <PaymentHistory payments={payments} properties={propertyMap} />
        </aside>
      </div>
    </div>
  );
};

export default TenantDashboardPage;
