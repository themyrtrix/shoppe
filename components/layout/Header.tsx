import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/layout/button";
import { Input } from "@/components/layout/input";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/cart/cart-badge";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Shoppe home">
          <span className="text-2xl font-bold tracking-tight sm:text-3xl">Shoppe</span>
        </Link>

        <form
          action="/products"
          method="get"
          className="flex min-w-0 flex-1 items-center overflow-hidden rounded-sm bg-white p-1 shadow-sm"
          role="search"
        >
          <Input
            type="search"
            name="q"
            placeholder="Search for products..."
            aria-label="Search for products"
            className="h-8 rounded-none border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Search"
            className="h-8 w-10 rounded-sm bg-primary hover:bg-primary/90 sm:w-12"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-3" aria-label="Account">
          <Link
            href="/cart"
            className="relative rounded-full p-2 hover:bg-black/10"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            <CartBadge />
          </Link>
          {session?.user ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/account" className="max-w-32 truncate px-2 text-sm font-medium hover:text-white/80">
                {session.user.name}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden items-center gap-2 text-sm font-medium sm:flex">
              <Link href="/register" className="hover:text-white/80">Sign Up</Link>
              <span className="h-4 border-l border-white/40" aria-hidden="true" />
              <Link href="/login" className="hover:text-white/80">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}