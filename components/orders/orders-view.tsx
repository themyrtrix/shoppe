"use client";
import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Order = { id: string; status: string; totalCents: number; addressLine: string; placedAt: Date; items: Array<{ productName: string; variantName: string; quantity: number; unitPriceCents: number }> };
const tabs = [{ key: "ALL", label: "All" }, { key: "TO_PAY", label: "To pay" }, { key: "TO_SHIP", label: "To ship" }, { key: "TO_RECEIVE", label: "To receive" }, { key: "COMPLETED", label: "Completed" }, { key: "CANCELLED", label: "Cancelled" }];
const labels: Record<string, string> = { TO_PAY: "To pay", TO_SHIP: "To ship", TO_RECEIVE: "To receive", COMPLETED: "Completed", CANCELLED: "Cancelled" };
export function OrdersView({ orders, initialTab, placed }: { orders: Order[]; initialTab?: string; placed?: string }) {
  const [tab, setTab] = useState(initialTab ?? "ALL"); const [list, setList] = useState(orders); const [message, setMessage] = useState(placed ? "Order placed successfully." : "");
  const filtered = tab === "ALL" ? list : list.filter((order) => order.status === tab);
  async function cancel(id: string) { const response = await fetch(`/api/orders/${id}`, { method: "POST" }); const body = await response.json(); if (!response.ok) return setMessage(body.error); setList((current) => current.map((order) => order.id === id ? { ...order, status: "CANCELLED" } : order)); setMessage("Order cancelled."); }
  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><p className="text-sm text-muted-foreground">My account</p><h1 className="text-2xl font-bold">My orders</h1></div><Link href="/products" className="text-sm text-primary hover:underline">Continue shopping</Link></div>{message && <Alert className="mt-4"><AlertDescription>{message}</AlertDescription></Alert>}<Tabs value={tab} onValueChange={setTab} className="mt-6"><TabsList className="w-full justify-start overflow-auto"><>{tabs.map((item) => <TabsTrigger key={item.key} value={item.key}>{item.label}</TabsTrigger>)}</></TabsList></Tabs><div className="mt-5 space-y-4">{filtered.map((order) => <Card key={order.id}><CardHeader className="flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="text-sm font-normal text-muted-foreground">Order #{order.id.slice(-8).toUpperCase()}</CardTitle><Badge variant={order.status === "CANCELLED" ? "destructive" : "default"}>{labels[order.status]}</Badge></CardHeader><CardContent className="divide-y">{order.items.map((item, index) => <div key={`${order.id}-${index}`} className="flex justify-between py-3 text-sm"><span>{item.productName} · {item.variantName} × {item.quantity}</span><span>{formatPrice(item.unitPriceCents * item.quantity)}</span></div>)}<p className="pt-3 text-sm text-muted-foreground">{order.addressLine}</p></CardContent><CardFooter className="justify-between"><strong>Total {formatPrice(order.totalCents)}</strong>{["TO_PAY", "TO_SHIP"].includes(order.status) && <Button type="button" variant="outline" className="text-destructive" onClick={() => void cancel(order.id)}>Cancel order</Button>}</CardFooter></Card>)}{!filtered.length && <Card><CardContent className="p-10 text-center text-muted-foreground">No orders in this tab.</CardContent></Card>}</div></div>;
}
