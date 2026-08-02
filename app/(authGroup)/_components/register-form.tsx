"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Loader2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerAction } from "../_actions/authActions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Creating account...
        </>
      ) : (
        <>
          <UserPlus /> Create account
        </>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"TENANT" | "LANDLORD">("TENANT");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) toast.error(error);
  }, [searchParams]);

  return (
    <form action={registerAction} className="grid gap-5">
      <div className="grid gap-2">
        <Label>I am a...</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("TENANT")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all",
              role === "TENANT"
                ? "border-primary bg-primary/5 text-primary"
                : "border-input text-muted-foreground hover:border-primary/40"
            )}
          >
            <Users className="size-6" />
            Tenant
            <span className="text-xs font-normal text-muted-foreground">
              Looking for a home
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("LANDLORD")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all",
              role === "LANDLORD"
                ? "border-primary bg-primary/5 text-primary"
                : "border-input text-muted-foreground hover:border-primary/40"
            )}
          >
            <Building2 className="size-6" />
            Landlord
            <span className="text-xs font-normal text-muted-foreground">
              Renting out property
            </span>
          </button>
        </div>
        <input type="hidden" name="role" value={role} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Min 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      <SubmitButton />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
