import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { envSupabasePublishableKey, envSupabaseUrl } from "@/lib/env";

const PORTAL = "https://hoppytech.com/portal";
const TENANT = "otp";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isCallbackPage = pathname === "/admin/auth/callback";
  const url = envSupabaseUrl();
  const key = envSupabasePublishableKey();

  // Without Supabase env, don't crash — send admin traffic to the portal.
  if (!url || !key) {
    if (isCallbackPage) return NextResponse.next({ request });
    return NextResponse.redirect(PORTAL);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            maxAge: undefined,
            expires: undefined,
          }),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Always allow the portal handoff route through (after refreshing cookies).
  if (isCallbackPage) return supabaseResponse;

  if (user) {
    const tenant = user.app_metadata?.tenant as string | undefined;
    const role = user.app_metadata?.role as string | undefined;
    const authorised = tenant === TENANT || role === "agency_owner";
    if (!authorised) return NextResponse.redirect(PORTAL);
  } else {
    return NextResponse.redirect(PORTAL);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
