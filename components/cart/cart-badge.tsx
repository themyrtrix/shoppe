"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CART_UPDATED_EVENT = "shoppe:cart-updated";

type CartResponse = {
  items?: Array<{ quantity: number }>;
};

export function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function CartBadge() {
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) {
        setQuantity(0);
        return;
      }

      const cart: CartResponse = await response.json();
      setQuantity(
        (cart.items ?? []).reduce((total, item) => total + item.quantity, 0),
      );
    } catch {
      setQuantity(0);
    }
  }, []);

  useEffect(() => {
    void refresh(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname, refresh]);

  useEffect(() => {
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary">
      {quantity > 99 ? "99+" : quantity}
    </span>
  );
}
