export type PriceDisplayMode = "fixed" | "approximate" | "contact";

export type AnimalType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt?: string;
};

export type CategoryKind = "product_type" | "treatment_need";

export type Category = {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  description: string;
  image?: string;
  imageAlt?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  logoAlt?: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  company: Company;
  brand: Brand;
  category: Category;
  secondaryCategories: Category[];
  animals: AnimalType[];
  referencePrice: number | null;
  priceDisplayMode: PriceDisplayMode;
  priceNote?: string;
  unit: string;
  dosageForm: string;
  activeIngredients: string;
  packaging: string;
  indications: string;
  usageInformation: string;
  storageInformation: string;
  safetyInformation: string;
  requiresConsultation: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  images: Array<{ src: string; alt: string }>;
  updatedAt: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  publishedAt: string;
  readingMinutes: number;
};

export type CatalogueSort = "name_asc" | "name_desc" | "newest" | "price_asc" | "price_desc";

export type CatalogueFilters = {
  query?: string;
  animal?: string;
  category?: string;
  company?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  dosageForm?: string;
  consultation?: "required" | "not_required";
  priceMode?: PriceDisplayMode;
  sort: CatalogueSort;
  page: number;
};
