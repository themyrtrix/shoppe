import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id, userId: session.user.id, status: { in: ["TO_PAY", "TO_SHIP"] } },
      });
      if (!order) throw new Error("This order cannot be cancelled.");
      const items = await tx.orderItem.findMany({ where: { orderId: id, variantId: { not: null } } });
      await tx.order.update({ where: { id }, data: { status: "CANCELLED" } });
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId as string },
          data: { stock: { increment: item.quantity } },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "This order cannot be cancelled." },
      { status: 400 },
    );
  }
}
