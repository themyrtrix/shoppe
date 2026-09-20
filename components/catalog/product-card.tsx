import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    images: string[];
    priceCents: number;
    compareAtPriceCents: number | null;
    category: { name: string };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPriceCents
    ? Math.round(
        (1 - product.priceCents / product.compareAtPriceCents) * 100,
      )
    : null;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-sm border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <Badge className="absolute right-0 top-0 rounded-none">
            -{discount}%
          </Badge>
        )}
      </div>
      <CardContent className="space-y-2 p-3">
        <p className="truncate text-xs text-muted-foreground">{product.category.name}</p>
        <h3 className="line-clamp-2 min-h-10 text-sm text-card-foreground">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-primary">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtPriceCents && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPriceCents)}
            </span>
          )}
        </div>
      </CardContent>
      </Link>
    </Card>
  );
}
