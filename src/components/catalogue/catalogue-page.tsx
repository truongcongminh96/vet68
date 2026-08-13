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
    <div className="paper-page">
      {showHero ? (
        <section className="paper-hero">
          <div className="site-container grid min-h-[390px] items-center gap-7 py-10 md:min-h-[430px] md:grid-cols-[.92fr_1.08fr] md:py-12 lg:gap-14">
            <div className="relative z-10 md:pb-6">
              <span className="hero-ray-mark" aria-hidden="true" />
              <p className="paper-eyebrow">Catalogue Vet68</p>
              <h1 className="paper-heading mt-4 max-w-xl text-[2.35rem] sm:text-5xl lg:text-[58px]">{title}</h1>
              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#405c68] md:text-base">{description}</p>
              <Button className="action-button mt-7 h-12 rounded-full px-6 text-base font-extrabold shadow-[3px_4px_0_rgba(6,45,62,0.12)]" asChild><Link href="#danh-sach-san-pham">Xem danh sách sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
            </div>
            <div className="paper-hero-photo relative aspect-[16/10] self-center md:aspect-[4/3]">
              <Image src="/images/home/hero-veterinary-products.jpg" alt="Nhân viên thú y đang kiểm tra sức khỏe cho chó" fill priority sizes="(max-width: 768px) 100vw, 52vw" className="object-cover object-[70%_center]" />
            </div>
          </div>
        </section>
      ) : (
        <section className="site-container pt-12 md:pt-16"><div className="max-w-3xl"><p className="paper-eyebrow">Tra cứu catalogue</p><h1 className="paper-heading mt-3 text-4xl md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p></div></section>
      )}
      <div className="site-container pb-14 pt-8 md:pb-20 md:pt-10">
      {showHero ? <CatalogueDealStrip products={dealProducts} /> : null}
      {showHero ? <CatalogueCategoryStrip categories={categorySummaries} /> : null}
      <div className="mt-8 grid gap-8 lg:grid-cols-[270px_1fr]">
        <details className="paper-filter-panel group h-fit p-5 lg:hidden" aria-label="Bộ lọc sản phẩm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-bold"><FilterHeading /><span className="text-xs font-semibold text-muted-foreground transition-transform group-open:rotate-180">⌄</span></summary>
          <FilterForm basePath={basePath} filters={filters} taxonomy={taxonomy} idPrefix="mobile" />
        </details>
        <aside className="paper-filter-panel hidden h-fit p-5 lg:sticky lg:top-4 lg:block" aria-label="Bộ lọc sản phẩm"><FilterHeading /><FilterForm basePath={basePath} filters={filters} taxonomy={taxonomy} idPrefix="desktop" /></aside>
        <div id="danh-sach-san-pham">
          <div className="flex flex-col gap-3 border-b border-[#e7dbc4] pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Hiển thị <strong className="text-foreground">{total}</strong> sản phẩm</p><nav className="flex items-center gap-1 rounded-xl border border-[#e8ddc7] bg-white p-1" aria-label="Sắp xếp sản phẩm"><span className="px-2 text-xs font-semibold text-muted-foreground">Sắp xếp</span>{(["name_asc", "name_desc"] as const).map((sort) => <Link key={sort} href={queryHref(basePath, activeQuery(filters, undefined, sort))} aria-current={filters.sort === sort ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${filters.sort === sort ? "bg-primary text-white" : "text-foreground hover:bg-[#fff2df] hover:text-primary"}`}>{sort === "name_asc" ? "Tên A-Z" : "Tên Z-A"}</Link>)}</nav></div>
          {products.length ? <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < 3} />)}</div> : <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center"><SearchX className="size-10 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Hãy thử bỏ bớt bộ lọc, tìm bằng SKU hoặc liên hệ Vet68 để được hỗ trợ.</p><Button className="mt-5" variant="outline" asChild><Link href={basePath}>Xem tất cả sản phẩm</Link></Button></div>}
          {pageCount > 1 ? <nav className="mt-8 flex justify-center gap-2" aria-label="Phân trang">{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Button key={page} variant={page === filters.page ? "default" : "outline"} size="icon" asChild><Link href={`${basePath}?${activeQuery(filters, page)}`} aria-current={page === filters.page ? "page" : undefined}>{page}</Link></Button>)}</nav> : null}
        </div>
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
