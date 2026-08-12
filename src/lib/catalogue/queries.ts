import "server-only";

import { cache } from "react";
import { animalTypes as demoAnimalTypes, brands as demoBrands, categories as demoCategories, companies as demoCompanies, posts as demoPosts, products as demoProducts } from "@/lib/catalogue/demo-data";
import { filterProducts } from "@/lib/catalogue/filter-products";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import type { AnimalType, Brand, CatalogueFilters, Category, Company, Post, Product } from "@/types/catalogue";
import type { Database } from "@/types/database";

export const CATALOGUE_PAGE_SIZE = 12;

const loadPublicProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoProducts;

  const { data: productRows, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error || !productRows?.length) return [];

  const productIds = productRows.map((row) => row.id);
  const { data: secondaryLinks } = await supabase
    .from("product_categories")
    .select("product_id, category_id")
    .in("product_id", productIds);

  const brandIds = productRows.flatMap((row) => row.brand_id ? [row.brand_id] : []);
  const companyIds = productRows.flatMap((row) => row.company_id ? [row.company_id] : []);
  const categoryIds = [
    ...productRows.flatMap((row) => row.category_id ? [row.category_id] : []),
    ...(secondaryLinks ?? []).map((row) => row.category_id),
  ];

  const [{ data: companyRows }, { data: brandRows }, { data: categoryRows }, { data: animalLinks }, { data: imageRows }] = await Promise.all([
    companyIds.length ? supabase.from("companies").select("*").in("id", [...new Set(companyIds)]) : Promise.resolve({ data: [] }),
    brandIds.length ? supabase.from("brands").select("*").in("id", [...new Set(brandIds)]) : Promise.resolve({ data: [] }),
    categoryIds.length ? supabase.from("categories").select("*").in("id", [...new Set(categoryIds)]) : Promise.resolve({ data: [] }),
    supabase.from("product_animal_types").select("product_id, animal_type_id").in("product_id", productIds),
    supabase.from("product_images").select("*").in("product_id", productIds).order("is_primary", { ascending: false }).order("sort_order", { ascending: true }),
  ]);

  const animalIds = [...new Set((animalLinks ?? []).map((row) => row.animal_type_id))];
  const { data: animalRows } = animalIds.length
    ? await supabase.from("animal_types").select("*").in("id", animalIds)
    : { data: [] };

  const companyMap = new Map((companyRows ?? []).map((row) => [row.id, mapCompany(row)]));
  const brandMap = new Map((brandRows ?? []).map((row) => [row.id, mapBrand(supabase, row)]));
  const categoryMap = new Map((categoryRows ?? []).map((row) => [row.id, mapCategory(supabase, row)]));
  const animalMap = new Map((animalRows ?? []).map((row) => [row.id, mapAnimalType(supabase, row)]));

  const products = productRows.flatMap((row) => {
    const company = row.company_id ? companyMap.get(row.company_id) : undefined;
    const brand = row.brand_id ? brandMap.get(row.brand_id) : undefined;
    const category = row.category_id ? categoryMap.get(row.category_id) : undefined;
    if (!company || !brand || !category || !row.price_display_mode) return [];

    const fallbackImage = getProductFallback(category.slug);
    const images = (imageRows ?? [])
      .filter((image) => image.product_id === row.id)
      .map((image) => ({
        src: getPublicStorageUrl(supabase, "product-images", image.storage_path, fallbackImage),
        alt: image.alt_text,
      }));

    return [{
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      shortDescription: row.short_description ?? "",
      description: row.description ?? "",
      company,
      brand,
      category,
      secondaryCategories: (secondaryLinks ?? [])
        .filter((link) => link.product_id === row.id)
        .flatMap((link) => categoryMap.get(link.category_id) ?? []),
      animals: (animalLinks ?? [])
        .filter((link) => link.product_id === row.id)
        .flatMap((link) => animalMap.get(link.animal_type_id) ?? []),
      referencePrice: row.reference_price === null ? null : Number(row.reference_price),
      priceDisplayMode: row.price_display_mode,
      priceNote: row.price_note ?? undefined,
      unit: row.unit ?? "Chưa cập nhật",
      dosageForm: row.dosage_form ?? "Chưa cập nhật",
      activeIngredients: row.active_ingredients ?? "Thông tin đang được cập nhật.",
      packaging: row.packaging ?? "Chưa cập nhật",
      indications: row.indications ?? "Thông tin đang được cập nhật.",
      usageInformation: row.usage_information ?? "Vui lòng liên hệ Vet68 và tham khảo hướng dẫn từ nhà sản xuất.",
      storageInformation: row.storage_information ?? "Thông tin bảo quản đang được cập nhật. Vui lòng kiểm tra nhãn sản phẩm hoặc hướng dẫn chính thức từ nhà sản xuất.",
      safetyInformation: row.safety_information ?? "Đọc kỹ nhãn sản phẩm và tham khảo người có chuyên môn.",
      requiresConsultation: row.requires_consultation,
      isFeatured: row.is_featured,
      isNew: row.is_new,
      isActive: row.is_active,
      images: images.length ? images : [{ src: fallbackImage, alt: `Ảnh minh hoạ tạm cho ${row.name}, hình sản phẩm thật chưa được cập nhật` }],
      updatedAt: row.updated_at,
    } satisfies Product];
  });

  if (!products.some((product) => product.slug.endsWith("-demo"))) return products;

  return mergeBySlug(products, demoProducts, (product, demoProduct) => ({
    ...demoProduct,
    ...product,
    brand: {
      ...demoProduct.brand,
      ...product.brand,
      logo: product.brand.logo || demoProduct.brand.logo,
      logoAlt: product.brand.logoAlt || demoProduct.brand.logoAlt,
    },
    company: product.company,
    secondaryCategories: mergeBySlug(product.secondaryCategories, demoProduct.secondaryCategories),
    animals: mergeBySlug(product.animals, demoProduct.animals),
  }));
});

const loadTaxonomy = cache(async () => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { categories: demoCategories, animalTypes: demoAnimalTypes, brands: demoBrands, companies: demoCompanies };

  const [{ data: categoryRows, error: categoryError }, { data: animalRows, error: animalError }, { data: brandRows, error: brandError }, { data: companyRows, error: companyError }] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("animal_types").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("brands").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("companies").select("*").eq("is_active", true).order("sort_order"),
  ]);

  if (categoryError || animalError || brandError || companyError) return { categories: [], animalTypes: [], brands: [], companies: [] };
  const categories = (categoryRows ?? []).map((row) => mapCategory(supabase, row));
  const animalTypes = (animalRows ?? []).map((row) => mapAnimalType(supabase, row));
  const brands = (brandRows ?? []).map((row) => mapBrand(supabase, row));
  const companies = (companyRows ?? []).map(mapCompany);
  return { categories, animalTypes, brands, companies };
});

const loadPosts = cache(async (): Promise<Post[]> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoPosts;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error) return [];
  if (!data?.length) return demoPosts;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content_markdown,
    coverImage: getPublicStorageUrl(supabase, "article-covers", row.cover_path, "/images/demo/article-care.jpg"),
    coverAlt: row.cover_alt ?? `Ảnh minh họa cho bài ${row.title}`,
    publishedAt: row.published_at ?? row.updated_at,
    readingMinutes: Math.max(1, Math.ceil(row.content_markdown.trim().split(/\s+/).length / 220)),
  }));
});

export async function getProducts(filters: CatalogueFilters) {
  const result = filterProducts(await loadPublicProducts(), filters);
  const total = result.length;
  const start = (filters.page - 1) * CATALOGUE_PAGE_SIZE;
  return { products: result.slice(start, start + CATALOGUE_PAGE_SIZE), total, pageCount: Math.max(1, Math.ceil(total / CATALOGUE_PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  return (await loadPublicProducts()).find((product) => product.slug === slug && product.isActive) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  return (await loadPublicProducts())
    .filter((item) => item.id !== product.id && (item.category.id === product.category.id || item.animals.some((animal) => product.animals.some((target) => target.id === animal.id))))
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 4) {
  return (await loadPublicProducts()).filter((product) => product.isFeatured).slice(0, limit);
}

export async function getDealProducts(limit = 5) {
  const products = await loadPublicProducts();
  const featured = products.filter((product) => product.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const featuredIds = new Set(featured.map((product) => product.id));
  return [...featured, ...products.filter((product) => !featuredIds.has(product.id))].slice(0, limit);
}

export async function getCatalogueCategorySummaries() {
  const [products, taxonomy] = await Promise.all([loadPublicProducts(), loadTaxonomy()]);

  return taxonomy.categories
    .filter((category) => category.kind === "product_type")
    .map((category) => {
      const matchingProducts = products.filter((product) => (
        product.category.id === category.id
        || product.secondaryCategories.some((secondaryCategory) => secondaryCategory.id === category.id)
      ));

      return {
        category,
        productCount: matchingProducts.length,
        image: category.image || matchingProducts[0]?.images[0]?.src || getProductFallback(category.slug),
        imageAlt: category.imageAlt || matchingProducts[0]?.images[0]?.alt || `Ảnh minh hoạ cho danh mục ${category.name}`,
      };
    });
}

export async function getNewProducts(limit = 4) {
  return (await loadPublicProducts()).filter((product) => product.isNew).slice(0, limit);
}

export async function getRecentlyViewableProducts(limit = 12) {
  return (await loadPublicProducts()).slice(0, limit);
}

export async function getSitemapProducts() {
  return loadPublicProducts();
}

export async function getDosageForms() {
  return [...new Set((await loadPublicProducts()).map((product) => product.dosageForm).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
}

export async function getTaxonomy() {
  return loadTaxonomy();
}

export async function getPostBySlug(slug: string) {
  return (await loadPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getPosts() {
  return loadPosts();
}

function mapCategory(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> & {}, row: Database["public"]["Tables"]["categories"]["Row"]): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: row.kind,
    description: row.description ?? "",
    image: row.image_path ? getPublicStorageUrl(supabase, "category-images", row.image_path, "") : undefined,
    imageAlt: row.image_alt ?? undefined,
  };
}

function mapAnimalType(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> & {}, row: Database["public"]["Tables"]["animal_types"]["Row"]): AnimalType {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: getPublicStorageUrl(supabase, "animal-images", row.image_path, getAnimalFallback(row.slug)),
    imageAlt: row.image_alt ?? undefined,
  };
}

function getAnimalFallback(slug: string) {
  const fallbacks: Record<string, string> = {
    cho: "/images/demo/animal-dogs.jpg",
    meo: "/images/demo/animal-cats.jpg",
    "gia-suc": "/images/demo/animal-livestock-cattle.jpg",
    "gia-cam": "/images/demo/animal-poultry.jpg",
    "thuy-san": "/images/demo/animal-aquaculture.jpg",
    "thiet-bi-thu-y": "/images/products/demo-veterinary-syringe.svg",
  };
  return fallbacks[slug] ?? "/images/demo/animal-dogs.jpg";
}

function getProductFallback(categorySlug: string) {
  const fallbacks: Record<string, string> = {
    "thuoc-tiem": "/images/products/demo-veterinary-syringe.svg",
    "thuoc-uong": "/images/products/demo-antibiotic-sachet.svg",
    "thuoc-boi-ngoai-da-phun-xit": "/images/products/demo-disinfectant.svg",
    "thuoc-dieu-tri-noi-ngoai-kst": "/images/products/demo-antibiotic-sachet.svg",
    "thuoc-dac-tri": "/images/products/demo-vitamin-bottle.svg",
    "vaccine-khang-the": "/images/products/demo-vaccine-vials.svg",
    "moi-truong": "/images/products/demo-disinfectant.svg",
    "huong-than": "/images/products/demo-vitamin-bottle.svg",
    "thuoc-thu-y": "/images/products/demo-antibiotic-sachet.svg",
    "vaccine-sinh-pham": "/images/products/demo-vaccine-vials.svg",
    "vitamin-dinh-duong": "/images/products/demo-vitamin-bottle.svg",
    "sat-trung-ve-sinh": "/images/products/demo-disinfectant.svg",
    "dung-cu-thu-y": "/images/products/demo-veterinary-syringe.svg",
  };
  return fallbacks[categorySlug] ?? "/images/products/demo-mineral-bag.svg";
}

function mapBrand(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> & {}, row: Database["public"]["Tables"]["brands"]["Row"]): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    logo: row.logo_path ? getPublicStorageUrl(supabase, "brand-logos", row.logo_path, "") : undefined,
    logoAlt: row.logo_alt ?? undefined,
  };
}

function mapCompany(row: Database["public"]["Tables"]["companies"]["Row"]): Company {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description ?? "" };
}

function mergeBySlug<T extends { slug: string }>(
  primary: T[],
  fallback: T[],
  merge: (primaryItem: T, fallbackItem: T) => T = (primaryItem) => primaryItem,
) {
  const fallbackMap = new Map(fallback.map((item) => [item.slug, item]));
  const merged = primary.map((item) => {
    const fallbackItem = fallbackMap.get(item.slug);
    if (!fallbackItem) return item;
    fallbackMap.delete(item.slug);
    return merge(item, fallbackItem);
  });

  return [...merged, ...fallbackMap.values()];
}
