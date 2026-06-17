import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const g = globalThis as unknown as { __supabase?: SupabaseClient<any, any, any> }; // eslint-disable-line

/**
 * Returns a Supabase client using the service-role key (server-side only).
 * Returns null when SUPABASE_URL / SUPABASE_SECRET_KEY are not set,
 * so the app can fall back to seed data in local dev.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  if (!g.__supabase) {
    g.__supabase = createClient(url, key, {
      auth: { persistSession: false },
      db: { schema: 'otp' },
    });
  }
  return g.__supabase;
}
