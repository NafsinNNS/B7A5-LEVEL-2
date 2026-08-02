import { redirect } from "next/navigation";
import { Building2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getMe } from "@/service/getMe";
import { getRentalRequests } from "../_actions/getRentalRequests";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getProperties";
import { RentalRequestsList } from "../_components/rental-requests-list";
import type { TProperty, TRentalRequest } from "@/lib/types";

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

  const requestsResult = await getRentalRequests();
  const requests: TRentalRequest[] = requestsResult?.data || [];

  const propertyMap: Record<string, TProperty> = {};
  await Promise.all(
    requests.map(async (request) => {
      const propertyResult = await getPropertyById(request.propertyId);
      if (propertyResult?.success && propertyResult?.data) {
        propertyMap[request.propertyId] = propertyResult.data;
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

      <div className="mt-8 flex items-center gap-2">
        <FileText className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">My Rental Requests</h2>
        <Badge variant="outline">{requests.length}</Badge>
      </div>

      <div className="mt-4">
        <RentalRequestsList requests={requests} properties={propertyMap} />
      </div>
    </div>
  );
};

export default TenantDashboardPage;
