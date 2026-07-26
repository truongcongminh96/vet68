import Link from "next/link";
import { BookOpen, Boxes, Building2, Flag, ImageIcon, LayoutDashboard, LogOut, Settings, Tags, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/site-logo";
import { logoutAction } from "@/app/admin/dang-nhap/actions";

const links = [
  [LayoutDashboard, "Tổng quan", "/admin"],
  [Boxes, "Sản phẩm", "/admin/san-pham"],
  [Tags, "Danh mục", "/admin/danh-muc"],
  [UsersRound, "Vật nuôi", "/admin/vat-nuoi"],
  [Building2, "Thương hiệu", "/admin/thuong-hieu"],
  [BookOpen, "Bài viết", "/admin/bai-viet"],
  [ImageIcon, "Banner", "/admin/banner"],
  [Settings, "Cài đặt", "/admin/cai-dat"],
] as const;

export function AdminShell({ children, staffName, role }: { children: React.ReactNode; staffName: string; role: "staff" | "admin" }) {
  return <div className="min-h-[100dvh] bg-background lg:grid lg:grid-cols-[250px_1fr]"><aside className="border-b bg-sidebar lg:sticky lg:top-0 lg:h-[100dvh] lg:border-b-0 lg:border-r"><div className="flex h-full flex-col"><div className="border-b p-4"><SiteLogo /></div><nav className="grid gap-1 p-3" aria-label="Điều hướng quản trị">{links.map(([Icon,label,href]) => <Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}><Icon aria-hidden="true" /> {label}</Link></Button>)}</nav><div className="mt-auto border-t p-4"><p className="text-sm font-bold">{staffName}</p><p className="mt-1 text-xs text-muted-foreground">Vai trò: {role}</p><form action={logoutAction}><Button type="submit" variant="outline" className="mt-4 w-full"><LogOut aria-hidden="true" /> Đăng xuất</Button></form></div></div></aside><div className="min-w-0"><header className="flex min-h-16 items-center justify-between border-b bg-card px-4 sm:px-6"><div><p className="text-sm font-bold">Vet68 Admin</p><p className="text-xs text-muted-foreground">Quản lý catalogue và nội dung</p></div><Button variant="outline" asChild><Link href="/" target="_blank"><Flag aria-hidden="true" /> Xem website</Link></Button></header><main className="p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}
