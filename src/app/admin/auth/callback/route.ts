import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Receives access_token + refresh_token from the central Hoppy Tech portal
 * and exchanges them for a local Supabase session stored in cookies.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");

  if (!access_token || !refresh_token) {
    return NextResponse.redirect(`${origin}/admin/login?error=missing_tokens`);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/admin/login?setup=1`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=invalid_session`);
  }

  return NextResponse.redirect(`${origin}/admin`);
}
