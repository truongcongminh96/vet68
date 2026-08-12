import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CatalogueCategoryStrip } from "@/components/catalogue/catalogue-category-strip";
import { CatalogueDealStrip } from "@/components/catalogue/catalogue-deal-strip";
import { ProductCard } from "@/components/catalogue/product-card";
import { getCatalogueCategorySummaries, getDealProducts, getProducts, getTaxonomy } from "@/lib/catalogue/queries";
import type { CatalogueFilters } from "@/types/catalogue";

function activeQuery(filters: CatalogueFilters, page?: number, sort = filters.sort) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.animal) params.set("animal", filters.animal);
  if (filters.category) params.set("category", filters.category);
  if (filters.company) params.set("company", filters.company);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.priceMin !== undefined) params.set("price_min", String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set("price_max", String(filters.priceMax));
  if (filters.dosageForm) params.set("dosage_form", filters.dosageForm);
  if (filters.consultation) params.set("consultation", filters.consultation);
  if (filters.priceMode) params.set("price_mode", filters.priceMode);
  if (sort !== "name_asc") params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));
  return params.toString();
}

function queryHref(basePath: string, query: string) {
  return query ? `${basePath}?${query}` : basePath;
}

type CataloguePageProps = {
  title: string;
  description: string;
  filters: CatalogueFilters;
  basePath?: string;
  showHero?: boolean;
};

export async function CataloguePage({ title, description, filters, basePath = "/san-pham", showHero = false }: CataloguePageProps) {
  const [{ products, total, pageCount }, taxonomy, dealProducts, categorySummaries] = await Promise.all([
    getProducts(filters),
    getTaxonomy(),
    showHero ? getDealProducts(5) : Promise.resolve([]),
    showHero ? getCatalogueCategorySummaries() : Promise.resolve([]),
  ]);
  return (
    <div className="site-container section-space">
      {showHero ? (
        <section className="relative isolate min-h-[330px] overflow-hidden rounded-2xl bg-soft-blue p-7 retail-card-shadow md:min-h-[390px] md:p-12">
          <Image src="/images/home/hero-veterinary-products.jpg" alt="Nhân viên thú y đang kiểm tra sức khỏe cho chó" fill priority sizes="(max-width: 1400px) 100vw, 1320px" className="-z-20 object-cover object-[70%_center]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,250,252,0.98)_0%,rgba(247,250,252,0.92)_38%,rgba(247,250,252,0.24)_72%,rgba(247,250,252,0.04)_100%)] max-sm:bg-[linear-gradient(180deg,rgba(247,250,252,0.97)_0%,rgba(247,250,252,0.82)_62%,rgba(6,42,64,0.42)_100%)]" />
          <div className="relative flex min-h-[276px] max-w-2xl flex-col justify-between md:min-h-[294px]">
            <div>
              <p className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Catalogue Vet68</p>
              <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary md:text-6xl">{title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#385565] md:text-base md:leading-7">{description}</p>
            </div>
            <Button className="action-button h-11 w-fit px-5" asChild><Link href="#danh-sach-san-pham">Xem danh sách sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </section>
      ) : (
        <div className="max-w-3xl"><h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p></div>
      )}
      {showHero ? <CatalogueDealStrip products={dealProducts} /> : null}
      {showHero ? <CatalogueCategoryStrip categories={categorySummaries} /> : null}
      <div className="mt-8 grid gap-8 lg:grid-cols-[270px_1fr]">
        <details className="group h-fit rounded-xl border bg-card p-5 lg:hidden" aria-label="Bộ lọc sản phẩm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-bold"><FilterHeading /><span className="text-xs font-semibold text-muted-foreground transition-transform group-open:rotate-180">⌄</span></summary>
          <FilterForm basePath={basePath} filters={filters} taxonomy={taxonomy} idPrefix="mobile" />
        </details>
        <aside className="hidden h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-4 lg:block" aria-label="Bộ lọc sản phẩm"><FilterHeading /><FilterForm basePath={basePath} filters={filters} taxonomy={taxonomy} idPrefix="desktop" /></aside>
        <div id="danh-sach-san-pham">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Hiển thị <strong className="text-foreground">{total}</strong> sản phẩm</p><nav className="flex items-center gap-1 rounded-lg border bg-white p-1" aria-label="Sắp xếp sản phẩm"><span className="px-2 text-xs font-semibold text-muted-foreground">Sắp xếp</span>{(["name_asc", "name_desc"] as const).map((sort) => <Link key={sort} href={queryHref(basePath, activeQuery(filters, undefined, sort))} aria-current={filters.sort === sort ? "page" : undefined} className={`rounded-md px-3 py-2 text-sm font-bold transition-colors ${filters.sort === sort ? "bg-primary text-white" : "text-foreground hover:bg-soft-blue hover:text-primary"}`}>{sort === "name_asc" ? "Tên A-Z" : "Tên Z-A"}</Link>)}</nav></div>
          {products.length ? <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < 3} />)}</div> : <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center"><SearchX className="size-10 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Hãy thử bỏ bớt bộ lọc, tìm bằng SKU hoặc liên hệ Vet68 để được hỗ trợ.</p><Button className="mt-5" variant="outline" asChild><Link href={basePath}>Xem tất cả sản phẩm</Link></Button></div>}
          {pageCount > 1 ? <nav className="mt-8 flex justify-center gap-2" aria-label="Phân trang">{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Button key={page} variant={page === filters.page ? "default" : "outline"} size="icon" asChild><Link href={`${basePath}?${activeQuery(filters, page)}`} aria-current={page === filters.page ? "page" : undefined}>{page}</Link></Button>)}</nav> : null}
        </div>
      </div>
    </div>
  );
}

function FilterHeading() {
  return <span className="flex items-center gap-2"><Filter className="size-5 text-primary" aria-hidden="true" />Bộ lọc sản phẩm</span>;
}

function FilterForm({ basePath, filters, taxonomy, idPrefix }: {
  basePath: string;
  filters: CatalogueFilters;
  taxonomy: Awaited<ReturnType<typeof getTaxonomy>>;
  idPrefix: "mobile" | "desktop";
}) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const petOptions = taxonomy.animalTypes.filter((item) => item.slug === "cho" || item.slug === "meo");
  const productCategories = taxonomy.categories.filter((item) => item.kind === "product_type");

  return (
    <form action={basePath} className="mt-5 grid gap-5">
      {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
      <FilterSelect id={fieldId("filter-company")} name="company" label="Sản phẩm của công ty" value={filters.company} options={taxonomy.companies} />
      <FilterSelect id={fieldId("filter-category")} name="category" label="Danh mục sản phẩm" value={filters.category} options={productCategories} />
      <FilterSelect id={fieldId("filter-animal")} name="animal" label="Dùng cho chó hoặc mèo" value={filters.animal} options={petOptions} />
      <Button type="submit">Áp dụng bộ lọc</Button>
      <Button type="button" variant="ghost" asChild><Link href={basePath}>Xóa bộ lọc</Link></Button>
    </form>
  );
}

function FilterSelect({ id, name, label, value, options }: {
  id: string;
  name: "company" | "category" | "animal";
  label: string;
  value?: string;
  options: Array<{ id: string; name: string; slug: string }>;
}) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><select id={id} name={name} defaultValue={value ?? ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Tất cả</option>{options.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></div>;
}
