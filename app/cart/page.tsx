import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CartView } from "@/components/cart/cart-view";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/cart");
  return <CartView />;
}
