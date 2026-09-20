import Link from "next/link";

import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProductGrid } from "@/components/catalog/product-grid";
import { getHomeCatalog } from "@/lib/data/catalog";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const { categories, flashSaleProducts, products } = await getHomeCatalog();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-md bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Shoppe daily finds
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Great finds. Better everyday prices.
          </h1>
          <p className="mt-4 max-w-lg text-sm text-white/85 sm:text-base">
            Discover useful things for your home, style, hobbies, and everyday life.
          </p>
          <Link href="#products" className={buttonVariants({ className: "mt-6 bg-white text-primary hover:bg-white/90" })}>Shop now</Link>
        </div>
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-24 h-80 w-80 rounded-full bg-black/10" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Shop by category</h2>
        <CategoryGrid categories={categories} />
      </section>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="flex-row items-center justify-between bg-primary/5 px-4 py-3 sm:px-5">
          <CardTitle className="text-xl text-primary">Flash sale</CardTitle>
          <Link href="/products?flashSale=true" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <ProductGrid products={flashSaleProducts} />
        </CardContent>
      </Card>

      <section id="products" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">Recommended</p>
            <h2 className="text-xl font-bold">Just for you</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}