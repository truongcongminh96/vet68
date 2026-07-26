import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function getPublicStorageUrl(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string | null,
  fallback: string,
) {
  if (!path) return fallback;
  if (path.startsWith("/") || /^https?:\/\//.test(path)) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
