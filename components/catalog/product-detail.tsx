"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { notifyCartUpdated } from "@/components/cart/cart-badge";

type Product = { id: string; name: string; slug: string; description: string; priceCents: number; compareAtPriceCents: number | null; stock: number; images: string[]; category: { name: string; slug: string }; variants: Array<{ id: string; name: string; sku: string; priceCents: number | null; stock: number }> };

export function ProductDetail({ product }: { product: Product }) {
  const [image, setImage] = useState(0);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const variant = product.variants.find((item) => item.id === variantId);
  const price = variant?.priceCents ?? product.priceCents;
  const stock = variant?.stock ?? product.stock;
  async function addToCart() {
    if (!variantId) return setMessage("This product is unavailable.");
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantId, quantity }) });
    const body = await response.json();
    if (response.status === 401) return router.push(`/login?callbackUrl=/products/${product.slug}`);
    if (response.ok) {
      notifyCartUpdated();
      setMessage("Added to cart!");
    } else {
      setMessage(body.error);
    }
  }
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted"><Image src={product.images[image]} alt={product.name} fill priority className="object-cover" /></div>
        <div className="flex gap-2 overflow-auto">{product.images.map((src, index) => <button type="button" key={src} onClick={() => setImage(index)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border ${image === index ? "border-primary" : "border-border"}`}><Image src={src} alt="" fill className="object-cover" /></button>)}</div>
      </div>
      <div className="space-y-5">
        <div><Link href={`/products?category=${product.category.slug}`} className="text-sm text-primary hover:underline">{product.category.name}</Link><h1 className="mt-2 text-3xl font-bold">{product.name}</h1><p className="mt-3 text-muted-foreground">{product.description}</p></div>
        <div><span className="text-3xl font-semibold text-primary">{formatPrice(price)}</span>{product.compareAtPriceCents && <span className="ml-3 text-muted-foreground line-through">{formatPrice(product.compareAtPriceCents)}</span>}</div>
        <div className="space-y-2"><p className="text-sm font-medium">Variant</p><div className="flex flex-wrap gap-2">{product.variants.map((item) => <button type="button" key={item.id} disabled={!item.stock} onClick={() => setVariantId(item.id)} className={`rounded border px-3 py-2 text-sm ${variantId === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border"} disabled:cursor-not-allowed disabled:opacity-40`}>{item.name}</button>)}</div></div>
        <div className="flex items-center gap-4"><span className="text-sm font-medium">Quantity</span><div className="flex items-center rounded border border-border"><button type="button" className="px-3 py-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span className="w-10 text-center">{quantity}</span><button type="button" className="px-3 py-2" onClick={() => setQuantity(Math.min(stock, quantity + 1))}>+</button></div><span className="text-sm text-muted-foreground">{stock} available</span></div>
        <button type="button" disabled={!stock} onClick={addToCart} className="h-11 w-full rounded bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Add to cart</button>
        {message && <p className="text-sm text-primary">{message}</p>}
      </div>
    </div>
  );
}
