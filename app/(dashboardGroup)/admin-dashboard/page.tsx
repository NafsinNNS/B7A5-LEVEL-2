import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getMe } from "@/service/getMe";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import {
  getAllUsers,
  getAllProperties,
  getAllRentalRequests,
} from "../_actions/adminActions";
import { AdminTabs } from "../_components/admin-tabs";
import type {
  TCategory,
  TProperty,
  TRentalRequest,
  TUser,
} from "@/lib/types";

const AdminDashboardPage = async () => {
  const userResult = await getMe();
  const user = userResult?.success ? userResult?.data : null;

  if (!user) {
    redirect("/login");
  }
  if (user.role === "TENANT") {
    redirect("/dashboard");
  }
  if (user.role === "LANDLORD") {
    redirect("/landlord-dashboard");
  }

  const [usersResult, propertiesResult, rentalRequestsResult, categoriesResult] =
    await Promise.all([
      getAllUsers(),
      getAllProperties(),
      getAllRentalRequests(),
      getCategories(),
    ]);

  const users: TUser[] = usersResult?.data || [];
  const properties: TProperty[] = propertiesResult?.data || [];
  const rentalRequests: TRentalRequest[] = rentalRequestsResult?.data || [];
  const categories: TCategory[] = categoriesResult?.data || [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
          <ShieldCheck className="size-4" />
          {user.role}
        </Badge>
      </div>

      <div className="mt-8">
        <AdminTabs
          users={users}
          properties={properties}
          rentalRequests={rentalRequests}
          categories={categories}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
