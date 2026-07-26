import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminProducts, getAdminTaxonomy } from "@/lib/admin/queries";

type Params = { q?: string; status?: string; category?: string; brand?: string; page?: string };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const [{ rows, total, pageCount }, taxonomy] = await Promise.all([
    getAdminProducts({ query: params.q, status: params.status, categoryId: params.category, brandId: params.brand, page }),
    getAdminTaxonomy(),
  ]);

  const pageHref = (target: number) => {
    const next = new URLSearchParams();
    if (params.q) next.set("q", params.q);
    if (params.status) next.set("status", params.status);
    if (params.category) next.set("category", params.category);
    if (params.brand) next.set("brand", params.brand);
    if (target > 1) next.set("page", String(target));
    return `/admin/san-pham?${next.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-3xl font-extrabold">Sản phẩm</h1><p className="mt-2 text-muted-foreground">{total} sản phẩm trong cơ sở dữ liệu.</p></div>
        <Button asChild><Link href="/admin/san-pham/moi"><Plus aria-hidden="true" /> Tạo sản phẩm</Link></Button>
      </div>
      <form className="mt-6 grid gap-3 rounded-xl border bg-card p-4 lg:grid-cols-[minmax(220px,1fr)_180px_220px_200px_auto]">
        <div className="relative"><Label htmlFor="admin-product-search" className="sr-only">Tìm tên hoặc SKU</Label><Search className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" /><Input id="admin-product-search" name="q" defaultValue={params.q} placeholder="Tìm tên hoặc SKU" className="ps-9" /></div>
        <select name="status" aria-label="Trạng thái" defaultValue={params.status ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Mọi trạng thái</option><option value="active">Đang hiển thị</option><option value="hidden">Đang ẩn</option></select>
        <select name="category" aria-label="Danh mục" defaultValue={params.category ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Mọi danh mục</option>{taxonomy.categories.filter((item) => item.kind === "product_type").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select name="brand" aria-label="Thương hiệu" defaultValue={params.brand ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Mọi thương hiệu</option>{taxonomy.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <Button type="submit" variant="outline">Lọc</Button>
      </form>
      <div className="mt-5 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Sản phẩm</TableHead><TableHead>Danh mục</TableHead><TableHead>Giá</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length ? rows.map((product) => (
              <TableRow key={product.id}>
                <TableCell><p className="font-bold">{product.name}</p><p className="text-xs text-muted-foreground">{product.sku} | {product.brandName}</p></TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.price_display_mode === "contact" ? "Liên hệ" : product.reference_price ? `${Number(product.reference_price).toLocaleString("vi-VN")} ₫` : "Thiếu giá"}</TableCell>
                <TableCell><Badge variant={product.is_active ? "default" : "secondary"}>{product.is_active ? "Công khai" : "Đang ẩn"}</Badge></TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm" asChild><Link href={`/admin/san-pham/${product.id}`}>Chỉnh sửa</Link></Button></TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Không có sản phẩm phù hợp.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 ? <nav className="mt-6 flex justify-center gap-2" aria-label="Phân trang sản phẩm">{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <Button key={item} size="icon" variant={item === page ? "default" : "outline"} asChild><Link href={pageHref(item)} aria-current={item === page ? "page" : undefined}>{item}</Link></Button>)}</nav> : null}
    </div>
  );
}
