import { describe, expect, it } from "vitest";
import { parseCatalogueFilters } from "@/lib/catalogue/search-params";

describe("parseCatalogueFilters", () => {
  it("chuẩn hóa search params", () => { expect(parseCatalogueFilters({ q: "  VET68  ", page: "2", price_min: "100000", price_mode: "fixed" })).toMatchObject({ query: "VET68", page: 2, priceMin: 100000, priceMode: "fixed" }); });
  it("đưa page lỗi về 1", () => { expect(parseCatalogueFilters({ page: "-2" }).page).toBe(1); });
  it("bỏ qua enum rỗng từ bộ lọc HTML", () => {
    expect(parseCatalogueFilters({ consultation: "", price_mode: "" })).toMatchObject({
      consultation: undefined,
      priceMode: undefined,
    });
  });
  it("không làm hỏng trang khi enum trên URL không hợp lệ", () => {
    expect(parseCatalogueFilters({ consultation: "invalid", price_mode: "zero", sort: "random" })).toMatchObject({
      consultation: undefined,
      priceMode: undefined,
      sort: "relevance",
    });
  });
});
