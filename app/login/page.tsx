import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardContent className="p-6 sm:p-8">
        <Link href="/" className={buttonVariants({ variant: "link", className: "px-0" })}>← Back to Shoppe</Link>
        <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Sign in to continue shopping.</p>
        {params.registered === "1" && (
          <Alert className="mb-4"><AlertDescription>Account created. You can now sign in.</AlertDescription></Alert>
        )}
        <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
