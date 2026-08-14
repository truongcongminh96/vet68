import { KeyRound, MailPlus, ShieldCheck, UserCog } from "lucide-react";
import { inviteStaffAction, sendPasswordResetAction, updateStaffAction } from "@/app/admin/(protected)/nhan-vien/actions";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-action-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireStaff } from "@/lib/auth";
import { getAdminStaff } from "@/lib/admin/staff";

export default async function AdminStaffPage() {
  const session = await requireStaff();
  if (session.profile.role !== "admin") return <PermissionMessage />;
  const result = await getAdminStaff();

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Tài khoản nhân viên</h1>
      <p className="mt-2 text-muted-foreground">Mời nhân viên, đổi role, khóa truy cập và gửi email đặt lại mật khẩu.</p>
      {!result.configured ? (
        <Card className="mt-6 border-destructive/40"><CardHeader><CardTitle>Thiếu Supabase secret key</CardTitle><CardDescription>Thêm `SUPABASE_SECRET_KEY` vào môi trường server để bật chức năng mời và quản lý Auth user.</CardDescription></CardHeader></Card>
      ) : result.error ? (
        <Card className="mt-6 border-destructive/40"><CardContent className="pt-6 text-sm font-semibold text-destructive">{result.error}</CardContent></Card>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {result.rows.map((staff) => (
              <Card key={staff.id}>
                <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div><CardTitle>{staff.fullName}</CardTitle><CardDescription>{staff.email}</CardDescription></div>
                  <div className="flex gap-2"><Badge variant={staff.role === "admin" ? "default" : "outline"}>{staff.role === "admin" ? "Admin" : "Staff"}</Badge><Badge variant={staff.isActive ? "secondary" : "destructive"}>{staff.isActive ? "Hoạt động" : "Đã khóa"}</Badge>{staff.id === session.user.id ? <Badge variant="outline">Bạn</Badge> : null}</div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <AdminActionForm action={updateStaffAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <input type="hidden" name="target_id" value={staff.id} />
                    <div className="grid gap-2"><Label htmlFor={`role-${staff.id}`}>Vai trò</Label><select id={`role-${staff.id}`} name="role" defaultValue={staff.role} disabled={staff.id === session.user.id} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
                    <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={staff.isActive} disabled={staff.id === session.user.id} /> Cho phép đăng nhập</label>
                    <AdminSubmitButton disabled={staff.id === session.user.id} pendingLabel="Đang cập nhật..."><UserCog aria-hidden="true" /> Cập nhật</AdminSubmitButton>
                  </AdminActionForm>
                  <AdminActionForm action={sendPasswordResetAction}>
                    <input type="hidden" name="target_id" value={staff.id} />
                    <AdminSubmitButton variant="outline" pendingLabel="Đang gửi..."><KeyRound aria-hidden="true" /> Reset mật khẩu</AdminSubmitButton>
                  </AdminActionForm>
                  <p className="text-xs text-muted-foreground md:col-span-2">{staff.lastSignInAt ? `Đăng nhập gần nhất: ${formatDate(staff.lastSignInAt)}` : staff.confirmedAt ? "Chưa đăng nhập lần nào" : `Đã mời: ${formatDate(staff.invitedAt)}`}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="h-fit xl:sticky xl:top-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><MailPlus className="size-5" aria-hidden="true" /> Mời nhân viên</CardTitle><CardDescription>Supabase sẽ gửi link để người nhận tự đặt mật khẩu.</CardDescription></CardHeader>
            <CardContent>
              <AdminActionForm action={inviteStaffAction} className="grid gap-4">
                <div className="grid gap-2"><Label htmlFor="invite-name">Họ tên</Label><Input id="invite-name" name="full_name" required /></div>
                <div className="grid gap-2"><Label htmlFor="invite-email">Email</Label><Input id="invite-email" name="email" type="email" required /></div>
                <div className="grid gap-2"><Label htmlFor="invite-role">Vai trò</Label><select id="invite-role" name="role" defaultValue="staff" className="h-10 rounded-md border bg-background px-3 text-sm"><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
                <AdminSubmitButton pendingLabel="Đang gửi lời mời..."><MailPlus aria-hidden="true" /> Gửi lời mời</AdminSubmitButton>
              </AdminActionForm>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function PermissionMessage() {
  return <Card className="mt-6 max-w-xl"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck aria-hidden="true" /> Chỉ dành cho admin</CardTitle><CardDescription>Tài khoản staff không có quyền xem hoặc thay đổi tài khoản nhân viên.</CardDescription></CardHeader></Card>;
}

function formatDate(value: string | null) {
  if (!value) return "Chưa xác định";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}
