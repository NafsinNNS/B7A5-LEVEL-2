"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  User as UserIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { logout } from "@/service/logout";
import { cn } from "@/lib/utils";
import type { TApiResponse, TUser } from "@/lib/types";

type NavbarProps = {
  user: TApiResponse<TUser | null>;
};

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Browse Rentals", href: "/rentals" },
  { title: "How It Works", href: "/#how-it-works" },
  { title: "About", href: "/#why-rentnest" },
];

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = user?.success && user?.data;

  const getDashboardHref = (role?: string) => {
    if (role === "ADMIN") return "/admin-dashboard";
    if (role === "LANDLORD") return "/landlord-dashboard";
    return "/dashboard";
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-1 outline-none ring-primary transition-shadow hover:ring-2"
              >
                <Avatar className="size-9">
                  <AvatarImage src="" alt={user.data!.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.data!.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    menuOpen && "rotate-180"
                  )}
                />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border bg-popover p-1.5 shadow-lg">
                    <div className="border-b px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">
                        {user.data!.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.data!.email}
                      </p>
                      <span className="mt-1.5 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
                        {user.data!.role}
                      </span>
                    </div>
                    <div className="grid gap-0.5 pt-1.5">
                      <Link
                        href={getDashboardHref(user.data?.role)}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="size-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <UserIcon className="size-4 text-muted-foreground" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <PlusCircle />
                  List a Property
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="inline-flex size-9 items-center justify-center rounded-md border bg-background lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href={getDashboardHref(user.data?.role)}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="secondary" className="w-full">
                      <LayoutDashboard />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">
                      <PlusCircle />
                      List a Property
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
