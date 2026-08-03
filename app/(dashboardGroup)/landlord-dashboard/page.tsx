import { redirect } from "next/navigation";
import {
  Banknote,
  Building2,
  CircleCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/property/property-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { getMe } from "@/service/getMe";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import { getPropertyReviews } from "@/app/(publicGroup)/_actions/getProperties";
import {
  getLandlordProperties,
  getLandlordRequests,
} from "../_actions/landlordActions";
import { LandlordTabs } from "../_components/landlord-tabs";
import type {
  TCategory,
  TProperty,
  TRentalRequest,
  TReview,
} from "@/lib/types";

const LandlordDashboardPage = async () => {
  const userResult = await getMe();
  const user = userResult?.success ? userResult?.data : null;

  if (!user) {
    redirect("/login");
  }
  if (user.role === "TENANT") {
    redirect("/dashboard");
  }
  if (user.role === "ADMIN") {
    redirect("/admin-dashboard");
  }

  const [propertiesResult, categoriesResult, requestsResult] =
    await Promise.all([
      getLandlordProperties(),
      getCategories(),
      getLandlordRequests(),
    ]);

  const properties: TProperty[] = propertiesResult?.data || [];
  const categories: TCategory[] = categoriesResult?.data || [];
  const requests: TRentalRequest[] = requestsResult?.data || [];

  const reviewsMap: Record<string, TReview[]> = {};
  await Promise.all(
    properties.map(async (property) => {
      const reviewsResult = await getPropertyReviews(property.id);
      if (reviewsResult?.success) {
        reviewsMap[property.id] = reviewsResult.data || [];
      }
    })
  );

  const activeRequests = requests.filter(
    (request) => request.approveStatus === "APPROVED"
  );
  const paidRequests = requests.filter(
    (request) => request.paymentStatus === "PAID"
  );
  const earnings = paidRequests.reduce(
    (total, request) => total + (request.property?.price ?? 0),
    0
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Landlord Dashboard
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

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Total Properties"
          value={properties.length}
          hint={`${properties.filter((property) => property.isAvailable).length} available`}
        />
        <StatCard
          icon={CircleCheck}
          label="Active Requests"
          value={activeRequests.length}
          hint={`${requests.filter((request) => request.approveStatus === "PENDING").length} pending`}
        />
        <StatCard
          icon={Banknote}
          label="Earnings"
          value={formatPrice(earnings)}
          hint={`${paidRequests.length} paid request(s)`}
        />
      </div>

      <div className="mt-8">
        <LandlordTabs
          properties={properties}
          categories={categories}
          requests={requests}
          reviewsMap={reviewsMap}
        />
      </div>
    </div>
  );
};

export default LandlordDashboardPage;