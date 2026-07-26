import type { Metadata } from "next";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export const metadata: Metadata = { title: "Tìm kiếm sản phẩm", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseCatalogueFilters(await searchParams);
  return <CataloguePage title={filters.query ? `Kết quả cho “${filters.query}”` : "Tìm kiếm sản phẩm"} description="Tìm theo tên, SKU, thương hiệu, hoạt chất, danh mục hoặc vật nuôi." filters={filters} basePath="/tim-kiem" />;
}
