import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">My account</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p className="mt-2 text-muted-foreground">{session.user.email}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/orders" className={buttonVariants()}>My orders</Link>
          <Link href="/cart" className={buttonVariants({ variant: "outline" })}>Shopping cart</Link>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
