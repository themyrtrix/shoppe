"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/layout/button";
import { Input } from "@/components/layout/input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign(result?.url ?? callbackUrl);
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium">Email</label>
        <Input id="login-email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="text-sm font-medium">Password</label>
        <Input id="login-password" type="password" autoComplete="current-password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      {error && <p className="rounded-sm bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Shoppe?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
      </p>
    </form>
  );
}
