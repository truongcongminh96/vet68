"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { productFormSchema, type ProductFormValues } from "@/lib/validation/product";
import { databaseErrorMessage } from "@/lib/admin/action-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { getProductCacheTags } from "@/lib/cache-tags";
import { canDeleteCatalogue } from "@/lib/permissions";

export type ProductActionResult = { ok: boolean; message: string; id?: string };

export async function saveProductAction(values: ProductFormValues): Promise<ProductActionResult> {
  await requireStaff();
  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu sản phẩm chưa hợp lệ." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase chưa được cấu hình." };
  const value = parsed.data;
  const payload = {
    name: value.name, slug: value.slug, sku: value.sku,
    short_description: value.shortDescription || null, description: value.description || null,
    company_id: value.companyId, brand_id: value.brandId || null, category_id: value.categoryId || null,
    reference_price: value.priceDisplayMode === "contact" || value.referencePrice === "" ? null : value.referencePrice,
    price_display_mode: value.priceDisplayMode, price_note: value.priceNote || null,
    unit: value.unit || null, dosage_form: value.dosageForm || null,
    active_ingredients: value.activeIngredients || null, packaging: value.packaging || null,
    indications: value.indications || null, usage_information: value.usageInformation || null,
    storage_information: value.storageInformation || null, safety_information: value.safetyInformation || null,
    requires_consultation: value.requiresConsultation,
    is_featured: value.isFeatured, is_new: value.isNew, is_active: value.isActive,
    seo_title: value.seoTitle || null, seo_description: value.seoDescription || null,
    published_at: value.isActive ? new Date().toISOString() : null,
  };
  const previous = value.id ? await supabase.from("products").select("slug").eq("id", value.id).maybeSingle() : null;
  const query = value.id ? supabase.from("products").update(payload).eq("id", value.id).select("id").single() : supabase.from("products").insert(payload).select("id").single();
  const { data, error } = await query;
  if (error) return { ok: false, message: databaseErrorMessage(error, "Slug hoặc SKU sản phẩm đã tồn tại.") };

  const [{ error: animalDeleteError }, { error: categoryDeleteError }] = await Promise.all([
    supabase.from("product_animal_types").delete().eq("product_id", data.id),
    supabase.from("product_categories").delete().eq("product_id", data.id),
  ]);
  if (animalDeleteError || categoryDeleteError) return { ok: false, message: animalDeleteError?.message ?? categoryDeleteError?.message ?? "Không thể cập nhật phân loại sản phẩm." };

  const associationWrites = await Promise.all([
    value.animalTypeIds.length ? supabase.from("product_animal_types").insert(value.animalTypeIds.map((animalTypeId) => ({ product_id: data.id, animal_type_id: animalTypeId }))) : Promise.resolve({ error: null }),
    value.treatmentCategoryIds.length ? supabase.from("product_categories").insert(value.treatmentCategoryIds.map((categoryId) => ({ product_id: data.id, category_id: categoryId }))) : Promise.resolve({ error: null }),
  ]);
  const associationError = associationWrites.find((result) => result.error)?.error;
  if (associationError) return { ok: false, message: associationError.message };

  getProductCacheTags(value.slug).forEach((tag) => updateTag(tag));
  if (previous?.data?.slug && previous.data.slug !== value.slug) getProductCacheTags(previous.data.slug).forEach((tag) => updateTag(tag));
  updateTag("catalogue");
  revalidatePath("/admin/san-pham");
  revalidatePath("/", "layout");
  return { ok: true, message: "Đã lưu sản phẩm.", id: data.id };
}

export async function deleteProductAction(id: string): Promise<ProductActionResult> {
  const session = await requireStaff();
  if (!canDeleteCatalogue(session.profile.role)) return { ok: false, message: "Chỉ admin được phép xóa sản phẩm." };
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { ok: false, message: "Mã sản phẩm không hợp lệ." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase chưa được cấu hình." };

  const [{ data: product }, { data: images }] = await Promise.all([
    supabase.from("products").select("slug").eq("id", id).maybeSingle(),
    supabase.from("product_images").select("storage_path").eq("product_id", id),
  ]);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: databaseErrorMessage(error) };
  if (images?.length) await supabase.storage.from("product-images").remove(images.map((image) => image.storage_path));
  if (product?.slug) getProductCacheTags(product.slug).forEach((tag) => updateTag(tag));
  updateTag("catalogue");
  revalidatePath("/admin/san-pham");
  revalidatePath("/", "layout");
  return { ok: true, message: "Đã xóa sản phẩm." };
}
