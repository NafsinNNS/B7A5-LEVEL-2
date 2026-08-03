import Image from "next/image";
import { Building2 } from "lucide-react";

type PropertyImageProps = {
  src?: string | null;
  alt: string;
  sizes?: string;
};

export function PropertyImage({ src, alt, sizes }: PropertyImageProps) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-secondary">
        <Building2 className="size-12 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className="object-cover"
    />
  );
}
