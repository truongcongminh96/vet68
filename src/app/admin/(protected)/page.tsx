import { Boxes, Eye, EyeOff, ImageOff, Newspaper, RefreshCcw, Tags } from "lucide-react";
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
    <div>
      <h1 className="text-3xl font-extrabold">Tổng quan</h1>
      <p className="mt-2 text-muted-foreground">Số liệu catalogue và nội dung theo quyền RLS của tài khoản hiện tại.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([Icon, label, value]) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{label}</CardTitle>
              <Icon className="size-5 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent><p className="font-heading text-3xl font-extrabold">{value}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCcw className="size-5" aria-hidden="true" /> Sản phẩm cập nhật gần đây</CardTitle></CardHeader>
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
