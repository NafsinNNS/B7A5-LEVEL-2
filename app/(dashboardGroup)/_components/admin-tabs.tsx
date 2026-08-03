"use client";

import { useState } from "react";
import { Building2, CreditCard, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UsersList } from "./users-list";
import { AdminPropertiesList } from "./admin-properties-list";
import { AdminRentalRequestsList } from "./admin-rental-requests-list";
import type { TProperty, TRentalRequest, TUser } from "@/lib/types";

type AdminTabsProps = {
  users: TUser[];
  properties: TProperty[];
  rentalRequests: TRentalRequest[];
  currentUserId: string;
};

type Tab = "users" | "properties" | "rentals";

export function AdminTabs({
  users,
  properties,
  rentalRequests,
  currentUserId,
}: AdminTabsProps) {
  const [tab, setTab] = useState<Tab>("users");

  const tabMeta: Record<
    Tab,
    { label: string; icon: typeof Users; count: number }
  > = {
    users: { label: "Users", icon: Users, count: users.length },
    properties: {
      label: "Properties",
      icon: Building2,
      count: properties.length,
    },
    rentals: {
      label: "Rentals",
      icon: CreditCard,
      count: rentalRequests.length,
    },
  };

  const active = tabMeta[tab];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <active.icon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">All {active.label}</h2>
          <Badge variant="outline">{active.count}</Badge>
        </div>
        <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
          {(Object.keys(tabMeta) as Tab[]).map((key) => {
            const meta = tabMeta[key];
            const Icon = meta.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {tab === "users" && (
          <UsersList users={users} currentUserId={currentUserId} />
        )}
        {tab === "properties" && (
          <AdminPropertiesList properties={properties} />
        )}
        {tab === "rentals" && (
          <AdminRentalRequestsList requests={rentalRequests} />
        )}
      </div>
    </div>
  );
}
