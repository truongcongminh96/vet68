import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

// Public cache entries must never depend on a staff member's session or cookies.
// The publishable key and anonymous RLS policies restrict these reads.
export function createSupabasePublicClient() {
  if (!hasSupabaseEnv()) return null;
  const { url, key } = getSupabaseEnv();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
