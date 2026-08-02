import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Check,
  MapPin,
  Ruler,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { RentalRequestButton } from "@/components/property/rental-request-button";
import {
  formatPrice,
  getPropertyImage,
} from "@/components/property/property-card";
import { getPropertyById } from "../../_actions/getProperties";
import { getMe } from "@/service/getMe";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

const PropertyDetailPage = async ({ params }: PropertyDetailPageProps) => {
  const { id } = await params;
  const [result, userResult] = await Promise.all([
    getPropertyById(id),
    getMe(),
  ]);

  const property = result?.success ? result?.data : null;

  if (!property) {
    notFound();
  }

  const isLoggedIn = userResult?.success && userResult?.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/rentals"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to all rentals
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* ====== Main column ====== */}
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-md">
            <Image
              src={getPropertyImage(property.id)}
              alt={property.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {property.title}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                  <MapPin className="size-4" />
                  {property.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-background/90 text-foreground backdrop-blur">
                  <Building2 className="size-3" />
                  {property.categoryName}
                </Badge>
                <Badge
                  variant={property.isAvailable ? "success" : "destructive"}
                  className="backdrop-blur"
                >
                  {property.isAvailable ? "Available" : "Rented"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">About this property</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </div>

          {property.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Amenities</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-xl border bg-card px-4 py-3"
                  >
                    {amenity.toLowerCase().includes("bed") ? (
                      <BedDouble className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Ruler className="size-4 shrink-0 text-primary" />
                    )}
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ====== Sidebar ====== */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="gap-0 overflow-hidden p-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Monthly Rent
              </p>
              <p className="font-heading mt-1 text-3xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>

              <div className="mt-5 grid gap-2.5 border-t pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{property.categoryName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{property.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span
                    className={
                      property.isAvailable
                        ? "font-medium text-emerald-600"
                        : "font-medium text-destructive"
                    }
                  >
                    {property.isAvailable ? "Available now" : "Currently rented"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {isLoggedIn ? (
                  <RentalRequestButton propertyId={property.id} />
                ) : (
                  <Link href={`/login?redirect=/rentals/${property.id}`}>
                    <Button size="lg" className="w-full">
                      Log in to rent this
                    </Button>
                  </Link>
                )}
                <Link href="/rentals">
                  <Button size="lg" variant="outline" className="w-full">
                    Browse more rentals
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  This listing is managed by a verified landlord on RentNest.
                  Payments are processed securely through Stripe.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Check className="size-3.5 text-emerald-500" />
            No hidden fees · Transparent pricing
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
