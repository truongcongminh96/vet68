"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function loginAction(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Email hoặc mật khẩu chưa hợp lệ." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase chưa được cấu hình trong môi trường này." };
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "Không thể đăng nhập. Hãy kiểm tra lại thông tin tài khoản." };
  const { data: profile } = await supabase.from("profiles").select("is_active, role").eq("id", data.user.id).maybeSingle();
  if (!profile?.is_active || !["staff", "admin"].includes(profile.role)) {
    await supabase.auth.signOut();
    return { error: "Tài khoản chưa được kích hoạt cho khu vực quản trị." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/dang-nhap");
}
