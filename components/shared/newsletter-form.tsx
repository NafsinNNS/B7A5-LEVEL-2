"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Subscribed! We'll keep you posted.");
    setEmail("");
  };

  return (
    <form
      className="flex w-full max-w-md gap-2 lg:ml-auto"
      onSubmit={handleSubscribe}
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Subscribe for new listings"
        aria-label="Email address"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
