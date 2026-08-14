import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyAdminTaxonomy, parseAdminTaxonomy, type AdminTaxonomy } from "@/lib/admin/taxonomy";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export async function getAdminTaxonomy() {
  const cached = getCachedAdminTaxonomy();
  if (cached) return cached;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return emptyAdminTaxonomy;
  const { data, error } = await supabase.rpc("get_admin_taxonomy");
  if (error) return emptyAdminTaxonomy;
  const taxonomy = parseAdminTaxonomy(data);
  cachedAdminTaxonomy = { taxonomy, expiresAt: Date.now() + ADMIN_TAXONOMY_TTL_MS };
  return taxonomy;
}

const ADMIN_TAXONOMY_TTL_MS = 30_000;
let cachedAdminTaxonomy: { taxonomy: AdminTaxonomy; expiresAt: number } | null = null;

export function invalidateAdminTaxonomyCache() {
  cachedAdminTaxonomy = null;
}

function getCachedAdminTaxonomy() {
  if (!cachedAdminTaxonomy || cachedAdminTaxonomy.expiresAt <= Date.now()) return null;
  return cachedAdminTaxonomy.taxonomy;
}

export async function getAdminCompanies() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const [{ data: companies }, { data: productCompanies }] = await Promise.all([
    supabase.from("companies").select("*").order("sort_order"),
    supabase.from("products").select("company_id"),
  ]);
  const usageCounts = new Map<string, number>();
  for (const row of productCompanies ?? []) {
    usageCounts.set(row.company_id, (usageCounts.get(row.company_id) ?? 0) + 1);
  }

  return (companies ?? []).map((company) => ({
    ...company,
    usageCount: usageCounts.get(company.id) ?? 0,
  }));
}

export async function getAdminProducts({
  query = "",
  status = "",
  categoryId = "",
  brandId = "",
  page = 1,
  pageSize = 20,
}: {
  query?: string;
  status?: string;
  categoryId?: string;
  brandId?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { rows: [], total: 0, pageCount: 1 };

  let builder = supabase.from("products").select("*", { count: "exact" });
  if (query) builder = builder.or(`name.ilike.%${escapePostgrestSearch(query)}%,sku.ilike.%${escapePostgrestSearch(query)}%`);
  if (status === "active") builder = builder.eq("is_active", true);
  if (status === "hidden") builder = builder.eq("is_active", false);
  if (categoryId) builder = builder.eq("category_id", categoryId);
  if (brandId) builder = builder.eq("brand_id", brandId);

  const from = (page - 1) * pageSize;
  const { data, count } = await builder.order("updated_at", { ascending: false }).range(from, from + pageSize - 1);
  const rows = data ?? [];
  const categoryIds = [...new Set(rows.flatMap((row) => row.category_id ? [row.category_id] : []))];
  const brandIds = [...new Set(rows.flatMap((row) => row.brand_id ? [row.brand_id] : []))];
  const [{ data: categories }, { data: brands }] = await Promise.all([
    categoryIds.length ? supabase.from("categories").select("id, name").in("id", categoryIds) : Promise.resolve({ data: [] }),
    brandIds.length ? supabase.from("brands").select("id, name").in("id", brandIds) : Promise.resolve({ data: [] }),
  ]);
  const categoryMap = new Map((categories ?? []).map((row) => [row.id, row.name]));
  const brandMap = new Map((brands ?? []).map((row) => [row.id, row.name]));

  return {
    rows: rows.map((row) => ({ ...row, categoryName: row.category_id ? categoryMap.get(row.category_id) ?? "Chưa phân loại" : "Chưa phân loại", brandName: row.brand_id ? brandMap.get(row.brand_id) ?? "Chưa có" : "Chưa có" })),
    total: count ?? 0,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getAdminProduct(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const [{ data: product }, { data: images }, { data: animalLinks }, { data: categoryLinks }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
    supabase.from("product_animal_types").select("animal_type_id").eq("product_id", id),
    supabase.from("product_categories").select("category_id").eq("product_id", id),
  ]);
  return product ? { product, images: images ?? [], animalTypeIds: (animalLinks ?? []).map((row) => row.animal_type_id), treatmentCategoryIds: (categoryLinks ?? []).map((row) => row.category_id) } : null;
}

export async function getAdminDashboard() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { total: 0, active: 0, hidden: 0, missingImages: 0, missingPricing: 0, publishedPosts: 0, recent: [] as ProductRow[] };

  const [{ data: products }, { count: publishedPosts }] = await Promise.all([
    supabase.from("products").select("*").order("updated_at", { ascending: false }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);
  const rows = products ?? [];
  const ids = rows.map((row) => row.id);
  const { data: imageRows } = ids.length ? await supabase.from("product_images").select("product_id").in("product_id", ids) : { data: [] };
  const withImages = new Set((imageRows ?? []).map((row) => row.product_id));

  return {
    total: rows.length,
    active: rows.filter((row) => row.is_active).length,
    hidden: rows.filter((row) => !row.is_active).length,
    missingImages: rows.filter((row) => !withImages.has(row.id)).length,
    missingPricing: rows.filter((row) => !row.price_display_mode || (row.price_display_mode !== "contact" && !row.reference_price)).length,
    publishedPosts: publishedPosts ?? 0,
    recent: rows.slice(0, 5),
  };
}

export async function getAdminPosts() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getAdminBanners() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase.from("banners").select("*").order("sort_order");
  return data ?? [];
}

export async function getAdminAuditLogs(limit = 100) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data: logs } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
  const actorIds = [...new Set((logs ?? []).flatMap((log) => log.actor_id ? [log.actor_id] : []))];
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", actorIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));

  return (logs ?? []).map((log) => ({
    ...log,
    actorName: log.actor_id ? profileMap.get(log.actor_id) ?? "Nhân viên" : "Hệ thống",
    entityLabel: auditEntityLabel(log.after_data ?? log.before_data, log.entity_id),
  }));
}

function auditEntityLabel(data: Database["public"]["Tables"]["audit_logs"]["Row"]["after_data"], fallback: string) {
  if (!data || Array.isArray(data) || typeof data !== "object") return fallback;
  for (const key of ["name", "title", "alt_text", "slug", "sku"]) {
    const value = data[key];
    if (typeof value === "string" && value) return value;
  }
  return fallback;
}

function escapePostgrestSearch(value: string) {
  return value.replaceAll(",", "").replaceAll("(", "").replaceAll(")", "").trim().slice(0, 100);
}
