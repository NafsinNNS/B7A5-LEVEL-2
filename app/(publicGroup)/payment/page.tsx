import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaymentPageProps = {
  searchParams: Promise<{ success?: string }>;
};

const PaymentPage = async ({ searchParams }: PaymentPageProps) => {
  const params = await searchParams;
  const isSuccess = params.success === "true";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-md">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-100 text-emerald-600"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="size-9" />
          ) : (
            <XCircle className="size-9" />
          )}
        </div>

        <h1 className="font-heading mt-5 text-2xl font-bold tracking-tight">
          {isSuccess ? "Payment Completed" : "Payment Cancelled"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isSuccess
            ? "Your rent payment was processed successfully. Your landlord has been notified and your rental request is now active."
            : "The payment was not completed. You can try again from your dashboard whenever you are ready."}
        </p>

        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {isSuccess ? (
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-4" />
              Receipt available on your dashboard
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-4" />
              No charge was made
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-2">
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Go to Dashboard
              <ArrowRight />
            </Button>
          </Link>
          <Link href="/rentals">
            <Button size="lg" variant="outline" className="w-full">
              Browse more rentals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
