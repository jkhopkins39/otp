import "server-only";

import { getAuthClient } from "./supabase-auth";

/**
 * Returns true when there is a valid Supabase Auth session in the request
 * cookies. Used by every admin server component and server action.
 */
export async function isAuthed(): Promise<boolean> {
  try {
    const supabase = await getAuthClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user !== null;
  } catch {
    return false;
  }
}
