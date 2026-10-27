import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { envSupabasePublishableKey, envSupabaseUrl } from "@/lib/env";

/**
 * Supabase client wired to the request cookie store — used for auth operations.
 * Uses the publishable key so auth tokens stay scoped to the logged-in user.
 */
export async function getAuthClient() {
  const url = envSupabaseUrl();
  const key = envSupabasePublishableKey();
  if (!url || !key) {
    throw new Error("Supabase auth env is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...options, maxAge: undefined, expires: undefined }),
          );
        } catch {
          // In Server Components cookies are read-only — silently ignore.
        }
      },
    },
  });
}
