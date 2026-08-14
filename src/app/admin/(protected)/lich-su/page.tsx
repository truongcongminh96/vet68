import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAuditLogs } from "@/lib/admin/queries";

export default async function AdminAuditHistoryPage() {
  const logs = await getAdminAuditLogs();

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Lịch sử thay đổi</h1>
      <p className="mt-2 text-muted-foreground">Theo dõi ai đã thay đổi dữ liệu catalogue, nội dung và hình ảnh.</p>
      <Card className="mt-6">
        <CardHeader><CardTitle>100 hoạt động gần nhất</CardTitle><CardDescription>Log được ghi tự động tại database, bao gồm cả thao tác ảnh trực tiếp.</CardDescription></CardHeader>
        <CardContent className="grid gap-3">
          {logs.length ? logs.map((log) => (
            <article key={log.id} className="grid gap-2 border-b pb-4 last:border-0 last:pb-0 md:grid-cols-[180px_1fr_auto] md:items-start">
              <div>
                <p className="font-bold">{log.actorName}</p>
                <time className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(log.created_at))}</time>
              </div>
              <div>
                <p className="font-semibold">{actionLabel(log.action)} {entityTypeLabel(log.entity_type)} “{log.entityLabel}”</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{log.changed_fields.map(fieldLabel).join(", ") || "Không có field chi tiết"}</p>
              </div>
              <Badge variant={log.action === "delete" ? "destructive" : log.action === "insert" ? "default" : "outline"}>{actionLabel(log.action)}</Badge>
            </article>
          )) : <p className="py-10 text-center text-sm text-muted-foreground">Chưa có lịch sử thay đổi. Log sẽ bắt đầu xuất hiện sau khi migration được áp dụng.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function actionLabel(action: "insert" | "update" | "delete") {
  return action === "insert" ? "Thêm" : action === "update" ? "Cập nhật" : "Xóa";
}

function entityTypeLabel(type: string) {
  const labels: Record<string, string> = { profiles: "tài khoản", products: "sản phẩm", product_images: "ảnh sản phẩm", posts: "bài viết", banners: "banner", categories: "danh mục", animal_types: "vật nuôi", brands: "thương hiệu", companies: "công ty" };
  return labels[type] ?? type;
}

function fieldLabel(field: string) {
  const labels: Record<string, string> = { role: "vai trò", full_name: "họ tên", reference_price: "giá tham khảo", price_display_mode: "chế độ giá", price_note: "ghi chú giá", indications: "chỉ định", usage_information: "hướng dẫn sử dụng", safety_information: "thông tin an toàn", storage_information: "bảo quản", active_ingredients: "thành phần", storage_path: "tệp ảnh", alt_text: "alt text", is_primary: "ảnh đại diện", sort_order: "thứ tự", is_active: "trạng thái", status: "trạng thái", content_markdown: "nội dung", desktop_image_path: "ảnh desktop", mobile_image_path: "ảnh mobile" };
  return labels[field] ?? field.replaceAll("_", " ");
}
