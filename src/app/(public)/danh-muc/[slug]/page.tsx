import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { getTaxonomy } from "@/lib/catalogue/queries";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = (await getTaxonomy()).categories.find((category) => category.slug === slug); if (!item) return {}; return { title: item.name, description: item.description, alternates: { canonical: `/danh-muc/${slug}` } }; }

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params; const item = (await getTaxonomy()).categories.find((category) => category.slug === slug); if (!item) notFound();
  const filters = parseCatalogueFilters({ ...(await searchParams), category: slug });
  return <CataloguePage title={item.name} description={item.description} filters={filters} basePath={`/danh-muc/${slug}`} />;
}
