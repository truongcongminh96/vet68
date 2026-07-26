"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canDeleteCatalogue, canManageSiteSettings } from "@/lib/permissions";

const resourceSchema = z.object({ resource: z.enum(["categories", "animal_types", "brands"]), name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(1000).optional(), kind: z.enum(["product_type", "treatment_need"]).optional(), asset_path: z.string().trim().optional(), asset_alt: z.string().trim().max(240).optional() });
const resourceUpdateSchema = resourceSchema.extend({ id: z.string().uuid(), is_active: z.enum(["on"]).optional(), sort_order: z.coerce.number().int().min(0).max(100000).default(0) });

export async function createResourceAction(formData: FormData) {
  await requireStaff();
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  const value = parsed.data;
  if (value.resource === "categories") await supabase.from("categories").insert({ name: value.name, slug: value.slug, description: value.description || null, kind: value.kind ?? "product_type", image_path: value.asset_path || null, image_alt: value.asset_alt || null, is_active: true });
  if (value.resource === "animal_types") await supabase.from("animal_types").insert({ name: value.name, slug: value.slug, description: value.description || null, image_path: value.asset_path || null, image_alt: value.asset_alt || null, is_active: true });
  if (value.resource === "brands") await supabase.from("brands").insert({ name: value.name, slug: value.slug, description: value.description || null, logo_path: value.asset_path || null, logo_alt: value.asset_alt || null, is_active: true });
  updateTag("catalogue");
  revalidatePath(`/admin/${value.resource === "categories" ? "danh-muc" : value.resource === "animal_types" ? "vat-nuoi" : "thuong-hieu"}`);
}

export async function updateResourceAction(formData: FormData) {
  await requireStaff();
  const parsed = resourceUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const value = parsed.data;
  const payload = { name: value.name, slug: value.slug, description: value.description || null, is_active: value.is_active === "on", sort_order: value.sort_order };
  if (value.resource === "categories") await supabase.from("categories").update({ ...payload, kind: value.kind ?? "product_type", image_path: value.asset_path || null, image_alt: value.asset_alt || null }).eq("id", value.id);
  if (value.resource === "animal_types") await supabase.from("animal_types").update({ ...payload, image_path: value.asset_path || null, image_alt: value.asset_alt || null }).eq("id", value.id);
  if (value.resource === "brands") await supabase.from("brands").update({ ...payload, logo_path: value.asset_path || null, logo_alt: value.asset_alt || null }).eq("id", value.id);
  updateTag("catalogue");
  revalidatePath(`/admin/${resourceAdminPath(value.resource)}`);
  revalidatePath("/", "layout");
}

export async function deleteResourceAction(formData: FormData) {
  const session = await requireStaff();
  if (!canDeleteCatalogue(session.profile.role)) return;
  const parsed = z.object({ resource: z.enum(["categories", "animal_types", "brands"]), id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from(parsed.data.resource).delete().eq("id", parsed.data.id);
  updateTag("catalogue");
  revalidatePath(`/admin/${resourceAdminPath(parsed.data.resource)}`);
  revalidatePath("/", "layout");
}

const postSchema = z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(3), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), excerpt: z.string().trim().max(500), content_markdown: z.string().trim().min(20), cover_path: z.string().trim().optional(), cover_alt: z.string().trim().max(240).optional(), seo_title: z.string().trim().max(70).optional(), seo_description: z.string().trim().max(170).optional(), status: z.enum(["draft", "published"]) });

export async function createPostAction(formData: FormData) {
  const session = await requireStaff(); const parsed = postSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  const { id, ...value } = parsed.data;
  const payload = { ...value, cover_path: value.cover_path || null, cover_alt: value.cover_alt || null, seo_title: value.seo_title || null, seo_description: value.seo_description || null, author_id: session.user.id, published_at: value.status === "published" ? new Date().toISOString() : null };
  if (id) await supabase.from("posts").update(payload).eq("id", id); else await supabase.from("posts").insert(payload);
  updateTag("posts"); revalidatePath("/admin/bai-viet"); revalidatePath("/kien-thuc-thu-y");
}

export async function deletePostAction(formData: FormData) {
  const session = await requireStaff(); if (!canDeleteCatalogue(session.profile.role)) return;
  const id = z.string().uuid().safeParse(formData.get("id")); if (!id.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  await supabase.from("posts").delete().eq("id", id.data);
  updateTag("posts"); revalidatePath("/admin/bai-viet"); revalidatePath("/kien-thuc-thu-y");
}

const bannerSchema = z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(2), subtitle: z.string().trim().max(300).optional(), placement: z.enum(["home_hero", "home_promotion", "promotions_page"]), desktop_image_path: z.string().trim().min(3), mobile_image_path: z.string().trim().optional(), image_alt: z.string().trim().min(3), link_url: z.string().trim().optional(), is_active: z.enum(["on"]).optional(), sort_order: z.coerce.number().int().min(0).default(0), starts_at: z.string().trim().optional(), ends_at: z.string().trim().optional() });

export async function createBannerAction(formData: FormData) {
  await requireStaff(); const parsed = bannerSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  const value = parsed.data; const payload = { title: value.title, subtitle: value.subtitle || null, placement: value.placement, desktop_image_path: value.desktop_image_path, mobile_image_path: value.mobile_image_path || null, image_alt: value.image_alt, link_url: value.link_url || null, is_active: value.is_active === "on", sort_order: value.sort_order, starts_at: value.starts_at ? new Date(value.starts_at).toISOString() : null, ends_at: value.ends_at ? new Date(value.ends_at).toISOString() : null };
  if (value.id) await supabase.from("banners").update(payload).eq("id", value.id); else await supabase.from("banners").insert(payload);
  updateTag("banners"); revalidatePath("/admin/banner"); revalidatePath("/"); revalidatePath("/khuyen-mai");
}

export async function deleteBannerAction(formData: FormData) {
  const session = await requireStaff(); if (!canDeleteCatalogue(session.profile.role)) return;
  const id = z.string().uuid().safeParse(formData.get("id")); if (!id.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  await supabase.from("banners").delete().eq("id", id.data);
  updateTag("banners"); revalidatePath("/admin/banner"); revalidatePath("/"); revalidatePath("/khuyen-mai");
}

const settingsSchema = z.object({ phone: z.string().trim().min(8), phone_display: z.string().trim().min(8), zalo_url: z.string().url(), email: z.string().email(), address: z.string().trim().min(3) });

export async function saveContactSettingsAction(formData: FormData) {
  const session = await requireStaff(); if (!canManageSiteSettings(session.profile.role)) return;
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return;
  const supabase = await createSupabaseServerClient(); if (!supabase) return;
  await supabase.from("site_settings").upsert({ key: "contact", value: parsed.data, is_public: true, updated_by: session.user.id });
  updateTag("site-settings"); revalidatePath("/admin/cai-dat"); revalidatePath("/", "layout");
}

function resourceAdminPath(resource: "categories" | "animal_types" | "brands") {
  return resource === "categories" ? "danh-muc" : resource === "animal_types" ? "vat-nuoi" : "thuong-hieu";
}
