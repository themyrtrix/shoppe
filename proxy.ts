import { auth } from "@/auth";

export const proxy = auth((request) => {
  if (!request.auth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/orders/:path*"],
};
