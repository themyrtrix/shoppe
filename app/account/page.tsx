import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">My account</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p className="mt-2 text-muted-foreground">{session.user.email}</p>
        <div className="mt-6 flex gap-3">
          <a href="/orders" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">My orders</a>
          <a href="/cart" className="rounded border border-border px-4 py-2 text-sm font-semibold">Shopping cart</a>
        </div>
      </section>
    </div>
  );
}
