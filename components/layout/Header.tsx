import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/layout/button";
import { Input } from "@/components/layout/input";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 md:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl md:text-3xl font-bold tracking-tight">Shoppe</span>
        </Link>

        {/* Search Bar */}
        <div className="flex flex-1 items-center max-w-2xl">
          <form className="flex w-full items-center bg-white rounded-sm overflow-hidden p-1 shadow-sm">
            <Input 
              type="text" 
              placeholder="Search for products..." 
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground rounded-none shadow-none"
            />
            <Button type="button" size="icon" className="h-8 w-12 rounded-sm bg-primary hover:bg-primary/90 shrink-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>

        {/* Actions (Cart & Login placeholder) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/cart" className="relative p-2 hover:bg-black/10 rounded-full transition-colors">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
              0
            </span>
          </Link>
          <div className="text-sm font-medium hidden md:flex items-center gap-2">
            <Link href="/register" className="hover:text-white/80 transition-colors">Sign Up</Link>
            <span className="border-l border-white/40 h-4" />
            <Link href="/login" className="hover:text-white/80 transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
}