import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type AnimalType = Database["public"]["Tables"]["animal_types"]["Row"];
type Brand = Database["public"]["Tables"]["brands"]["Row"];
type Company = Database["public"]["Tables"]["companies"]["Row"];

export type AdminTaxonomy = {
  categories: Category[];
  animalTypes: AnimalType[];
  brands: Brand[];
  companies: Company[];
};

export const emptyAdminTaxonomy: AdminTaxonomy = {
  categories: [],
  animalTypes: [],
  brands: [],
  companies: [],
};

export function parseAdminTaxonomy(payload: unknown): AdminTaxonomy {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return emptyAdminTaxonomy;
  const data = payload as Record<string, unknown>;
  return {
    categories: arrayValue<Category>(data.categories),
    animalTypes: arrayValue<AnimalType>(data.animal_types),
    brands: arrayValue<Brand>(data.brands),
    companies: arrayValue<Company>(data.companies),
  };
}

function arrayValue<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}
