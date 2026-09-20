"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect({
  value,
  query,
  categorySlug,
  isFlashSale,
}: {
  value: string;
  query: string;
  categorySlug?: string;
  isFlashSale: boolean;
}) {
  const router = useRouter();

  function changeSort(nextValue: string | null) {
    if (!nextValue) return;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categorySlug) params.set("category", categorySlug);
    if (isFlashSale) params.set("flashSale", "true");
    if (nextValue !== "newest") params.set("sort", nextValue);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <Select value={value} onValueChange={changeSort}>
      <SelectTrigger className="w-48 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to high</SelectItem>
        <SelectItem value="price-desc">Price: High to low</SelectItem>
      </SelectContent>
    </Select>
  );
}
