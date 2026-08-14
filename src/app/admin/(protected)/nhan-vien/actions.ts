"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adminActionError, adminActionSuccess, databaseErrorMessage, validationErrorMessage, type AdminActionState } from "@/lib/admin/action-state";
import { authAdminErrorMessage } from "@/lib/admin/auth-error";
import { requireStaff } from "@/lib/auth";
import { absoluteUrl } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const inviteSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ."),
  full_name: z.string().trim().min(2, "Họ tên cần có ít nhất 2 ký tự.").max(120, "Họ tên không được vượt quá 120 ký tự."),
  role: z.enum(["staff", "admin"], { message: "Vai trò không hợp lệ." }),
});

const updateSchema = z.object({
  target_id: z.string().uuid("Mã tài khoản không hợp lệ."),
  role: z.enum(["staff", "admin"], { message: "Vai trò không hợp lệ." }),
  is_active: z.enum(["on"]).optional(),
});

const targetSchema = z.object({ target_id: z.string().uuid("Mã tài khoản không hợp lệ.") });

export async function inviteStaffAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (session.profile.role !== "admin") return adminActionError("Chỉ admin được phép mời nhân viên.");
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const admin = createSupabaseAdminClient();
  if (!admin) return adminActionError("Thiếu SUPABASE_SECRET_KEY trên server.");

  const value = parsed.data;
  const { data, error } = await admin.auth.admin.inviteUserByEmail(value.email, {
    data: { full_name: value.full_name },
    redirectTo: absoluteUrl("/admin/dat-mat-khau"),
  });
  if (error || !data.user) return adminActionError(authAdminErrorMessage(error ?? { message: "Không thể tạo tài khoản." }));
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: value.full_name,
    role: value.role,
    is_active: true,
  });
  if (profileError) return adminActionError(`Đã gửi email mời nhưng chưa thể kích hoạt profile: ${databaseErrorMessage(profileError)}`);

  revalidatePath("/admin/nhan-vien");
  return adminActionSuccess(`Đã gửi lời mời tới ${value.email}.`);
}

export async function updateStaffAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (session.profile.role !== "admin") return adminActionError("Chỉ admin được phép cập nhật tài khoản.");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  if (parsed.data.target_id === session.user.id) return adminActionError("Không thể tự đổi role hoặc khóa tài khoản đang đăng nhập.");
  const admin = createSupabaseAdminClient();
  const supabase = await createSupabaseServerClient();
  if (!admin || !supabase) return adminActionError("Supabase Admin API chưa được cấu hình.");

  const isActive = parsed.data.is_active === "on";
  const { data: target, error: targetError } = await supabase.from("profiles").select("role, is_active").eq("id", parsed.data.target_id).maybeSingle();
  if (targetError || !target) return adminActionError(databaseErrorMessage(targetError ?? { message: "Không tìm thấy tài khoản." }));
  if (target.role === "admin" && target.is_active && (parsed.data.role !== "admin" || !isActive)) {
    const { count, error } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("is_active", true);
    if (error) return adminActionError(databaseErrorMessage(error));
    if ((count ?? 0) <= 1) return adminActionError("Không thể khóa hoặc hạ role admin hoạt động cuối cùng.");
  }

  const { error: authError } = await admin.auth.admin.updateUserById(parsed.data.target_id, { ban_duration: isActive ? "none" : "876000h" });
  if (authError) return adminActionError(authAdminErrorMessage(authError));
  const { error: profileError } = await supabase.from("profiles").update({ role: parsed.data.role, is_active: isActive }).eq("id", parsed.data.target_id);
  if (profileError) {
    await admin.auth.admin.updateUserById(parsed.data.target_id, { ban_duration: target.is_active ? "none" : "876000h" });
    return adminActionError(databaseErrorMessage(profileError));
  }

  revalidatePath("/admin/nhan-vien");
  return adminActionSuccess("Đã cập nhật quyền và trạng thái tài khoản.");
}

export async function sendPasswordResetAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireStaff();
  if (session.profile.role !== "admin") return adminActionError("Chỉ admin được phép gửi email đặt lại mật khẩu.");
  const parsed = targetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return adminActionError(validationErrorMessage(parsed.error));
  const admin = createSupabaseAdminClient();
  if (!admin) return adminActionError("Thiếu SUPABASE_SECRET_KEY trên server.");
  const { data, error: userError } = await admin.auth.admin.getUserById(parsed.data.target_id);
  if (userError || !data.user.email) return adminActionError(authAdminErrorMessage(userError ?? { message: "Tài khoản chưa có email." }));
  const { error } = await admin.auth.resetPasswordForEmail(data.user.email, { redirectTo: absoluteUrl("/admin/dat-mat-khau") });
  if (error) return adminActionError(authAdminErrorMessage(error));
  return adminActionSuccess(`Đã gửi email đặt lại mật khẩu tới ${data.user.email}.`);
}
