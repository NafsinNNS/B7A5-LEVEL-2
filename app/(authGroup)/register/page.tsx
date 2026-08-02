import Link from "next/link";
import { UserPlus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "../_components/register-form";

const RegisterPage = () => {
  return (
    <div className="w-full max-w-md">
      <Card className="gap-0 p-0 shadow-lg">
        <CardHeader className="items-center gap-3 border-b py-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="size-6" />
          </span>
          <div>
            <CardTitle className="text-2xl font-bold">
              Create your account
            </CardTitle>
            <CardDescription className="mt-1">
              Join RentNest as a tenant or landlord
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        By registering, you agree to RentNest&apos;s{" "}
        <Link href="#" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default RegisterPage;
