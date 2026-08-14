import { describe, expect, it } from "vitest";
import { emptyAdminTaxonomy, parseAdminTaxonomy } from "@/lib/admin/taxonomy";

describe("parseAdminTaxonomy", () => {
  it("đổi payload RPC sang shape admin đang sử dụng", () => {
    const result = parseAdminTaxonomy({
      categories: [{ id: "category-1", name: "Danh mục" }],
      animal_types: [{ id: "animal-1", name: "Chó" }],
      brands: [{ id: "brand-1", name: "Vet68" }],
      companies: [{ id: "company-1", name: "Vet68 Distribution" }],
    });

    expect(result.categories).toHaveLength(1);
    expect(result.animalTypes).toHaveLength(1);
    expect(result.brands).toHaveLength(1);
    expect(result.companies).toHaveLength(1);
  });

  it("trả về taxonomy rỗng cho response bất thường", () => {
    expect(parseAdminTaxonomy(null)).toEqual(emptyAdminTaxonomy);
  });
});
