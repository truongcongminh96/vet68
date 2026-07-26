import type { Metadata } from "next";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export const metadata: Metadata = { title: "Tất cả sản phẩm", description: "Catalogue thuốc thú y, vaccine, dinh dưỡng, sát trùng và dụng cụ thú y.", alternates: { canonical: "/san-pham" } };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseCatalogueFilters(await searchParams);
  return <CataloguePage title="Catalogue sản phẩm" description="Tìm theo vật nuôi, danh mục, thương hiệu, mức giá tham khảo và yêu cầu tư vấn." filters={filters} />;
}
