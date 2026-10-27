import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { envSupabasePublishableKey, envSupabaseUrl } from "@/lib/env";

/**
 * Portal SSO handoff (same pattern as Watch Trading Post).
 * Receives access_token + refresh_token from hoppytech.com/portal and sets
 * session cookies on the redirect response so middleware can see them.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  const fail = (error: string) =>
    NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url));

  if (!accessToken || !refreshToken) return fail("invalid_session");

  const supabaseUrl = envSupabaseUrl();
  const supabaseKey = envSupabasePublishableKey();
  if (!supabaseUrl || !supabaseKey) return fail("setup");

  const successPath = "/admin";
  let response = NextResponse.redirect(new URL(successPath, request.url));

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.redirect(new URL(successPath, request.url));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, { ...options, maxAge: undefined, expires: undefined }),
        );
      },
    },
  });

  const {
    data: { user: tokenUser },
    error: userError,
  } = await supabase.auth.getUser(accessToken);
  if (userError || !tokenUser) return fail("invalid_session");

  const tenant = tokenUser.app_metadata?.tenant as string | undefined;
  const role = tokenUser.app_metadata?.role as string | undefined;
  if (tenant !== "otp" && role !== "agency_owner") return fail("unauthorized");

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) return fail("invalid_session");

  return response;
}
