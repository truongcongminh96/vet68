import type { CatalogueFilters, Product } from "@/types/catalogue";

function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi"); }

function matchesQuery(product: Product, query: string) { const haystack = [product.name, product.sku, product.company.name, product.brand.name, product.activeIngredients, product.category.name, ...product.animals.map((item) => item.name)].join(" "); return normalize(haystack).includes(normalize(query)); }

export function filterProducts(source: Product[], filters: CatalogueFilters) {
  let result = source.filter((product) => product.isActive);
  if (filters.query) result = result.filter((product) => matchesQuery(product, filters.query!));
  if (filters.animal) result = result.filter((product) => product.animals.some((item) => item.slug === filters.animal));
  if (filters.category) result = result.filter((product) => product.category.slug === filters.category || product.secondaryCategories.some((item) => item.slug === filters.category));
  if (filters.company) result = result.filter((product) => product.company.slug === filters.company);
  if (filters.brand) result = result.filter((product) => product.brand.slug === filters.brand);
  if (filters.priceMode) result = result.filter((product) => product.priceDisplayMode === filters.priceMode);
  if (filters.dosageForm) result = result.filter((product) => normalize(product.dosageForm) === normalize(filters.dosageForm!));
  if (filters.consultation) result = result.filter((product) => product.requiresConsultation === (filters.consultation === "required"));
  if (filters.priceMin !== undefined) result = result.filter((product) => product.referencePrice !== null && product.referencePrice >= filters.priceMin!);
  if (filters.priceMax !== undefined) result = result.filter((product) => product.referencePrice !== null && product.referencePrice <= filters.priceMax!);
  return [...result].sort((a, b) => {
    if (filters.query) {
      const aExact = normalize(a.sku) === normalize(filters.query) ? 1 : 0;
      const bExact = normalize(b.sku) === normalize(filters.query) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
    }
    const comparison = a.name.localeCompare(b.name, "vi");
    return filters.sort === "name_desc" ? -comparison : comparison;
  });
}
