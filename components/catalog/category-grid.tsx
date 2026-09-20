import Image from "next/image";
import Link from "next/link";

type CategoryGridProps = {
  categories: Array<{ name: string; slug: string; image: string | null }>;
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-sm border border-border bg-card p-2 text-center shadow-sm hover:border-primary"
        >
          <span className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
            {category.image ? (
              <Image
                src={category.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-sm font-bold text-primary">
                {category.name.charAt(0)}
              </span>
            )}
          </span>
          <span className="line-clamp-2 text-xs font-medium group-hover:text-primary">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
