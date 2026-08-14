"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import {
  adminActionError,
  adminActionSuccess,
  databaseErrorMessage,
  validationErrorMessage,
  type AdminActionState,
} from "@/lib/admin/action-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canDeleteCatalogue, canManageSiteSettings } from "@/lib/permissions";

const resourceSchema = z.object({
  resource: z.enum(["categories", "animal_types", "brands", "companies"]),
  name: z.string().trim().min(2, "Tên cần có ít nhất 2 ký tự.").max(120, "Tên không được vượt quá 120 ký tự."),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang."),
  description: z.string().trim().max(1000, "Mô tả không được vượt quá 1000 ký tự.").optional(),
  kind: z.enum(["product_type", "treatment_need"]).optional(),
  asset_path: z.string().trim().optional(),
  asset_alt: z.string().trim().max(240, "Alt text không được vượt quá 240 ký tự.").optional(),
  website_url: z.string().trim().max(500).refine(isOptionalHttpUrl, "Website phải là URL http hoặc https hợp lệ.").optional(),
});
const resourceUpdateSchema = resourceSchema.extend({ id: z.string().uuid("Mã dữ liệu không hợp lệ."), is_active: z.enum(["on"]).optional(), sort_order: z.coerce.number().int("Thứ tự phải là số nguyên.").min(0, "Thứ tự không được âm.").max(100000, "Thứ tự quá lớn.").default(0) });

export async function createResourceAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const value = parsed.data;
  if (value.resource === "categories") {
    const { error } = await supabase.from("categories").insert({ name: value.name, slug: value.slug, description: value.description || null, kind: value.kind ?? "product_type", image_path: value.asset_path || null, image_alt: value.asset_alt || null, is_active: true });
    if (error) return adminActionError(databaseErrorMessage(error, "Slug danh mục đã tồn tại."));
  }
  if (value.resource === "animal_types") {
    const { error } = await supabase.from("animal_types").insert({ name: value.name, slug: value.slug, description: value.description || null, image_path: value.asset_path || null, image_alt: value.asset_alt || null, is_active: true });
    if (error) return adminActionError(databaseErrorMessage(error, "Slug vật nuôi đã tồn tại."));
  }
  if (value.resource === "brands") {
    const { error } = await supabase.from("brands").insert({ name: value.name, slug: value.slug, description: value.description || null, logo_path: value.asset_path || null, logo_alt: value.asset_alt || null, is_active: true });
    if (error) return adminActionError(databaseErrorMessage(error, "Slug thương hiệu đã tồn tại."));
  }
  if (value.resource === "companies") {
    const { error } = await supabase.from("companies").insert({ name: value.name, slug: value.slug, description: value.description || null, website_url: value.website_url || null, is_active: true });
    if (error) return adminActionError(databaseErrorMessage(error, "Slug công ty đã tồn tại."));
  }
  updateTag("catalogue");
  revalidatePath(`/admin/${resourceAdminPath(value.resource)}`);
  revalidatePath("/", "layout");
  return adminActionSuccess("Đã thêm dữ liệu mới.");
}

export async function updateResourceAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  const parsed = resourceUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const value = parsed.data;
  const payload = { name: value.name, slug: value.slug, description: value.description || null, is_active: value.is_active === "on", sort_order: value.sort_order };
  if (value.resource === "categories") {
    const { error } = await supabase.from("categories").update({ ...payload, kind: value.kind ?? "product_type", image_path: value.asset_path || null, image_alt: value.asset_alt || null }).eq("id", value.id);
    if (error) return adminActionError(databaseErrorMessage(error, "Slug danh mục đã tồn tại."));
  }
  if (value.resource === "animal_types") {
    const { error } = await supabase.from("animal_types").update({ ...payload, image_path: value.asset_path || null, image_alt: value.asset_alt || null }).eq("id", value.id);
    if (error) return adminActionError(databaseErrorMessage(error, "Slug vật nuôi đã tồn tại."));
  }
  if (value.resource === "brands") {
    const { error } = await supabase.from("brands").update({ ...payload, logo_path: value.asset_path || null, logo_alt: value.asset_alt || null }).eq("id", value.id);
    if (error) return adminActionError(databaseErrorMessage(error, "Slug thương hiệu đã tồn tại."));
  }
  if (value.resource === "companies") {
    const { error } = await supabase.from("companies").update({ ...payload, website_url: value.website_url || null }).eq("id", value.id);
    if (error) return adminActionError(databaseErrorMessage(error, "Slug công ty đã tồn tại."));
  }
  updateTag("catalogue");
  revalidatePath(`/admin/${resourceAdminPath(value.resource)}`);
  revalidatePath("/", "layout");
  return adminActionSuccess("Đã lưu thay đổi.");
}

export async function deleteResourceAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (!canDeleteCatalogue(session.profile.role)) return adminActionError("Chỉ admin được phép xóa dữ liệu danh mục.");
  const parsed = z.object({ resource: z.enum(["categories", "animal_types", "brands", "companies"]), id: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  if (parsed.data.resource === "companies") {
    const { count, error } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("company_id", parsed.data.id);
    if (error) return adminActionError(databaseErrorMessage(error));
    if (count) return adminActionError("Hãy chuyển sản phẩm sang công ty khác trước khi xóa.");
  }
  const { error } = await supabase.from(parsed.data.resource).delete().eq("id", parsed.data.id);
  if (error) return adminActionError(databaseErrorMessage(error));
  updateTag("catalogue");
  revalidatePath(`/admin/${resourceAdminPath(parsed.data.resource)}`);
  revalidatePath("/", "layout");
  return adminActionSuccess("Đã xóa dữ liệu.");
}

const postSchema = z.object({ id: z.string().uuid("Mã bài viết không hợp lệ.").optional(), title: z.string().trim().min(3, "Tiêu đề cần có ít nhất 3 ký tự."), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang."), excerpt: z.string().trim().min(1, "Vui lòng nhập tóm tắt.").max(500, "Tóm tắt không được vượt quá 500 ký tự."), content_markdown: z.string().trim().min(20, "Nội dung bài viết cần có ít nhất 20 ký tự."), cover_path: z.string().trim().optional(), cover_alt: z.string().trim().max(240, "Alt text không được vượt quá 240 ký tự.").optional(), seo_title: z.string().trim().max(70, "SEO title không được vượt quá 70 ký tự.").optional(), seo_description: z.string().trim().max(170, "SEO description không được vượt quá 170 ký tự.").optional(), status: z.enum(["draft", "published"], { message: "Trạng thái bài viết không hợp lệ." }) });

export async function createPostAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const { id, ...value } = parsed.data;
  const payload = { ...value, cover_path: value.cover_path || null, cover_alt: value.cover_alt || null, seo_title: value.seo_title || null, seo_description: value.seo_description || null, author_id: session.user.id, published_at: value.status === "published" ? new Date().toISOString() : null };
  const { error } = id ? await supabase.from("posts").update(payload).eq("id", id) : await supabase.from("posts").insert(payload);
  if (error) return adminActionError(databaseErrorMessage(error, "Slug bài viết đã tồn tại."));
  updateTag("posts"); revalidatePath("/admin/bai-viet"); revalidatePath("/kien-thuc-thu-y");
  return adminActionSuccess("Đã lưu bài viết.");
}

export async function deletePostAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (!canDeleteCatalogue(session.profile.role)) return adminActionError("Chỉ admin được phép xóa bài viết.");
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return adminActionError("Mã bài viết không hợp lệ.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const { error } = await supabase.from("posts").delete().eq("id", id.data);
  if (error) return adminActionError(databaseErrorMessage(error));
  updateTag("posts"); revalidatePath("/admin/bai-viet"); revalidatePath("/kien-thuc-thu-y");
  return adminActionSuccess("Đã xóa bài viết.");
}

const bannerSchema = z.object({ id: z.string().uuid("Mã banner không hợp lệ.").optional(), title: z.string().trim().min(2, "Tiêu đề banner cần có ít nhất 2 ký tự."), subtitle: z.string().trim().max(300, "Mô tả không được vượt quá 300 ký tự.").optional(), placement: z.enum(["home_hero", "home_promotion", "promotions_page"], { message: "Vị trí banner không hợp lệ." }), desktop_image_path: z.string().trim().min(3, "Vui lòng upload ảnh desktop."), mobile_image_path: z.string().trim().optional(), image_alt: z.string().trim().min(3, "Alt text cần có ít nhất 3 ký tự."), link_url: z.string().trim().refine(isOptionalSiteLink, "Link đích phải là đường dẫn nội bộ hoặc URL http/https hợp lệ.").optional(), is_active: z.enum(["on"]).optional(), sort_order: z.coerce.number().int("Thứ tự phải là số nguyên.").min(0, "Thứ tự không được âm.").default(0), starts_at: z.string().trim().refine(isOptionalDateTime, "Thời gian bắt đầu không hợp lệ.").optional(), ends_at: z.string().trim().refine(isOptionalDateTime, "Thời gian kết thúc không hợp lệ.").optional() });

export async function createBannerAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireStaff();
  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const value = parsed.data; const payload = { title: value.title, subtitle: value.subtitle || null, placement: value.placement, desktop_image_path: value.desktop_image_path, mobile_image_path: value.mobile_image_path || null, image_alt: value.image_alt, link_url: value.link_url || null, is_active: value.is_active === "on", sort_order: value.sort_order, starts_at: value.starts_at ? new Date(value.starts_at).toISOString() : null, ends_at: value.ends_at ? new Date(value.ends_at).toISOString() : null };
  const { error } = value.id ? await supabase.from("banners").update(payload).eq("id", value.id) : await supabase.from("banners").insert(payload);
  if (error) return adminActionError(databaseErrorMessage(error));
  updateTag("banners"); revalidatePath("/admin/banner"); revalidatePath("/"); revalidatePath("/khuyen-mai");
  return adminActionSuccess("Đã lưu banner.");
}

export async function deleteBannerAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (!canDeleteCatalogue(session.profile.role)) return adminActionError("Chỉ admin được phép xóa banner.");
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return adminActionError("Mã banner không hợp lệ.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const { error } = await supabase.from("banners").delete().eq("id", id.data);
  if (error) return adminActionError(databaseErrorMessage(error));
  updateTag("banners"); revalidatePath("/admin/banner"); revalidatePath("/"); revalidatePath("/khuyen-mai");
  return adminActionSuccess("Đã xóa banner.");
}

const settingsSchema = z.object({ phone: z.string().trim().min(8, "Số điện thoại cần có ít nhất 8 ký tự."), phone_display: z.string().trim().min(8, "Số điện thoại hiển thị cần có ít nhất 8 ký tự."), zalo_url: z.string().url("Zalo URL không hợp lệ."), email: z.string().email("Email không hợp lệ."), address: z.string().trim().min(3, "Địa chỉ cần có ít nhất 3 ký tự.") });

export async function saveContactSettingsAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (!canManageSiteSettings(session.profile.role)) return adminActionError("Chỉ admin được phép thay đổi cài đặt website.");
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return adminActionError("Supabase chưa được cấu hình.");
  const { error } = await supabase.from("site_settings").upsert({ key: "contact", value: parsed.data, is_public: true, updated_by: session.user.id });
  if (error) return adminActionError(databaseErrorMessage(error));
  updateTag("site-settings"); revalidatePath("/admin/cai-dat"); revalidatePath("/", "layout");
  return adminActionSuccess("Đã lưu cài đặt website.");
}

function resourceAdminPath(resource: "categories" | "animal_types" | "brands" | "companies") {
  if (resource === "categories") return "danh-muc";
  if (resource === "animal_types") return "vat-nuoi";
  if (resource === "brands") return "thuong-hieu";
  return "cong-ty";
}

function isOptionalHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isOptionalDateTime(value: string) {
  return !value || !Number.isNaN(Date.parse(value));
}

function isOptionalSiteLink(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isOptionalHttpUrl(value);
}
