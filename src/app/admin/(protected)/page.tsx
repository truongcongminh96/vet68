import Link from "next/link";
import { ArrowUpRight, Boxes, Eye, EyeOff, ImageOff, Newspaper, RefreshCcw, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboard } from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboard();
  const metrics = [
    [Boxes, "Tổng sản phẩm", dashboard.total],
    [Eye, "Đang hiển thị", dashboard.active],
    [EyeOff, "Đang ẩn", dashboard.hidden],
    [ImageOff, "Thiếu hình ảnh", dashboard.missingImages],
    [Tags, "Thiếu thông tin giá", dashboard.missingPricing],
    [Newspaper, "Bài đã xuất bản", dashboard.publishedPosts],
  ] as const;

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header"><div><p className="admin-page-kicker">Tổng quan hệ thống</p><h1>Catalogue<br />control room</h1></div><p>Số liệu catalogue và nội dung theo quyền RLS của tài khoản hiện tại.</p></header>
      <div className="admin-metrics-grid">
        {metrics.map(([Icon, label, value]) => (
          <Card key={label} className="admin-metric-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>{label}</CardTitle>
              <Icon aria-hidden="true" strokeWidth={1.5} />
            </CardHeader>
            <CardContent><p>{value}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card className="admin-activity-panel">
        <CardHeader><CardTitle><RefreshCcw aria-hidden="true" /> Sản phẩm cập nhật gần đây</CardTitle><Link href="/admin/san-pham">Mở danh sách <ArrowUpRight aria-hidden="true" /></Link></CardHeader>
        <CardContent className="grid gap-3">
          {dashboard.recent.length ? dashboard.recent.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-4 border-b pb-3 text-sm last:border-0 last:pb-0">
              <div><p className="font-bold">{product.name}</p><p className="text-muted-foreground">{product.sku}</p></div>
              <time className="text-muted-foreground">{new Intl.DateTimeFormat("vi-VN").format(new Date(product.updated_at))}</time>
            </div>
          )) : <p className="py-6 text-center text-sm text-muted-foreground">Chưa có sản phẩm trong cơ sở dữ liệu.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
