import type { Metadata } from "next";
import { Instrument_Sans, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSansHeading = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RentNest — Find Your Perfect Home",
  description:
    "Discover rental apartments, houses, studios and rooms. RentNest connects tenants with trusted landlords for a seamless renting experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        instrumentSansHeading.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
