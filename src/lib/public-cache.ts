import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/config";

// Admin actions expire these tags immediately; the TTL also covers scheduled
// content and edits made directly in Supabase instead of through the admin UI.
export function cachePublicQuery<Args extends unknown[], Result>(
  query: (...args: Args) => Promise<Result>,
  key: string,
  tags: string[],
) {
  const persisted = unstable_cache(query, [key, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "demo"], { tags, revalidate: 300 });
  return cache((...args: Args) => hasSupabaseEnv() ? persisted(...args) : query(...args));
}
