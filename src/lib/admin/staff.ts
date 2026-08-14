import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminStaffRow = {
  id: string;
  email: string;
  fullName: string;
  role: "staff" | "admin";
  isActive: boolean;
  invitedAt: string | null;
  confirmedAt: string | null;
  lastSignInAt: string | null;
};

export async function getAdminStaff(): Promise<{ configured: boolean; rows: AdminStaffRow[]; error?: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { configured: false, rows: [] };

  const [{ data: authData, error: authError }, { data: profiles, error: profileError }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("profiles").select("id, full_name, role, is_active"),
  ]);
  if (authError || profileError) return { configured: true, rows: [], error: authError?.message ?? profileError?.message };
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const rows = authData.users.flatMap((user) => {
    const profile = profileMap.get(user.id);
    if (!profile) return [];
    return [{
      id: user.id,
      email: user.email ?? "Chưa có email",
      fullName: profile.full_name ?? String(user.user_metadata?.full_name ?? "Nhân viên Vet68"),
      role: profile.role,
      isActive: profile.is_active,
      invitedAt: user.invited_at ?? null,
      confirmedAt: user.email_confirmed_at ?? null,
      lastSignInAt: user.last_sign_in_at ?? null,
    }];
  });

  rows.sort((a, b) => Number(b.isActive) - Number(a.isActive) || a.fullName.localeCompare(b.fullName, "vi"));
  return { configured: true, rows };
}
