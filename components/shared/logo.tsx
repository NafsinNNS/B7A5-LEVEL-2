import Link from "next/link";
import { Home } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  iconClassName?: string;
};

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
          iconClassName
        )}
      >
        <Home className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Rent<span className="text-primary">Nest</span>
      </span>
    </Link>
  );
}
