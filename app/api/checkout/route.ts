import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { shippingRates } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  addressId: z.string().optional(),
  address: z.object({
    recipientName: z.string().min(2),
    phone: z.string().min(7),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    province: z.string().min(2),
    postalCode: z.string().min(3),
    label: z.string().default("Home"),
  }).optional(),
  shippingOption: z.enum(["STANDARD", "EXPRESS"]),
  paymentMethod: z.enum(["COD", "MOCK"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please complete your delivery details." }, { status: 400 });
  const { user } = session;
  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });
      if (!cart?.items.length) throw new Error("Your cart is empty.");
      let addressId = parsed.data.addressId;
      let address = addressId ? await tx.address.findFirst({ where: { id: addressId, userId: user.id } }) : null;
      if (parsed.data.address) {
        address = await tx.address.create({ data: { ...parsed.data.address, userId: user.id, isDefault: false } });
        addressId = address.id;
      }
      if (!address) throw new Error("Choose or add a delivery address.");
      let subtotalCents = 0;
      for (const item of cart.items) {
        if (item.quantity > item.variant.stock) throw new Error(`${item.variant.product.name} is no longer available in that quantity.`);
        subtotalCents += (item.variant.priceCents ?? item.variant.product.priceCents) * item.quantity;
      }
      const shippingFeeCents = shippingRates[parsed.data.shippingOption];
      const created = await tx.order.create({
        data: {
          userId: user.id, addressId, status: parsed.data.paymentMethod === "MOCK" ? "TO_SHIP" : "TO_PAY",
          paymentMethod: parsed.data.paymentMethod, shippingOption: parsed.data.shippingOption,
          recipientName: address.recipientName, phone: address.phone,
          addressLine: [address.line1, address.line2, address.city, address.province, address.postalCode].filter(Boolean).join(", "),
          shippingFeeCents, subtotalCents, totalCents: subtotalCents + shippingFeeCents,
          items: { create: cart.items.map((item) => ({
            variantId: item.variantId, productName: item.variant.product.name, variantName: item.variant.name,
            sku: item.variant.sku, unitPriceCents: item.variant.priceCents ?? item.variant.product.priceCents, quantity: item.quantity,
          })) },
        },
      });
      for (const item of cart.items) {
        const reserved = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) {
          throw new Error(`${item.variant.product.name} is no longer available in that quantity.`);
        }
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to place order." }, { status: 400 });
  }
}
