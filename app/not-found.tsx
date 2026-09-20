import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() { return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-4xl font-bold">Page not found</h1><p className="mt-3 text-muted-foreground">The page or product you requested does not exist.</p><Link href="/" className={buttonVariants({ className: "mt-6" })}>Back to Shoppe</Link></div>; }
