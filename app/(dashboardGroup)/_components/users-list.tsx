"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminUsers, updateUserStatus } from "../_actions/adminActions";
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

const PAGE_SIZE = 10;

type UsersListProps = {
  initialUsers: TUser[];
  totalUsers: number;
  currentUserId: string;
};

export function UsersList({
  initialUsers,
  totalUsers,
  currentUserId,
}: UsersListProps) {
  const router = useRouter();
  const [users, setUsers] = useState<TUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalUsers);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))
  );
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1);
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    startTransition(async () => {
      const result = await getAdminUsers({
        searchTerm: debouncedTerm || undefined,
        page,
        limit: PAGE_SIZE,
      });
      if (result?.success) {
        setUsers(result.data.users);
        setTotal(result.data.meta.total);
        setTotalPages(Math.max(1, result.data.meta.totalPages));
      } else {
        toast.error(result?.message || "Failed to load users");
      }
    });
  }, [debouncedTerm, page]);

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
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, activeStatus: nextStatus }
              : u
          )
        );
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update user status");
      }
    });
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {from}–{to} of {total} users
        </p>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border bg-card p-5 shadow-sm"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed bg-card p-16 text-center">
          <Users className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No users found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
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
                      {isSelf && <Badge variant="outline">You</Badge>}
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

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </>
  );
}
