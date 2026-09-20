import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "/categories/electronics.jpg",
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "/categories/fashion.jpg",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image: "/categories/home-living.jpg",
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "/categories/beauty.jpg",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "/categories/sports-outdoors.jpg",
  },
  {
    name: "Toys & Hobbies",
    slug: "toys-hobbies",
    image: "/categories/toys-hobbies.jpg",
  },
  {
    name: "Groceries",
    slug: "groceries",
    image: "/categories/groceries.jpg",
  },
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    image: "/categories/pet-supplies.jpg",
  },
] satisfies Array<{ name: string; slug: string; image: string }>;

type ProductSeed = [name: string, categorySlug: string, priceCents: number, compareAtPriceCents: number];

const products: ProductSeed[] = [
  ["Wireless Earbuds Pro", "electronics", 129900, 169900],
  ["Portable Bluetooth Speaker", "electronics", 89900, 119900],
  ["USB-C Fast Charger", "electronics", 49900, 69900],
  ["Mechanical Keyboard", "electronics", 219900, 279900],
  ["Wireless Gaming Mouse", "electronics", 99900, 139900],
  ["Smart LED Desk Lamp", "electronics", 79900, 109900],
  ["Oversized Cotton T-Shirt", "fashion", 39900, 59900],
  ["Everyday Canvas Sneakers", "fashion", 149900, 199900],
  ["Classic Baseball Cap", "fashion", 29900, 49900],
  ["Minimalist Crossbody Bag", "fashion", 89900, 129900],
  ["Linen Button-Up Shirt", "fashion", 79900, 109900],
  ["Stainless Water Bottle", "home-living", 59900, 89900],
  ["Ceramic Coffee Mug Set", "home-living", 69900, 99900],
  ["Memory Foam Pillow", "home-living", 99900, 149900],
  ["Bamboo Desk Organizer", "home-living", 49900, 69900],
  ["Non-Stick Frying Pan", "home-living", 129900, 169900],
  ["LED String Lights", "home-living", 44900, 64900],
  ["Hydrating Face Cleanser", "beauty", 54900, 79900],
  ["Daily Sunscreen SPF50", "beauty", 69900, 89900],
  ["Velvet Lip Tint", "beauty", 39900, 59900],
  ["Hair Repair Treatment", "beauty", 89900, 119900],
  ["Yoga Mat", "sports-outdoors", 89900, 129900],
  ["Adjustable Dumbbell", "sports-outdoors", 249900, 329900],
  ["Running Waist Bag", "sports-outdoors", 59900, 79900],
  ["Insulated Picnic Cooler", "sports-outdoors", 119900, 159900],
  ["Building Blocks Set", "toys-hobbies", 109900, 149900],
  ["Watercolor Paint Kit", "toys-hobbies", 79900, 109900],
  ["Plush Teddy Bear", "toys-hobbies", 69900, 99900],
  ["Premium Ground Coffee", "groceries", 49900, 69900],
  ["Organic Green Tea", "groceries", 34900, 49900],
  ["Assorted Snack Box", "groceries", 79900, 99900],
  ["Grain-Free Dog Treats", "pet-supplies", 44900, 64900],
  ["Cat Interactive Toy", "pet-supplies", 29900, 49900],
  ["Washable Pet Bed", "pet-supplies", 139900, 189900],
];

const productImages = [
  "/products/wireless-earbuds-pro.jpg",
  "/products/portable-bluetooth-speaker.jpg",
  "/products/usb-c-fast-charger.jpg",
  "/products/mechanical-keyboard.jpg",
  "/products/wireless-gaming-mouse.jpg",
  "/products/smart-led-desk-lamp.jpg",
  "/products/oversized-cotton-t-shirt.jpg",
  "/products/everyday-canvas-sneakers.jpg",
  "/products/classic-baseball-cap.jpg",
  "/products/minimalist-crossbody-bag.jpg",
  "/products/linen-button-up-shirt.jpg",
  "/products/stainless-water-bottle.jpg",
  "/products/ceramic-coffee-mug-set.jpg",
  "/products/memory-foam-pillow.jpg",
  "/products/bamboo-desk-organizer.jpg",
  "/products/non-stick-frying-pan.jpg",
  "/products/led-string-lights.jpg",
  "/products/hydrating-face-cleanser.jpg",
  "/products/daily-sunscreen-spf50.jpg",
  "/products/velvet-lip-tint.jpg",
  "/products/hair-repair-treatment.jpg",
  "/products/yoga-mat.jpg",
  "/products/adjustable-dumbbell.jpg",
  "/products/running-waist-bag.jpg",
  "/products/insulated-picnic-cooler.jpg",
  "/products/building-blocks-set.jpg",
  "/products/watercolor-paint-kit.jpg",
  "/products/plush-teddy-bear.jpg",
  "/products/premium-ground-coffee.jpg",
  "/products/organic-green-tea.jpg",
  "/products/assorted-snack-box.jpg",
  "/products/grain-free-dog-treats.jpg",
  "/products/cat-interactive-toy.jpg",
  "/products/washable-pet-bed.jpg",
];

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoryRecords = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category })),
  );
  const categoryBySlug = new Map<string, string>(
    categoryRecords.map((category: { slug: string; id: string }) => [
      category.slug,
      category.id,
    ]),
  );

  for (const [index, [name, categorySlug, priceCents, compareAtPriceCents]] of products.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryId = categoryBySlug.get(categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for product: ${name}`);
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        description: `A carefully selected ${name.toLowerCase()} for everyday use.`,
        priceCents,
        compareAtPriceCents,
        stock: 40 + (index % 6) * 10,
        images: [productImages[index]],
        isFlashSale: index < 10,
        category: {
          connect: { id: categoryId },
        },
        variants: {
          create: {
            name: "Default",
            sku: `SHOPPE-${String(index + 1).padStart(3, "0")}`,
            stock: 40 + (index % 6) * 10,
          },
        },
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
