"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Boxes, Building2, ImageIcon, LayoutDashboard, Settings, Tags, UsersRound, type LucideIcon } from "lucide-react";

type AdminNavItem = readonly [LucideIcon, string, string];

const items = [
  [LayoutDashboard, "Tổng quan", "/admin"],
  [Boxes, "Sản phẩm", "/admin/san-pham"],
  [Tags, "Danh mục", "/admin/danh-muc"],
  [UsersRound, "Vật nuôi", "/admin/vat-nuoi"],
  [Building2, "Thương hiệu", "/admin/thuong-hieu"],
  [BookOpen, "Bài viết", "/admin/bai-viet"],
  [ImageIcon, "Banner", "/admin/banner"],
  [Settings, "Cài đặt", "/admin/cai-dat"],
] as const satisfies readonly AdminNavItem[];

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="admin-navigation" aria-label="Điều hướng quản trị">
      {items.map(([Icon, label, href]) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} data-active={active || undefined} className="admin-navigation-link">
            <Icon aria-hidden="true" strokeWidth={1.7} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
