import Link from "next/link";
import { Filter, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/catalogue/product-card";
import { getDosageForms, getProducts, getTaxonomy } from "@/lib/catalogue/queries";
import type { CatalogueFilters } from "@/types/catalogue";

function activeQuery(filters: CatalogueFilters, page?: number) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.animal) params.set("animal", filters.animal);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.priceMin !== undefined) params.set("price_min", String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set("price_max", String(filters.priceMax));
  if (filters.dosageForm) params.set("dosage_form", filters.dosageForm);
  if (filters.consultation) params.set("consultation", filters.consultation);
  if (filters.priceMode) params.set("price_mode", filters.priceMode);
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (page && page > 1) params.set("page", String(page));
  return params.toString();
}

export async function CataloguePage({ title, description, filters, basePath = "/san-pham" }: { title: string; description: string; filters: CatalogueFilters; basePath?: string }) {
  const [{ products, total, pageCount }, taxonomy, dosageForms] = await Promise.all([getProducts(filters), getTaxonomy(), getDosageForms()]);
  return (
    <div className="site-container section-space">
      <div className="max-w-3xl"><h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-4" aria-label="Bộ lọc sản phẩm">
          <div className="flex items-center gap-2"><Filter className="size-5 text-primary" aria-hidden="true" /><h2 className="font-bold">Bộ lọc</h2></div>
          <form action={basePath} className="mt-5 grid gap-5">
            <div className="grid gap-2"><Label htmlFor="filter-q">Từ khóa</Label><Input id="filter-q" name="q" defaultValue={filters.query} placeholder="Tên hoặc SKU" /></div>
            <div className="grid gap-2"><Label htmlFor="filter-animal">Vật nuôi</Label><select id="filter-animal" name="animal" defaultValue={filters.animal ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option>{taxonomy.animalTypes.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></div>
            <div className="grid gap-2"><Label htmlFor="filter-category">Danh mục</Label><select id="filter-category" name="category" defaultValue={filters.category ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option>{taxonomy.categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></div>
            <div className="grid gap-2"><Label htmlFor="filter-brand">Thương hiệu</Label><select id="filter-brand" name="brand" defaultValue={filters.brand ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option>{taxonomy.brands.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></div>
            <div className="grid gap-2"><Label htmlFor="filter-price">Hiển thị giá</Label><select id="filter-price" name="price_mode" defaultValue={filters.priceMode ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option><option value="fixed">Giá cố định</option><option value="approximate">Giá khoảng</option><option value="contact">Liên hệ báo giá</option></select></div>
            <div className="grid grid-cols-2 gap-2"><div className="grid gap-2"><Label htmlFor="price-min">Giá từ</Label><Input id="price-min" name="price_min" type="number" min="0" defaultValue={filters.priceMin} /></div><div className="grid gap-2"><Label htmlFor="price-max">Đến</Label><Input id="price-max" name="price_max" type="number" min="0" defaultValue={filters.priceMax} /></div></div>
            <div className="grid gap-2"><Label htmlFor="dosage-form">Dạng sản phẩm</Label><select id="dosage-form" name="dosage_form" defaultValue={filters.dosageForm ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option>{dosageForms.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div className="grid gap-2"><Label htmlFor="consultation">Tư vấn</Label><select id="consultation" name="consultation" defaultValue={filters.consultation ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option><option value="required">Cần tư vấn</option><option value="not_required">Không bắt buộc</option></select></div>
            <Button type="submit">Áp dụng bộ lọc</Button>
            <Button type="button" variant="ghost" asChild><Link href={basePath}>Xóa bộ lọc</Link></Button>
          </form>
        </aside>
        <div>
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Tìm thấy <strong className="text-foreground">{total}</strong> sản phẩm</p><form action={basePath} className="flex items-center gap-2"><input type="hidden" name="q" value={filters.query ?? ""} /><input type="hidden" name="animal" value={filters.animal ?? ""} /><input type="hidden" name="category" value={filters.category ?? ""} /><input type="hidden" name="brand" value={filters.brand ?? ""} /><input type="hidden" name="price_min" value={filters.priceMin ?? ""} /><input type="hidden" name="price_max" value={filters.priceMax ?? ""} /><input type="hidden" name="dosage_form" value={filters.dosageForm ?? ""} /><input type="hidden" name="consultation" value={filters.consultation ?? ""} /><input type="hidden" name="price_mode" value={filters.priceMode ?? ""} /><Label htmlFor="sort">Sắp xếp</Label><select id="sort" name="sort" defaultValue={filters.sort} className="h-10 rounded-md border bg-card px-3 text-sm"><option value="relevance">Phù hợp</option><option value="newest">Mới cập nhật</option><option value="name">Tên A-Z</option><option value="price_asc">Giá thấp đến cao</option><option value="price_desc">Giá cao đến thấp</option></select><Button type="submit" variant="outline">Đổi</Button></form></div>
          {products.length ? <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < 3} />)}</div> : <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center"><SearchX className="size-10 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Hãy thử bỏ bớt bộ lọc, tìm bằng SKU hoặc liên hệ Vet68 để được hỗ trợ.</p><Button className="mt-5" variant="outline" asChild><Link href={basePath}>Xem tất cả sản phẩm</Link></Button></div>}
          {pageCount > 1 ? <nav className="mt-8 flex justify-center gap-2" aria-label="Phân trang">{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Button key={page} variant={page === filters.page ? "default" : "outline"} size="icon" asChild><Link href={`${basePath}?${activeQuery(filters, page)}`} aria-current={page === filters.page ? "page" : undefined}>{page}</Link></Button>)}</nav> : null}
        </div>
      </div>
    </div>
  );
}
