import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/config";
import { AUTH_BUILD_COOKIE, AUTH_BUILD_COOKIE_OPTIONS, AUTH_BUILD_VERSION } from "@/lib/auth-build";
import type { Database } from "@/types/database";

export async function proxy(request: NextRequest) {
  if (!hasSupabaseEnv()) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseEnv();
  const supabase = createServerClient<Database>(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });

  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
  const buildChanged = hasAuthCookie && request.cookies.get(AUTH_BUILD_COOKIE)?.value !== AUTH_BUILD_VERSION;
  if (buildChanged) {
    await supabase.auth.signOut({ scope: "local" });
    response.cookies.set(AUTH_BUILD_COOKIE, AUTH_BUILD_VERSION, AUTH_BUILD_COOKIE_OPTIONS);

    if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/dang-nhap") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/dang-nhap";
      loginUrl.searchParams.set("reason", "build");
      const redirectResponse = NextResponse.redirect(loginUrl);
      response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
      return redirectResponse;
    }
    return response;
  }

  if (hasAuthCookie) await supabase.auth.getUser();
  return response;
}

export const config = { matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)"] };
