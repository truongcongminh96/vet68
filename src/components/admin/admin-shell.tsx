import Link from "next/link";
import { Flag, LogOut } from "lucide-react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminThemeControls } from "@/components/admin/admin-theme-controls";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/admin/dang-nhap/actions";

export function AdminShell({ children, staffName, role }: { children: React.ReactNode; staffName: string; role: "staff" | "admin" }) {
  return (
    <div className="admin-signal min-h-[100dvh] lg:grid lg:grid-cols-[258px_minmax(0,1fr)]">
      {/* The filler-image slot remains empty until the user supplies approved artwork. */}
      <div className="admin-backdrop admin-backdrop-grid" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-artwork" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-vignette" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-noise" aria-hidden="true" />
      <aside className="admin-sidebar lg:sticky lg:top-0 lg:h-[100dvh]">
        <div className="admin-brand"><span className="admin-brand-mark">V68</span><span>Vet68 <b>/ Control</b></span></div>
        <p className="admin-sidebar-label">Danh mục vận hành</p>
        <AdminNavigation />
        <div className="admin-staff-panel">
          <p className="admin-sidebar-label">Phiên làm việc</p>
          <p className="admin-staff-name">{staffName}</p>
          <p className="admin-staff-role"><span aria-hidden="true" />{role === "admin" ? "Quản trị viên" : "Nhân viên"}</p>
          <form action={logoutAction}><Button type="submit" variant="outline" className="admin-logout"><LogOut aria-hidden="true" /> Đăng xuất</Button></form>
        </div>
      </aside>
      <div className="admin-content-frame">
        <header className="admin-topbar"><div><p className="admin-topbar-kicker">Vet Medicine 68</p><p className="admin-topbar-title">Catalogue operations</p></div><div className="admin-topbar-actions"><AdminThemeControls /><Button variant="outline" className="admin-site-link" asChild><Link href="/" target="_blank"><Flag aria-hidden="true" /> Xem website</Link></Button></div></header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
