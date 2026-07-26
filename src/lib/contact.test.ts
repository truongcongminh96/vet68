import { describe, expect, it } from "vitest";
import { buildProductConsultationMessage } from "@/lib/contact";

describe("buildProductConsultationMessage", () => {
  it("chứa đủ tên, SKU, quy cách và URL", () => { const message = buildProductConsultationMessage({ name: "Amoxicillin 50% Demo", sku: "VET68-001", packaging: "Gói 100 g" }, "https://example.com/san-pham/demo"); expect(message).toContain("Amoxicillin 50% Demo"); expect(message).toContain("VET68-001"); expect(message).toContain("Gói 100 g"); expect(message).toContain("https://example.com/san-pham/demo"); });
});
