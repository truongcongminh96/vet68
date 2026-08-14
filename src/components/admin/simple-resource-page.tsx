"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createResourceAction,
  deleteResourceAction,
  updateResourceAction,
} from "@/app/admin/(protected)/resource-actions";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-action-form";
import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Resource = "categories" | "animal_types" | "brands" | "companies";

type Row = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  kind?: string;
  is_active?: boolean;
  sort_order?: number;
  image_path?: string | null;
  image_alt?: string | null;
  logo_path?: string | null;
  logo_alt?: string | null;
  website_url?: string | null;
  usageCount?: number;
};

const resourceFields = {
  categories: { categoryKinds: true, asset: { label: "Ảnh danh mục", bucket: "category-images", maxBytes: 6 * 1024 * 1024, allowSvg: false }, website: false, usageCount: false },
  animal_types: { categoryKinds: false, asset: { label: "Ảnh vật nuôi", bucket: "animal-images", maxBytes: 6 * 1024 * 1024, allowSvg: false }, website: false, usageCount: false },
  brands: { categoryKinds: false, asset: { label: "Logo thương hiệu", bucket: "brand-logos", maxBytes: 4 * 1024 * 1024, allowSvg: true }, website: false, usageCount: false },
  companies: { categoryKinds: false, asset: null, website: true, usageCount: true },
} as const satisfies Record<Resource, {
  categoryKinds: boolean;
  asset: {
    label: string;
    bucket: "category-images" | "animal-images" | "brand-logos";
    maxBytes: number;
    allowSvg: boolean;
  } | null;
  website: boolean;
  usageCount: boolean;
}>;

export function SimpleResourcePage({
  title,
  description,
  resource,
  rows,
}: {
  title: string;
  description: string;
  resource: Resource;
  rows: Row[];
}) {
  const fields = resourceFields[resource];
  const [editingRow, setEditingRow] = useState<Row | null>(null);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                {fields.categoryKinds ? <TableHead>Loại</TableHead> : null}
                {fields.usageCount ? <TableHead>Sản phẩm</TableHead> : null}
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-bold">{row.name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{row.description}</p>
                  </TableCell>
                  <TableCell>{row.slug}</TableCell>
                  {fields.categoryKinds ? (
                    <TableCell>{row.kind === "treatment_need" ? "Nhu cầu" : "Nhóm sản phẩm"}</TableCell>
                  ) : null}
                  {fields.usageCount ? <TableCell>{row.usageCount ?? 0}</TableCell> : null}
                  <TableCell>{row.is_active === false ? "Đang ẩn" : "Công khai"}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingRow(row)}><Pencil aria-hidden="true" /> Sửa</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={fields.categoryKinds || fields.usageCount ? 5 : 4} className="h-32 text-center text-muted-foreground">
                    Chưa có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingRow ? <Pencil className="size-5" aria-hidden="true" /> : <Plus className="size-5" aria-hidden="true" />}
              {editingRow ? "Chỉnh sửa" : "Thêm mới"}
            </CardTitle>
            <CardDescription>{editingRow ? `Cập nhật thông tin cho ${editingRow.name}.` : "Slug cần dùng chữ thường không dấu."}</CardDescription>
          </CardHeader>
          <CardContent>
            {editingRow ? (
              <div className="grid gap-3">
                <AdminActionForm key={`edit-${editingRow.id}`} action={updateResourceAction} className="grid gap-4">
                  <input type="hidden" name="resource" value={resource} />
                  <input type="hidden" name="id" value={editingRow.id} />
                  <ResourceFields row={editingRow} fields={fields} prefix={`edit-${editingRow.id}`} />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingRow(null)}>Hủy</Button>
                    <AdminSubmitButton className="flex-1">Lưu thay đổi</AdminSubmitButton>
                  </div>
                </AdminActionForm>
                <AdminActionForm action={deleteResourceAction}>
                  <input type="hidden" name="resource" value={resource} />
                  <input type="hidden" name="id" value={editingRow.id} />
                  <ConfirmSubmitButton
                    type="submit"
                    variant="destructive"
                    className="w-full"
                    disabled={fields.usageCount && Boolean(editingRow.usageCount)}
                    confirmation={`Xóa vĩnh viễn "${editingRow.name}"?`}
                  >
                    <Trash2 aria-hidden="true" /> Xóa
                  </ConfirmSubmitButton>
                  {fields.usageCount && editingRow.usageCount ? (
                    <p className="mt-2 text-xs text-muted-foreground">Hãy chuyển sản phẩm sang công ty khác trước khi xóa.</p>
                  ) : null}
                </AdminActionForm>
              </div>
            ) : (
              <AdminActionForm action={createResourceAction} className="grid gap-4">
                <input type="hidden" name="resource" value={resource} />
                <ResourceFields fields={fields} prefix={`create-${resource}`} />
                <AdminSubmitButton>Lưu</AdminSubmitButton>
              </AdminActionForm>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResourceFields({
  row,
  fields,
  prefix,
}: {
  row?: Row;
  fields: (typeof resourceFields)[Resource];
  prefix: string;
}) {
  const assetPath = row?.image_path ?? row?.logo_path ?? "";
  const assetAlt = row?.image_alt ?? row?.logo_alt ?? "";

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-name`}>Tên</Label>
        <Input id={`${prefix}-name`} name="name" defaultValue={row?.name} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-slug`}>Slug</Label>
        <Input id={`${prefix}-slug`} name="slug" defaultValue={row?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
      </div>
      {fields.categoryKinds ? (
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-kind`}>Loại danh mục</Label>
          <select id={`${prefix}-kind`} name="kind" defaultValue={row?.kind ?? "product_type"} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="product_type">Nhóm sản phẩm</option>
            <option value="treatment_need">Nhu cầu sử dụng</option>
          </select>
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}-description`}>Mô tả</Label>
        <Textarea id={`${prefix}-description`} name="description" defaultValue={row?.description ?? ""} rows={4} />
      </div>
      {fields.asset ? (
        <>
          <AdminImageUploadField
            id={`${prefix}-asset-path`}
            name="asset_path"
            label={fields.asset.label}
            bucket={fields.asset.bucket}
            folder={resourceFolder(fields.asset.bucket)}
            defaultValue={assetPath}
            maxBytes={fields.asset.maxBytes}
            allowSvg={fields.asset.allowSvg}
          />
          <div className="grid gap-2">
            <Label htmlFor={`${prefix}-asset-alt`}>Alt text</Label>
            <Input id={`${prefix}-asset-alt`} name="asset_alt" defaultValue={assetAlt} />
          </div>
        </>
      ) : null}
      {fields.website ? (
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-website-url`}>Website</Label>
          <Input id={`${prefix}-website-url`} name="website_url" type="url" defaultValue={row?.website_url ?? ""} placeholder="https://example.com" />
        </div>
      ) : null}
      {row ? (
        <>
          <div className="grid gap-2">
            <Label htmlFor={`${prefix}-sort`}>Thứ tự</Label>
            <Input id={`${prefix}-sort`} name="sort_order" type="number" min="0" defaultValue={row.sort_order ?? 0} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="is_active" defaultChecked={row.is_active !== false} /> Hiển thị công khai
          </label>
        </>
      ) : null}
    </>
  );
}

function resourceFolder(bucket: "category-images" | "animal-images" | "brand-logos") {
  if (bucket === "category-images") return "categories";
  if (bucket === "animal-images") return "animals";
  return "brands";
}
