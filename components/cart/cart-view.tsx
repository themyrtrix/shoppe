"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { notifyCartUpdated } from "@/components/cart/cart-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Item = { id: string; quantity: number; variant: { id: string; name: string; stock: number; priceCents: number | null; product: { name: string; slug: string; images: string[]; priceCents: number } } };
export function CartView() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  async function load() { const response = await fetch("/api/cart"); const body = await response.json(); setItems(body.items ?? []); notifyCartUpdated(); }
  // Cart data is an external resource and is loaded once after hydration.
  useEffect(() => { void load(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  async function update(variantId: string, quantity: number) { const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantId, quantity }) }); const body = await response.json(); if (!response.ok) setError(body.error); else { setItems(body.items ?? []); notifyCartUpdated(); } }
  const subtotal = items.reduce((sum, item) => sum + (item.variant.priceCents ?? item.variant.product.priceCents) * item.quantity, 0);
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><h1 className="text-2xl font-bold">Shopping cart</h1>{error && <p className="mt-3 text-sm text-destructive">{error}</p>}{!items.length ? <Card className="mt-10"><CardContent className="p-10 text-center"><p className="text-muted-foreground">Your cart is empty.</p><Link href="/products" className={buttonVariants({ className: "mt-4" })}>Start shopping</Link></CardContent></Card> : <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"><Card><CardContent className="divide-y p-0">{items.map((item) => { const price = item.variant.priceCents ?? item.variant.product.priceCents; return <div key={item.id} className="flex gap-4 p-4"><Image src={item.variant.product.images[0]} alt="" width={96} height={96} className="rounded object-cover" /><div className="min-w-0 flex-1"><Link href={`/products/${item.variant.product.slug}`} className="font-medium hover:text-primary">{item.variant.product.name}</Link><p className="text-sm text-muted-foreground">{item.variant.name}</p><p className="mt-2 font-semibold text-primary">{formatPrice(price)}</p><div className="mt-2 flex items-center gap-2"><Button type="button" variant="outline" size="icon-sm" onClick={() => void update(item.variant.id, item.quantity - 1)} aria-label="Decrease quantity">−</Button><span>{item.quantity}</span><Button type="button" variant="outline" size="icon-sm" onClick={() => void update(item.variant.id, item.quantity + 1)} aria-label="Increase quantity">+</Button><Button type="button" variant="ghost" className="ml-3 text-sm text-destructive" onClick={() => void update(item.variant.id, 0)}>Remove</Button></div></div><p className="font-semibold">{formatPrice(price * item.quantity)}</p></div>; })}</CardContent></Card><Card className="h-fit"><CardHeader><CardTitle className="text-base">Order summary</CardTitle></CardHeader><CardContent><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div><Separator className="my-4" /><div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{formatPrice(subtotal)}</span></div><Link href="/checkout" className={buttonVariants({ className: "mt-5 w-full" })}>Proceed to checkout</Link></CardContent></Card></div>}</div>;
}
