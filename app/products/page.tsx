import Link from "next/link";

import { ProductGrid } from "@/components/catalog/product-grid";
import { SortSelect } from "@/components/catalog/sort-select";
import { prisma } from "@/lib/prisma";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    flashSale?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const categorySlug = params.category;
  const isFlashSale = params.flashSale === "true";
  const pageSize = 12;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const sort = params.sort === "price-asc" || params.sort === "price-desc"
    ? params.sort
    : "newest";
  const orderBy =
    sort === "price-asc"
      ? { priceCents: "asc" as const }
      : sort === "price-desc"
        ? { priceCents: "desc" as const }
        : { createdAt: "desc" as const };
  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
            { category: { name: { contains: query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(isFlashSale ? { isFlashSale: true } : {}),
  };

  const [pagedProducts, categories, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.count({ where }),
  ]);

  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const title = isFlashSale
    ? "Flash sale"
    : query
      ? `Search results for "${query}"`
      : selectedCategory?.name ?? "All products";
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  function pageHref(nextPage: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("q", query);
    if (categorySlug) nextParams.set("category", categorySlug);
    if (isFlashSale) nextParams.set("flashSale", "true");
    if (sort !== "newest") nextParams.set("sort", sort);
    nextParams.set("page", String(nextPage));
    return `/products?${nextParams.toString()}`;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Browse</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalProducts} {totalProducts === 1 ? "product" : "products"}
            </p>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            Clear filters
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/products"
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
            !categorySlug && !isFlashSale
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
              category.slug === categorySlug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary"
            }`}
          >
            {category.name}
          </Link>
        ))}
        <Link
          href="/products?flashSale=true"
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
            isFlashSale
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary"
          }`}
        >
          Flash sale
        </Link>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Sort by</span>
          <SortSelect
            value={sort}
            query={query}
            categorySlug={categorySlug}
            isFlashSale={isFlashSale}
          />
        </div>
      </div>

      <ProductGrid products={pagedProducts} />

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Product pages">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="rounded-sm border border-border bg-card px-3 py-2 text-sm hover:border-primary">
              Previous
            </Link>
          )}
          <span className="px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="rounded-sm border border-border bg-card px-3 py-2 text-sm hover:border-primary">
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
