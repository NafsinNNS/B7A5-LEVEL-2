import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-secondary/40 px-4 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="relative">
        <p className="font-heading bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-8xl font-bold text-transparent sm:text-9xl">
          404
        </p>
        <h1 className="font-heading mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back to finding your next home.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg">
              <Home />
              Back to Home
            </Button>
          </Link>
          <Link href="/rentals">
            <Button size="lg" variant="outline">
              <Search />
              Browse Rentals
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Looking for something else?{" "}
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Go home
          </Link>
        </p>
      </div>
    </div>
  );
}
