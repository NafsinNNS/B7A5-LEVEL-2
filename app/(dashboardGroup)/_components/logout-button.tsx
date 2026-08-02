"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { logout } from "@/service/logout";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={handleLogout}
      disabled={pending}
    >
      {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
      Log out
    </Button>
  );
}
