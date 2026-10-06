import "server-only";

import { cachePublicQuery } from "@/lib/public-cache";
import { contactSchema, getEnvironmentContactSettings, type ContactSettings } from "@/lib/contact";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const getContactSettings = cachePublicQuery(async (): Promise<ContactSettings> => {
  const fallback = getEnvironmentContactSettings();
  const supabase = await createSupabasePublicClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .eq("is_public", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return fallback;
  const value = data.value as Record<string, unknown>;
  const parsed = contactSchema.safeParse({
    phone: value.phone,
    phoneDisplay: value.phone_display ?? value.phoneDisplay,
    zaloUrl: value.zalo_url ?? value.zaloUrl,
    email: value.email,
    address: value.address,
  });
  return parsed.success ? parsed.data : fallback;
}, "public-contact-settings", ["site-settings"]);
