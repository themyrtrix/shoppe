import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Back to Shoppe</Link>
        <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Sign in to continue shopping.</p>
        {params.registered === "1" && (
          <p className="mb-4 rounded-sm bg-primary/10 p-3 text-sm text-primary">Account created. You can now sign in.</p>
        )}
        <LoginForm callbackUrl={callbackUrl} />
      </section>
    </div>
  );
}
