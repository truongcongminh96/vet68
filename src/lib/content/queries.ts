import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import type { Database } from "@/types/database";

type Placement = Database["public"]["Enums"]["banner_placement"];

export type PublicBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  imageAlt: string;
  linkUrl: string | null;
};

const loadBanners = cache(async (): Promise<Array<PublicBanner & { placement: Placement }>> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("sort_order");
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    placement: row.placement,
    title: row.title,
    subtitle: row.subtitle,
    image: getPublicStorageUrl(supabase, "banners", row.desktop_image_path, "/images/demo/medicine-lab.jpg"),
    mobileImage: row.mobile_image_path ? getPublicStorageUrl(supabase, "banners", row.mobile_image_path, "") : null,
    imageAlt: row.image_alt,
    linkUrl: row.link_url,
  }));
});

export async function getActiveBanners(placement: Placement) {
  return (await loadBanners()).filter((banner) => banner.placement === placement);
}
