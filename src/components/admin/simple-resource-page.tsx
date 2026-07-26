import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createResourceAction, deleteResourceAction, updateResourceAction } from "@/app/admin/(protected)/resource-actions";

type Resource = "categories" | "animal_types" | "brands";
type Row = { id: string; name: string; slug: string; description?: string | null; kind?: string; is_active?: boolean; sort_order?: number; image_path?: string | null; image_alt?: string | null; logo_path?: string | null; logo_alt?: string | null };

export function SimpleResourcePage({ title, description, resource, rows, categoryKinds = false }: { title: string; description: string; resource: Resource; rows: Row[]; categoryKinds?: boolean }) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Tên</TableHead><TableHead>Slug</TableHead>{categoryKinds ? <TableHead>Loại</TableHead> : null}<TableHead>Trạng thái</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length ? rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell><p className="font-bold">{row.name}</p><p className="line-clamp-1 text-xs text-muted-foreground">{row.description}</p></TableCell>
                  <TableCell>{row.slug}</TableCell>
                  {categoryKinds ? <TableCell>{row.kind === "treatment_need" ? "Nhu cầu" : "Nhóm sản phẩm"}</TableCell> : null}
                  <TableCell>{row.is_active === false ? "Đang ẩn" : "Công khai"}</TableCell>
                  <TableCell className="text-right">
                    <details className="relative inline-block text-left"><summary className="list-none"><Button type="button" variant="outline" size="sm"><Pencil aria-hidden="true" /> Sửa</Button></summary><div className="absolute right-0 z-10 mt-2 w-[min(88vw,360px)] rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg"><form action={updateResourceAction} className="grid gap-3"><input type="hidden" name="resource" value={resource} /><input type="hidden" name="id" value={row.id} /><ResourceFields row={row} categoryKinds={categoryKinds} prefix={`edit-${row.id}`} /><div className="flex gap-2"><Button type="submit" className="flex-1">Lưu thay đổi</Button></div></form><form action={deleteResourceAction} className="mt-2"><input type="hidden" name="resource" value={resource} /><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton type="submit" variant="destructive" className="w-full" confirmation={`Xóa vĩnh viễn "${row.name}"?`}><Trash2 aria-hidden="true" /> Xóa</ConfirmSubmitButton></form></div></details>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={categoryKinds ? 5 : 4} className="h-32 text-center text-muted-foreground">Chưa có dữ liệu.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="size-5" aria-hidden="true" /> Thêm mới</CardTitle><CardDescription>Slug cần dùng chữ thường không dấu.</CardDescription></CardHeader>
          <CardContent><form action={createResourceAction} className="grid gap-4"><input type="hidden" name="resource" value={resource} /><ResourceFields categoryKinds={categoryKinds} prefix={`create-${resource}`} /><Button type="submit">Lưu</Button></form></CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResourceFields({ row, categoryKinds, prefix }: { row?: Row; categoryKinds: boolean; prefix: string }) {
  const assetPath = row?.image_path ?? row?.logo_path ?? "";
  const assetAlt = row?.image_alt ?? row?.logo_alt ?? "";
  return <><div className="grid gap-2"><Label htmlFor={`${prefix}-name`}>Tên</Label><Input id={`${prefix}-name`} name="name" defaultValue={row?.name} required /></div><div className="grid gap-2"><Label htmlFor={`${prefix}-slug`}>Slug</Label><Input id={`${prefix}-slug`} name="slug" defaultValue={row?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></div>{categoryKinds ? <div className="grid gap-2"><Label htmlFor={`${prefix}-kind`}>Loại danh mục</Label><select id={`${prefix}-kind`} name="kind" defaultValue={row?.kind ?? "product_type"} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="product_type">Nhóm sản phẩm</option><option value="treatment_need">Nhu cầu sử dụng</option></select></div> : null}<div className="grid gap-2"><Label htmlFor={`${prefix}-description`}>Mô tả</Label><Textarea id={`${prefix}-description`} name="description" defaultValue={row?.description ?? ""} rows={4} /></div><div className="grid gap-2"><Label htmlFor={`${prefix}-asset-path`}>Đường dẫn ảnh hoặc logo</Label><Input id={`${prefix}-asset-path`} name="asset_path" defaultValue={assetPath} /></div><div className="grid gap-2"><Label htmlFor={`${prefix}-asset-alt`}>Alt text</Label><Input id={`${prefix}-asset-alt`} name="asset_alt" defaultValue={assetAlt} /></div>{row ? <><div className="grid gap-2"><Label htmlFor={`${prefix}-sort`}>Thứ tự</Label><Input id={`${prefix}-sort`} name="sort_order" type="number" min="0" defaultValue={row.sort_order ?? 0} /></div><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={row.is_active !== false} /> Hiển thị công khai</label></> : null}</>;
}
