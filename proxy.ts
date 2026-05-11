import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { data: session } = await auth.getSession();
  const { pathname } = request.nextUrl;

  // ─── Nepřihlášený uživatel ───────────────────────────────────────────────
  if (!session) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/account")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  const role = session.user?.role as string | undefined;

  // ─── Neplatná/chybějící role → bezpečné přesměrování ────────────────────
  if (!role || (role !== USER_ROLES.ADMIN && role !== USER_ROLES.CUSTOMER)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ─── Customer se pokouší o admin sekci ──────────────────────────────────
  if (role === USER_ROLES.CUSTOMER && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // ─── Admin se pokouší o klientskou sekci ────────────────────────────────
  if (role === USER_ROLES.ADMIN && pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ─── Přihlášený uživatel na auth stránkách ──────────────────────────────
  if (pathname.startsWith("/auth/")) {
    const dest =
      role === USER_ROLES.ADMIN ? "/dashboard" : "/account";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
