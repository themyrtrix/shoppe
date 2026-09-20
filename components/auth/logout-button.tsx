"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button type="button" variant="ghost" className="text-primary-foreground hover:bg-black/10 hover:text-white" onClick={() => signOut({ callbackUrl: "/" })}>
      Logout
    </Button>
  );
}
