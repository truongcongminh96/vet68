import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { getTaxonomy } from "@/lib/catalogue/queries";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = (await getTaxonomy()).brands.find((brand) => brand.slug === slug); if (!item) return {}; return { title: item.name, description: item.description, alternates: { canonical: `/thuong-hieu/${slug}` } }; }

export default async function BrandPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params; const item = (await getTaxonomy()).brands.find((brand) => brand.slug === slug); if (!item) notFound();
  const filters = parseCatalogueFilters({ ...(await searchParams), brand: slug });
  return <CataloguePage title={item.name} description={item.description} filters={filters} basePath={`/thuong-hieu/${slug}`} />;
}
