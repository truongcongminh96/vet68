import { z } from "zod";
import type { CatalogueFilters } from "@/types/catalogue";

const optionalNumber = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().nonnegative().optional());

function optionalEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.enum(values).optional().catch(undefined),
  );
}

const optionalString = (max: number) => z.string().trim().max(max).optional().catch(undefined);

const schema = z.object({
  q: optionalString(100),
  animal: optionalString(80),
  category: optionalString(80),
  company: optionalString(80),
  brand: optionalString(80),
  price_min: optionalNumber,
  price_max: optionalNumber,
  dosage_form: optionalString(80),
  consultation: optionalEnum(["required", "not_required"]),
  price_mode: optionalEnum(["fixed", "approximate", "contact"]),
  sort: z.enum(["name_asc", "name_desc"]).catch("name_asc"),
  page: z.coerce.number().int().positive().catch(1),
});

export function parseCatalogueFilters(values: Record<string, string | string[] | undefined>): CatalogueFilters {
  const firstValues = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const parsed = schema.parse(firstValues);
  return {
    query: parsed.q,
    animal: parsed.animal,
    category: parsed.category,
    company: parsed.company,
    brand: parsed.brand,
    priceMin: parsed.price_min,
    priceMax: parsed.price_max,
    dosageForm: parsed.dosage_form,
    consultation: parsed.consultation,
    priceMode: parsed.price_mode,
    sort: parsed.sort,
    page: parsed.page,
  };
}
