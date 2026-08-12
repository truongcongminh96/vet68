"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Check, Loader2, Trash2 } from "lucide-react";
import { deleteProductAction, type ProductActionResult } from "@/app/admin/(protected)/san-pham/actions";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { productFormSchema, type ProductFormValues } from "@/lib/validation/product";
import type { Database } from "@/types/database";

type Option = { id: string; name: string };
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export function ProductEditorForm({
  defaultValues,
  companies,
  brands,
  categories,
  animalTypes,
  treatmentCategories,
  action,
  initialImages = [],
}: {
  defaultValues: ProductFormValues;
  companies: Option[];
  brands: Option[];
  categories: Option[];
  animalTypes: Option[];
  treatmentCategories: Option[];
  action: (values: ProductFormValues) => Promise<ProductActionResult>;
  initialImages?: ProductImage[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ProductActionResult | null>(null);
  const form = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema), defaultValues });
  const priceMode = useWatch({ control: form.control, name: "priceDisplayMode" });
  const error = (name: keyof ProductFormValues) => form.formState.errors[name]?.message;
  const fieldA11y = (id: string, name: keyof ProductFormValues) => ({ id, "aria-invalid": Boolean(error(name)), "aria-describedby": error(name) ? `${id}-error` : undefined });

  function submit(values: ProductFormValues) {
    startTransition(async () => {
      const next = await action(values);
      setResult(next);
      if (next.ok && next.id && !defaultValues.id) router.replace(`/admin/san-pham/${next.id}`);
      else if (next.ok) router.refresh();
    });
  }

  function removeProduct() {
    const productId = defaultValues.id;
    if (!productId || !window.confirm(`Xóa vĩnh viễn sản phẩm "${defaultValues.name}"?`)) return;
    startTransition(async () => {
      const next = await deleteProductAction(productId);
      setResult(next);
      if (next.ok) router.replace("/admin/san-pham");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Thông tin chung</CardTitle><CardDescription>Tên, SKU và nội dung giới thiệu ngắn.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <Field id="product-name" label="Tên sản phẩm" error={error("name")}><Input {...fieldA11y("product-name", "name")} {...form.register("name")} /></Field>
            <div className="grid gap-5 sm:grid-cols-2"><Field id="product-slug" label="Slug" error={error("slug")}><Input {...fieldA11y("product-slug", "slug")} {...form.register("slug")} /></Field><Field id="product-sku" label="SKU" error={error("sku")}><Input {...fieldA11y("product-sku", "sku")} {...form.register("sku")} /></Field></div>
            <Field id="product-short-description" label="Mô tả ngắn" error={error("shortDescription")}><Textarea {...fieldA11y("product-short-description", "shortDescription")} rows={3} {...form.register("shortDescription")} /></Field>
            <Field id="product-description" label="Thông tin sản phẩm" error={error("description")}><Textarea {...fieldA11y("product-description", "description")} rows={6} {...form.register("description")} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Phân loại</CardTitle><CardDescription>Công ty phân phối, danh mục chính và thương hiệu.</CardDescription></CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Controller control={form.control} name="companyId" render={({ field }) => <Field id="product-company" label="Công ty phân phối" error={error("companyId")}><Select value={field.value} onValueChange={field.onChange}><SelectTrigger {...fieldA11y("product-company", "companyId")}><SelectValue placeholder="Chọn công ty" /></SelectTrigger><SelectContent>{companies.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field>} />
            <Controller control={form.control} name="categoryId" render={({ field }) => <Field id="product-category" label="Danh mục" error={error("categoryId")}><Select value={field.value} onValueChange={field.onChange}><SelectTrigger {...fieldA11y("product-category", "categoryId")}><SelectValue placeholder="Chọn danh mục" /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field>} />
            <Controller control={form.control} name="brandId" render={({ field }) => <Field id="product-brand" label="Thương hiệu" error={error("brandId")}><Select value={field.value} onValueChange={field.onChange}><SelectTrigger {...fieldA11y("product-brand", "brandId")}><SelectValue placeholder="Chọn thương hiệu" /></SelectTrigger><SelectContent>{brands.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field>} />
            <Controller control={form.control} name="animalTypeIds" render={({ field }) => <ToggleOptions legend="Vật nuôi phù hợp" options={animalTypes} values={field.value} onChange={field.onChange} />} />
            <Controller control={form.control} name="treatmentCategoryIds" render={({ field }) => <ToggleOptions legend="Nhu cầu sử dụng" options={treatmentCategories} values={field.value} onChange={field.onChange} />} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Giá tham khảo</CardTitle><CardDescription>Giá thiếu không được thay bằng số 0.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <Controller control={form.control} name="priceDisplayMode" render={({ field }) => <Field id="product-price-mode" label="Chế độ hiển thị" error={error("priceDisplayMode")}><Select value={field.value} onValueChange={field.onChange}><SelectTrigger {...fieldA11y("product-price-mode", "priceDisplayMode")}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Giá cố định</SelectItem><SelectItem value="approximate">Giá khoảng</SelectItem><SelectItem value="contact">Liên hệ báo giá</SelectItem></SelectContent></Select></Field>} />
            {priceMode !== "contact" ? <Field id="product-reference-price" label="Giá tham khảo" error={error("referencePrice")}><Input {...fieldA11y("product-reference-price", "referencePrice")} type="number" min="1" step="1000" {...form.register("referencePrice", { setValueAs: (value) => value === "" ? "" : Number(value) })} /></Field> : null}
            <Field id="product-price-note" label="Ghi chú giá" error={error("priceNote")}><Textarea {...fieldA11y("product-price-note", "priceNote")} rows={2} {...form.register("priceNote")} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Thông tin thú y</CardTitle><CardDescription>Chỉ nhập dữ liệu đã được đơn vị kinh doanh xác minh.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2"><Field id="product-unit" label="Đơn vị" error={error("unit")}><Input {...fieldA11y("product-unit", "unit")} {...form.register("unit")} /></Field><Field id="product-dosage-form" label="Dạng sản phẩm" error={error("dosageForm")}><Input {...fieldA11y("product-dosage-form", "dosageForm")} {...form.register("dosageForm")} /></Field></div>
            <Field id="product-packaging" label="Quy cách" error={error("packaging")}><Input {...fieldA11y("product-packaging", "packaging")} {...form.register("packaging")} /></Field>
            <Field id="product-active-ingredients" label="Thành phần" error={error("activeIngredients")}><Textarea {...fieldA11y("product-active-ingredients", "activeIngredients")} rows={4} {...form.register("activeIngredients")} /></Field>
            <Field id="product-indications" label="Chỉ định" error={error("indications")}><Textarea {...fieldA11y("product-indications", "indications")} rows={5} {...form.register("indications")} /></Field>
            <Field id="product-usage" label="Hướng dẫn sử dụng" error={error("usageInformation")}><Textarea {...fieldA11y("product-usage", "usageInformation")} rows={5} {...form.register("usageInformation")} /></Field>
            <Field id="product-storage" label="Hướng dẫn bảo quản" error={error("storageInformation")}><Textarea {...fieldA11y("product-storage", "storageInformation")} rows={5} {...form.register("storageInformation")} /></Field>
            <Field id="product-safety" label="Thông tin an toàn" error={error("safetyInformation")}><Textarea {...fieldA11y("product-safety", "safetyInformation")} rows={5} {...form.register("safetyInformation")} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
          <CardContent className="grid gap-5"><Field id="product-seo-title" label="SEO title" error={error("seoTitle")}><Input {...fieldA11y("product-seo-title", "seoTitle")} {...form.register("seoTitle")} /></Field><Field id="product-seo-description" label="SEO description" error={error("seoDescription")}><Textarea {...fieldA11y("product-seo-description", "seoDescription")} rows={3} {...form.register("seoDescription")} /></Field></CardContent>
        </Card>
      </div>

      <aside className="grid h-fit gap-6 xl:sticky xl:top-6">
        <Card>
          <CardHeader><CardTitle>Xuất bản</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            {([[
              "requiresConsultation", "Yêu cầu tư vấn"], ["isFeatured", "Sản phẩm nổi bật"], ["isNew", "Sản phẩm mới"], ["isActive", "Hiển thị công khai"]] as const).map(([name, label]) => <Controller key={name} control={form.control} name={name} render={({ field }) => <label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-semibold"><Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />{label}</label>} />)}
            {result ? <p role="status" className={result.ok ? "rounded-lg bg-success/10 p-3 text-sm font-semibold text-success" : "rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive"}>{result.message}</p> : null}
            <Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}{pending ? "Đang lưu" : "Lưu sản phẩm"}</Button>
            {defaultValues.id ? <Button type="button" variant="destructive" onClick={removeProduct} disabled={pending}><Trash2 aria-hidden="true" /> Xóa sản phẩm</Button> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Hình ảnh</CardTitle><CardDescription>JPEG, PNG, WebP hoặc AVIF. Tối đa 8 MB mỗi ảnh.</CardDescription></CardHeader>
          <CardContent>{defaultValues.id ? <ProductImageManager productId={defaultValues.id} initialImages={initialImages} /> : <p className="text-sm leading-6 text-muted-foreground">Lưu sản phẩm trước, sau đó tải ảnh lên ở trang chỉnh sửa.</p>}</CardContent>
        </Card>
      </aside>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label>{children}{error ? <p id={`${id}-error`} className="text-sm font-semibold text-destructive" role="alert">{error}</p> : null}</div>;
}

function ToggleOptions({ legend, options, values, onChange }: { legend: string; options: Option[]; values: string[]; onChange: (values: string[]) => void }) {
  return <fieldset className="grid gap-2"><legend className="text-sm font-semibold">{legend}</legend><div className="grid gap-2 rounded-lg border p-3">{options.length ? options.map((option) => <label key={option.id} className="flex items-center gap-2 text-sm"><Checkbox checked={values.includes(option.id)} onCheckedChange={(checked) => onChange(checked ? [...values, option.id] : values.filter((id) => id !== option.id))} />{option.name}</label>) : <p className="text-sm text-muted-foreground">Chưa có lựa chọn.</p>}</div></fieldset>;
}
