import { prisma } from "@/lib/prisma";

export async function getHomeCatalog() {
  const [categories, flashSaleProducts, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isFlashSale: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  return { categories, flashSaleProducts, products };
}
