import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrdersView } from "@/components/orders/orders-view";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ tab?: string; placed?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/orders");
  const params = await searchParams;
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, include: { items: true }, orderBy: { placedAt: "desc" } });
  return <OrdersView orders={orders} initialTab={params.tab} placed={params.placed} />;
}
