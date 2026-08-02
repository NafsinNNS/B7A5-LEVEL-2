import { redirect } from "next/navigation";
import { BadgeCheck, CalendarDays, Mail, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMe } from "@/service/getMe";
import { LogoutButton } from "../../_components/logout-button";

const roleBadgeVariant: Record<
  string,
  "default" | "secondary" | "success" | "warning"
> = {
  ADMIN: "default",
  LANDLORD: "warning",
  TENANT: "secondary",
};

const formatJoinedDate = (date: string) => {
  const joined = new Date(date);
  if (Number.isNaN(joined.getTime())) return "—";
  return joined.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const MyProfilePage = async () => {
  const result = await getMe();
  const user = result?.success ? result?.data : null;

  if (!user) {
    redirect("/login");
  }

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading mb-6 text-3xl font-bold tracking-tight">
        My Profile
      </h1>

      <Card className="gap-0 overflow-hidden p-0 shadow-sm">
        <div className="h-28 bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex items-end gap-4">
            <Avatar className="size-24 rounded-2xl border-4 border-background shadow-md">
              <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={roleBadgeVariant[user.role] ?? "secondary"}>
                  {user.role}
                </Badge>
                <Badge
                  variant={
                    user.activeStatus === "ACTIVE" ? "success" : "destructive"
                  }
                >
                  {user.activeStatus}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="flex items-center gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <Mail className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email address</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <CalendarDays className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium">
                  {formatJoinedDate(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-secondary/40 px-4 py-3">
              <ShieldCheck className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Account ID</p>
                <p className="text-sm font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-emerald-500" />
              Verified account
            </p>
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfilePage;
