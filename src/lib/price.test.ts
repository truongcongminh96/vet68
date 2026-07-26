import { describe, expect, it } from "vitest";
import { getPriceDisplay } from "@/lib/price";

describe("getPriceDisplay", () => {
  it("hiển thị giá cố định", () => { expect(getPriceDisplay({ priceDisplayMode: "fixed", referencePrice: 125000 }).label).toContain("125.000"); });
  it("hiển thị giá khoảng", () => { expect(getPriceDisplay({ priceDisplayMode: "approximate", referencePrice: 125000 }).label).toContain("khoảng"); });
  it("hiển thị liên hệ", () => { expect(getPriceDisplay({ priceDisplayMode: "contact", referencePrice: null }).label).toBe("Liên hệ báo giá"); });
  it("không biến giá thiếu thành 0", () => { expect(getPriceDisplay({ priceDisplayMode: "fixed", referencePrice: null }).label).toBe("Liên hệ báo giá"); });
});
