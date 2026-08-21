import Link from "next/link";
import { ArrowRight, ChevronRight, PackageSearch, RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogueCategoryStrip } from "@/components/catalogue/catalogue-category-strip";
import { CatalogueDealStrip } from "@/components/catalogue/catalogue-deal-strip";
import { CatalogueFilterSidebar } from "@/components/catalogue/catalogue-filter-sidebar";
import { CatalogueNewsStrip } from "@/components/catalogue/catalogue-news-strip";
import { CatalogueSortBar } from "@/components/catalogue/catalogue-sort-bar";
import { ProductCard } from "@/components/catalogue/product-card";
import {
  CATALOGUE_PAGE_SIZE,
  getCatalogueCategorySummaries,
  getDealProducts,
  getDosageForms,
  getPosts,
  getProducts,
  getTaxonomy,
} from "@/lib/catalogue/queries";
import type { CatalogueFilters } from "@/types/catalogue";

function activeQuery(filters: CatalogueFilters, page?: number) {
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
  if (filters.sort && filters.sort !== "name_asc") params.set("sort", filters.sort);
  if (page && page > 1) params.set("page", String(page));
  return params.toString();
}

type CataloguePageProps = {
  title: string;
  description: string;
  filters: CatalogueFilters;
  basePath?: string;
  showHero?: boolean;
};

export async function CataloguePage({
  title,
  description,
  filters,
  basePath = "/san-pham",
  showHero = false,
}: CataloguePageProps) {
  const [
    { products, total, pageCount },
    taxonomy,
    dealProducts,
    categorySummaries,
    dosageForms,
    posts,
  ] = await Promise.all([
    getProducts(filters),
    getTaxonomy(),
    getDealProducts(3),
    showHero ? getCatalogueCategorySummaries() : Promise.resolve([]),
    getDosageForms(),
    getPosts(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. Breadcrumb Bar (Wolf Yoga Style) */}
      <div className="border-b border-[#eaf0ec] bg-white py-3">
        <div className="site-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="font-medium hover:text-main-green">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/san-pham" className="font-medium hover:text-main-green">
              Sản phẩm
            </Link>
            {title !== "Tất cả sản phẩm" && (
              <>
                <ChevronRight className="size-3.5" />
                <span className="font-bold text-main-green truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {title}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 2. Top Category Banner (wolf-collections-topbanner style) */}
      <section aria-label="Thông tin danh mục" className="py-6 lg:py-8">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl border border-[#eaf0ec] bg-white p-6 shadow-[0_10px_30px_rgba(31,74,58,0.04)] sm:p-8 lg:p-10">
            {/* Background luxury gradient & pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-white to-[#faf3ea]/70" />
            <div className="absolute right-0 top-0 size-64 rounded-full bg-main-green/5 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-main-green/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-main-green">
                <PackageSearch className="size-3.5 text-price-orange" /> Danh mục sản phẩm
              </span>

              <h1 className="mt-2.5 font-playfair text-2xl font-bold uppercase tracking-tight text-main-green sm:text-3xl lg:text-4xl">
                {title}
              </h1>

              {/* Decorative Split Line */}
              <div className="my-2.5 flex items-center gap-2">
                <div className="h-0.5 w-10 bg-price-orange/60" />
                <div className="size-1.5 rotate-45 bg-price-orange" />
                <div className="h-0.5 w-16 bg-main-green/30" />
              </div>

              <p className="text-xs leading-relaxed text-[#33302f]/80 sm:text-sm">
                {description}
              </p>
            </div>
          </div>

          {/* 3. Top Deal Row (wolf-collections-sales) */}
          <CatalogueDealStrip products={dealProducts} />

          {/* Quick Subcategory Strip (if showHero) */}
          {showHero && <CatalogueCategoryStrip categories={categorySummaries} />}
        </div>
      </section>

      {/* 4. Main Two-Column Layout (Sidebar + Products Grid) */}
      <div className="site-container pb-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar Filter (col-lg-3 / 3 cols) */}
          <aside className="lg:col-span-3">
            <CatalogueFilterSidebar
              basePath={basePath}
              filters={filters}
              companies={taxonomy.companies}
              animalTypes={taxonomy.animalTypes}
              categories={taxonomy.categories.filter((c) => c.kind === "product_type")}
              dosageForms={dosageForms}
            />
          </aside>

          {/* Right Main Content (col-lg-9 / 9 cols) */}
          <main id="danh-sach-san-pham" className="lg:col-span-9">
            {/* Top Sort & Count Bar */}
            <CatalogueSortBar
              basePath={basePath}
              filters={filters}
              total={total}
              currentPage={filters.page}
              pageSize={CATALOGUE_PAGE_SIZE}
              mobileFilterTrigger={
                <CatalogueFilterSidebar
                  basePath={basePath}
                  filters={filters}
                  companies={taxonomy.companies}
                  animalTypes={taxonomy.animalTypes}
                  categories={taxonomy.categories.filter((c) => c.kind === "product_type")}
                  dosageForms={dosageForms}
                />
              }
            />

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 lg:gap-5">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} eager={index < 4} />
                ))}
              </div>
            ) : (
              /* Empty Search Result */
              <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#eaf0ec] bg-white p-8 text-center shadow-xs">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#faf3ea] text-price-orange">
                  <SearchX className="size-8" />
                </div>
                <h2 className="mt-4 font-playfair text-lg font-bold text-main-green sm:text-xl">
                  Không tìm thấy sản phẩm phù hợp
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Hãy thử điều chỉnh hoặc xóa bớt các tiêu chí lọc, hoặc liên hệ Vet68 qua Zalo/Hotline để được nhân viên tư vấn tra cứu nhanh nhất.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-main-green/20 text-xs font-bold text-main-green hover:bg-main-green hover:text-white"
                  >
                    <Link href={basePath} className="flex items-center gap-1.5">
                      <RotateCcw className="size-3.5" />
                      <span>Xóa bộ lọc</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-xl bg-price-orange text-xs font-bold text-white hover:bg-price-orange-dark"
                  >
                    <Link href="/lien-he">Liên hệ hỗ trợ</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {pageCount > 1 && (
              <nav aria-label="Phân trang danh mục" className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((page) => {
                  const isActive = page === filters.page;
                  const qs = activeQuery(filters, page);
                  const href = qs ? `${basePath}?${qs}` : basePath;
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      asChild
                      className={`size-10 rounded-xl font-bold ${
                        isActive
                          ? "bg-main-green text-white shadow-xs hover:bg-[#163b2e]"
                          : "border-[#eaf0ec] bg-white text-[#33302f] hover:bg-[#faf3ea] hover:text-main-green"
                      }`}
                    >
                      <Link href={href} aria-current={isActive ? "page" : undefined}>
                        {page}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            )}

            {/* 5. Bottom News Strip (wolf-collections-news) */}
            <CatalogueNewsStrip posts={posts} />
          </main>
        </div>
      </div>
    </div>
  );
}
