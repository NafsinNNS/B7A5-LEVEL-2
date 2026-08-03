import { redirect } from "next/navigation";
import { Building2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getMe } from "@/service/getMe";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import { getLandlordProperties } from "../_actions/landlordActions";
import { LandlordPropertiesList } from "../_components/landlord-properties-list";
import type { TCategory, TProperty } from "@/lib/types";

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

  const [propertiesResult, categoriesResult] = await Promise.all([
    getLandlordProperties(),
    getCategories(),
  ]);

  const properties: TProperty[] = propertiesResult?.data || [];
  const categories: TCategory[] = categoriesResult?.data || [];

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

      <div className="mt-8 flex items-center gap-2">
        <FileText className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">My Properties</h2>
        <Badge variant="outline">{properties.length}</Badge>
      </div>
      <div className="mt-4">
        <LandlordPropertiesList
          properties={properties}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default LandlordDashboardPage;