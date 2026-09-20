import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const cartSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
});

async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to use your cart." }, { status: 401 });
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { variant: { include: { product: true } } }, orderBy: { createdAt: "asc" } } },
  });
  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to use your cart." }, { status: 401 });
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  const variant = await prisma.productVariant.findUnique({ where: { id: parsed.data.variantId } });
  if (!variant || parsed.data.quantity > variant.stock) {
    return NextResponse.json({ error: "This item is out of stock." }, { status: 400 });
  }
  const cart = await prisma.cart.upsert({ where: { userId }, create: { userId }, update: {} });
  if (parsed.data.quantity === 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId: variant.id } });
  } else {
    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
      create: { cartId: cart.id, variantId: variant.id, quantity: parsed.data.quantity },
      update: { quantity: parsed.data.quantity },
    });
  }
  return GET();
}
