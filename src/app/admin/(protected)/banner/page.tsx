import { Pencil, Trash2 } from "lucide-react";
import { createBannerAction, deleteBannerAction } from "@/app/admin/(protected)/resource-actions";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-action-form";
import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field";
import { BannerPreviewButton } from "@/components/admin/banner-preview-button";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getAdminBanners } from "@/lib/admin/queries";
import type { Database } from "@/types/database";

type BannerRow = Database["public"]["Tables"]["banners"]["Row"];

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Banner</h1>
      <p className="mt-2 text-muted-foreground">Quản lý hero, banner khuyến mãi và lịch hiển thị.</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Banner</TableHead><TableHead>Vị trí</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
            <TableBody>
              {banners.length ? banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell><p className="font-bold">{banner.title}</p><p className="text-xs text-muted-foreground">Thứ tự {banner.sort_order}</p></TableCell>
                  <TableCell>{placementLabel(banner.placement)}</TableCell>
                  <TableCell>{banner.is_active ? "Đang hiển thị" : "Đang ẩn"}</TableCell>
                  <TableCell className="text-right">
                    <details className="relative inline-block text-left">
                      <summary className="list-none"><Button type="button" variant="outline" size="sm"><Pencil aria-hidden="true" /> Sửa</Button></summary>
                      <div className="absolute right-0 z-10 mt-2 max-h-[75vh] w-[min(90vw,500px)] overflow-y-auto rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg">
                        <AdminActionForm action={createBannerAction} className="grid gap-4">
                          <input type="hidden" name="id" value={banner.id} />
                          <BannerFields banner={banner} prefix={`banner-${banner.id}`} />
                          <div className="flex flex-wrap gap-2"><BannerPreviewButton /><AdminSubmitButton>Lưu thay đổi</AdminSubmitButton></div>
                        </AdminActionForm>
                        <AdminActionForm action={deleteBannerAction} className="mt-2">
                          <input type="hidden" name="id" value={banner.id} />
                          <ConfirmSubmitButton type="submit" variant="destructive" className="w-full" confirmation={`Xóa banner "${banner.title}"?`}><Trash2 aria-hidden="true" /> Xóa banner</ConfirmSubmitButton>
                        </AdminActionForm>
                      </div>
                    </details>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Chưa có banner.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle>Tạo banner</CardTitle><CardDescription>Chọn ảnh và upload trực tiếp; storage path sẽ được điền tự động.</CardDescription></CardHeader>
          <CardContent>
            <AdminActionForm action={createBannerAction} className="grid gap-4">
              <BannerFields prefix="new-banner" />
              <div className="flex flex-wrap gap-2"><BannerPreviewButton /><AdminSubmitButton>Lưu banner</AdminSubmitButton></div>
            </AdminActionForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BannerFields({ banner, prefix }: { banner?: BannerRow; prefix: string }) {
  return (
    <>
      <Field id={`${prefix}-title`} label="Tiêu đề"><Input id={`${prefix}-title`} name="title" defaultValue={banner?.title} required /></Field>
      <Field id={`${prefix}-subtitle`} label="Mô tả"><Textarea id={`${prefix}-subtitle`} name="subtitle" defaultValue={banner?.subtitle ?? ""} rows={3} /></Field>
      <Field id={`${prefix}-placement`} label="Vị trí"><select id={`${prefix}-placement`} name="placement" defaultValue={banner?.placement ?? "home_hero"} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="home_hero">Hero trang chủ</option><option value="home_promotion">Banner trang chủ</option><option value="promotions_page">Trang khuyến mãi</option></select></Field>
      <AdminImageUploadField id={`${prefix}-desktop`} name="desktop_image_path" label="Ảnh desktop" bucket="banners" folder="desktop" defaultValue={banner?.desktop_image_path} maxBytes={10 * 1024 * 1024} required />
      <AdminImageUploadField id={`${prefix}-mobile`} name="mobile_image_path" label="Ảnh mobile" bucket="banners" folder="mobile" defaultValue={banner?.mobile_image_path} maxBytes={10 * 1024 * 1024} />
      <Field id={`${prefix}-alt`} label="Alt text"><Input id={`${prefix}-alt`} name="image_alt" defaultValue={banner?.image_alt} required /></Field>
      <Field id={`${prefix}-link`} label="Link đích"><Input id={`${prefix}-link`} name="link_url" defaultValue={banner?.link_url ?? ""} /></Field>
      <Field id={`${prefix}-sort`} label="Thứ tự"><Input id={`${prefix}-sort`} name="sort_order" type="number" min="0" defaultValue={banner?.sort_order ?? 0} /></Field>
      <Field id={`${prefix}-starts`} label="Bắt đầu"><Input id={`${prefix}-starts`} name="starts_at" type="datetime-local" defaultValue={toLocalDateTime(banner?.starts_at)} /></Field>
      <Field id={`${prefix}-ends`} label="Kết thúc"><Input id={`${prefix}-ends`} name="ends_at" type="datetime-local" defaultValue={toLocalDateTime(banner?.ends_at)} /></Field>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={banner?.is_active ?? false} /> Hiển thị</label>
    </>
  );
}

function placementLabel(value: BannerRow["placement"]) { return value === "home_hero" ? "Hero trang chủ" : value === "home_promotion" ? "Banner trang chủ" : "Trang khuyến mãi"; }
function toLocalDateTime(value?: string | null) { if (!value) return ""; const date = new Date(value); const offset = date.getTimezoneOffset() * 60000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>; }
