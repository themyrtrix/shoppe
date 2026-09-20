import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Back to Shoppe</Link>
        <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">Join Shoppe and start discovering great finds.</p>
        <RegisterForm />
      </section>
    </div>
  );
}
