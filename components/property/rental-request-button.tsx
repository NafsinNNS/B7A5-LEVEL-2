"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createRentalRequest } from "@/app/(publicGroup)/_actions/rentalActions";

type RentalRequestButtonProps = {
  propertyId: string;
};

export function RentalRequestButton({ propertyId }: RentalRequestButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRequest = async () => {
    if (pending) return;
    if (sent) {
      toast.info("Rental request already sent for this property");
      return;
    }

    setPending(true);
    try {
      const result = await createRentalRequest(propertyId);
      if (result?.success) {
        setSent(true);
        toast.success("Rental request sent! The landlord will review it.");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to send rental request");
      }
    } catch {
      toast.error("Failed to send rental request");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleRequest}
      disabled={pending || sent}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : sent ? (
        <Check />
      ) : (
        <KeyRound />
      )}
      {pending
        ? "Sending request..."
        : sent
          ? "Request Sent"
          : "Rent Now"}
    </Button>
  );
}
