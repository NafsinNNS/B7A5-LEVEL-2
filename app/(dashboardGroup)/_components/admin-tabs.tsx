"use client";

import { useState } from "react";
import { Building2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UsersList } from "./users-list";
import { AdminPropertiesList } from "./admin-properties-list";
import type { TProperty, TUser } from "@/lib/types";

type AdminTabsProps = {
  users: TUser[];
  properties: TProperty[];
  currentUserId: string;
};

type Tab = "users" | "properties";

export function AdminTabs({
  users,
  properties,
  currentUserId,
}: AdminTabsProps) {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {tab === "users" ? (
            <Users className="size-5 text-primary" />
          ) : (
            <Building2 className="size-5 text-primary" />
          )}
          <h2 className="text-lg font-semibold">
            {tab === "users" ? "All Users" : "All Properties"}
          </h2>
          <Badge variant="outline">
            {tab === "users" ? users.length : properties.length}
          </Badge>
        </div>
        <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "users"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            Users
          </button>
          <button
            type="button"
            onClick={() => setTab("properties")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "properties"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-4" />
            Properties
          </button>
        </div>
      </div>

      <div className="mt-4">
        {tab === "users" ? (
          <UsersList users={users} currentUserId={currentUserId} />
        ) : (
          <AdminPropertiesList properties={properties} />
        )}
      </div>
    </div>
  );
}
