"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="mt-3 text-muted-foreground">Please try again.</p><Button onClick={reset} className="mt-6 px-5 py-3 font-semibold">Try again</Button></div>; }
