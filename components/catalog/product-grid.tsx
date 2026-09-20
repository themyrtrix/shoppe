import { ProductCard } from "@/components/catalog/product-card";

type ProductGridProps = {
  products: Array<{
    name: string;
    slug: string;
    images: string[];
    priceCents: number;
    compareAtPriceCents: number | null;
    category: { name: string };
  }>;
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        No products found yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
