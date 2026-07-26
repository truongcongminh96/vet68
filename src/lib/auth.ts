import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getStaffSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from("profiles").select("id, full_name, role, is_active").eq("id", user.id).single();
  if (!profile?.is_active) return null;
  return { user, profile };
}

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/dang-nhap");
  return session;
}
