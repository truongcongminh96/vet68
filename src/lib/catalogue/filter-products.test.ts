import { describe, expect, it } from "vitest";
import { products } from "@/lib/catalogue/demo-data";
import { filterProducts } from "@/lib/catalogue/filter-products";

const base = { sort: "relevance", page: 1 } as const;

describe("filterProducts", () => {
  it("tìm SKU chính xác và xếp trước", () => { expect(filterProducts(products, { ...base, query: "VET68-003" })[0]?.sku).toBe("VET68-003"); });
  it("lọc vật nuôi và chế độ giá", () => { const result = filterProducts(products, { ...base, animal: "gia-cam", priceMode: "contact" }); expect(result.every((item) => item.animals.some((animal) => animal.slug === "gia-cam") && item.priceDisplayMode === "contact")).toBe(true); });
  it("ẩn sản phẩm inactive", () => { const hidden = { ...products[0], id: "hidden", slug: "hidden", sku: "HIDDEN", isActive: false }; expect(filterProducts([...products, hidden], base).some((item) => item.id === "hidden")).toBe(false); });
});
