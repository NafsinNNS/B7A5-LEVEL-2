"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateUserStatus } from "../_actions/adminActions";
import type { TRole, TUser } from "@/lib/types";

const roleVariant: Record<TRole, "default" | "secondary" | "warning"> = {
  TENANT: "secondary",
  LANDLORD: "warning",
  ADMIN: "default",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type UsersListProps = {
  users: TUser[];
  currentUserId: string;
};

export function UsersList({ users, currentUserId }: UsersListProps) {
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleToggleStatus = (user: TUser) => {
    const nextStatus =
      user.activeStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (
      !window.confirm(
        `${nextStatus === "ACTIVE" ? "Activate" : "Deactivate"} "${
          user.name
        }"?`
      )
    ) {
      return;
    }
    setPendingUserId(user.id);
    startTransition(async () => {
      const result = await updateUserStatus(user.id, nextStatus);
      setPendingUserId(null);
      if (result?.success) {
        toast.success(`${user.name} marked as ${nextStatus.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update user status");
      }
    });
  };

  return (
    <>
      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
          <Users className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No users found</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => {
            const isPending = pendingUserId === user.id;
            const isSelf = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{user.name}</h3>
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                      <Badge
                        variant={
                          user.activeStatus === "ACTIVE"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {user.activeStatus}
                      </Badge>
                      {isSelf && (
                        <Badge variant="outline">You</Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-primary" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-primary" />
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  {isSelf ? (
                    <Button variant="outline" disabled>
                      <ShieldCheck />
                      Admin
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : user.activeStatus === "ACTIVE" ? (
                        <Ban />
                      ) : (
                        <CheckCircle2 />
                      )}
                      {user.activeStatus === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
