import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv, hasSupabaseAdminEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) return null;
  const { url, key } = getSupabaseAdminEnv();
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}
