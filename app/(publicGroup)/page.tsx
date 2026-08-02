import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  DoorOpen,
  Home,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSearchBar } from "@/components/property/hero-search-bar";
import { PropertyCard } from "@/components/property/property-card";
import { getProperties } from "./_actions/getProperties";
import { getCategories } from "./_actions/getCategories";
import type { TCategory, TProperty } from "@/lib/types";

const categoryIcons: Record<string, typeof Building2> = {
  APARTMENT: Building2,
  HOUSE: Home,
  STUDIO: Sparkles,
  DUPLEX: Warehouse,
  ROOM: DoorOpen,
};

const steps = [
  {
    icon: Search,
    title: "Search Your Home",
    description:
      "Browse verified properties by location, category and budget. Filter through thousands of listings to find the perfect match.",
  },
  {
    icon: KeyRound,
    title: "Send a Rental Request",
    description:
      "Found something you love? Send a rental request instantly. Landlords review and approve requests in real time.",
  },
  {
    icon: CreditCard,
    title: "Pay & Move In",
    description:
      "Complete your booking with secure online payment. Get approved, pay the rent, and move into your new nest.",
  },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    description:
      "Every property is listed by a registered landlord. What you see is what you get — no fake listings.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Pay your rent safely through Stripe-powered checkout. Your transactions are fully protected.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description:
      "From city-centre apartments to peaceful suburban homes — find rentals in the best neighbourhoods.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description:
      "Clear monthly rates with no hidden fees. Know exactly what you pay before you commit.",
  },
];

export default async function HomePage() {
  const [categoriesResult, propertiesResult] = await Promise.all([
    getCategories(),
    getProperties({ sortBy: "createdAt", sortOrder: "desc" }),
  ]);

  const categories: TCategory[] = categoriesResult?.data || [];
  const properties: TProperty[] = (propertiesResult?.data || []).slice(0, 6);

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-secondary/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-24 top-40 size-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="success" className="mb-5">
              <Sparkles className="size-3" />
              #1 Trusted Rental Platform in Bangladesh
            </Badge>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary">Rental Home</span> With Ease
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Browse verified apartments, houses, studios and rooms. Connect
              with trusted landlords, send rental requests, and pay securely —
              all in one place.
            </p>

            <div className="mt-8">
              <HeroSearchBar categories={categories} />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
                alt="Modern rental home"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 0px, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-8 w-52 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop"
                alt="Cozy living room"
                width={208}
                height={140}
                unoptimized
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <div className="absolute -right-4 -top-6 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold">100% Verified</p>
                  <p className="text-xs text-muted-foreground">
                    Secure transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Browse by Category
            </p>
            <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Our Collections
            </h2>
          </div>
          <Link
            href="/rentals"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all rentals <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] ?? Building2;
            return (
              <Link
                key={category.id}
                href={`/rentals?categoryName=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-7" />
                </span>
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.name.toLowerCase().includes("apartment")
                    ? "City living"
                    : category.name.toLowerCase().includes("house")
                      ? "Family homes"
                      : "Explore options"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ FEATURED PROPERTIES ============ */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Handpicked for You
              </p>
              <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Featured Rentals
              </h2>
            </div>
            <Link
              href="/rentals"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              Explore all <ArrowRight className="size-4" />
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed bg-background p-16 text-center">
              <Building2 className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No properties listed yet. Check back soon!
              </p>
              <Link href="/register" className="mt-4 inline-block">
                <Button>
                  List your property <ArrowRight />
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link href="/rentals">
              <Button variant="outline">
                Explore all rentals <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Simple & Transparent
          </p>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How RentNest Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Renting your dream home has never been easier. Just three simple
            steps from search to move-in.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute right-6 top-6 font-heading text-5xl font-bold text-primary/10">
                0{index + 1}
              </span>
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <step.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHY RENTNEST ============ */}
      <section id="why-rentnest" className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
              Why Choose Us
            </p>
            <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A Smarter Way to Rent
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              We combine verified listings, secure payments and a seamless
              experience — built for both tenants and landlords.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur transition-colors hover:bg-primary-foreground/20"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground text-primary">
                  <feature.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/70 px-6 py-14 text-center text-primary-foreground shadow-xl sm:px-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Own a property? Earn with RentNest
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
              List your property for free and reach thousands of verified
              tenants. Manage requests and receive payments seamlessly.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Get Started Free <ArrowRight />
                </Button>
              </Link>
              <Link href="/rentals">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Browse Rentals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
