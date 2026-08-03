import { redirect } from "next/navigation";
import {
  Building2,
  Clock,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { getMe } from "@/service/getMe";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import {
  getAdminUsers,
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
      getAdminUsers({ page: 1, limit: 10 }),
      getAllProperties(),
      getAllRentalRequests(),
      getCategories(),
    ]);

  const users: TUser[] = usersResult?.data?.users || [];
  const totalUsers = usersResult?.data?.meta?.total ?? users.length;
  const properties: TProperty[] = propertiesResult?.data || [];
  const rentalRequests: TRentalRequest[] = rentalRequestsResult?.data || [];
  const categories: TCategory[] = categoriesResult?.data || [];

  const pendingRequests = rentalRequests.filter(
    (request) => request.approveStatus === "PENDING"
  );
  const approvedRequests = rentalRequests.filter(
    (request) => request.approveStatus === "APPROVED"
  );

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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          hint={`${users.filter((user) => user.role === "TENANT").length} tenants on page`}
        />
        <StatCard
          icon={Building2}
          label="Total Properties"
          value={properties.length}
          hint={`${categories.length} categories`}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={pendingRequests.length}
          hint="Awaiting landlord action"
        />
        <StatCard
          icon={ShieldCheck}
          label="Approved Requests"
          value={approvedRequests.length}
          hint={`${rentalRequests.length} total`}
        />
      </div>

      <div className="mt-8">
        <AdminTabs
          users={users}
          totalUsers={totalUsers}
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
