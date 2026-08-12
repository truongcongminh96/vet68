import type { Metadata } from "next";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export const metadata: Metadata = { title: "Tất cả sản phẩm", description: "Catalogue thuốc thú y, vaccine, dinh dưỡng, sát trùng và dụng cụ thú y.", alternates: { canonical: "/san-pham" } };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseCatalogueFilters(await searchParams);
  return <CataloguePage title="Tất cả sản phẩm" description="Khám phá sản phẩm Vet68 theo công ty phân phối, danh mục, đối tượng sử dụng và nhu cầu tư vấn." filters={filters} showHero />;
}
