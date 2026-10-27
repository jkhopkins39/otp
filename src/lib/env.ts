/** Resolve env with aliases (Vercel may use SUPABASE_* or HT_* instead of NEXT_PUBLIC_*). */

function first(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

export function envSupabaseUrl(): string | undefined {
  return first(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PROJECT_URL,
    process.env.HT_SUPABASE_PROJECT_URL,
  );
}

export function envSupabasePublishableKey(): string | undefined {
  return first(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.HT_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function envSupabaseSecretKey(): string | undefined {
  return first(
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.HT_SUPABASE_SECRET_KEY,
  );
}
