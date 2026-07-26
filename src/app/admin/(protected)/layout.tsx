import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireStaff();
  return <AdminShell staffName={profile.full_name ?? user.email ?? "Nhân viên Vet68"} role={profile.role}>{children}</AdminShell>;
}
