import Link from "next/link";
import {
  AtSign,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const footerColumns = [
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/#why-rentnest" },
      { title: "How It Works", href: "/#how-it-works" },
      { title: "Browse Rentals", href: "/rentals" },
      { title: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "For Tenants",
    links: [
      { title: "Find a Home", href: "/rentals" },
      { title: "Rental Requests", href: "/dashboard" },
      { title: "Payment Guide", href: "/#how-it-works" },
      { title: "Safety Tips", href: "/#why-rentnest" },
    ],
  },
  {
    title: "For Landlords",
    links: [
      { title: "List a Property", href: "/register" },
      { title: "Manage Requests", href: "/landlord-dashboard" },
      { title: "Tenant Screening", href: "/#why-rentnest" },
      { title: "Landlord FAQ", href: "/#how-it-works" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              RentNest helps you discover verified rental properties and rent
              with confidence. From cozy studios to family homes — find the
              place that feels like yours.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Globe, label: "Website" },
                { icon: AtSign, label: "Email" },
                { icon: MessageCircle, label: "Chat" },
                { icon: Share2, label: "Social" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 grid gap-2.5">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t pt-8 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +880 1XXX-XXXXXX
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> hello@rentnest.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Dhaka, Bangladesh
            </span>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
