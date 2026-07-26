import "server-only";

import { cache } from "react";
import { contactSchema, getEnvironmentContactSettings, type ContactSettings } from "@/lib/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getContactSettings = cache(async (): Promise<ContactSettings> => {
  const fallback = getEnvironmentContactSettings();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .eq("is_public", true)
    .maybeSingle();

  if (error || !data) return fallback;
  const value = data.value as Record<string, unknown>;
  const parsed = contactSchema.safeParse({
    phone: value.phone,
    phoneDisplay: value.phone_display ?? value.phoneDisplay,
    zaloUrl: value.zalo_url ?? value.zaloUrl,
    email: value.email,
    address: value.address,
  });
  return parsed.success ? parsed.data : fallback;
});
