import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CataloguePage } from "@/components/catalogue/catalogue-page";
import { getTaxonomy } from "@/lib/catalogue/queries";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = (await getTaxonomy()).animalTypes.find((animal) => animal.slug === slug); if (!item) return {}; return { title: `Sản phẩm cho ${item.name}`, description: item.description, alternates: { canonical: `/vat-nuoi/${slug}` } }; }

export default async function AnimalPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params; const item = (await getTaxonomy()).animalTypes.find((animal) => animal.slug === slug); if (!item) notFound();
  const filters = parseCatalogueFilters({ ...(await searchParams), animal: slug });
  return <CataloguePage title={`Sản phẩm cho ${item.name}`} description={item.description} filters={filters} basePath={`/vat-nuoi/${slug}`} />;
}
