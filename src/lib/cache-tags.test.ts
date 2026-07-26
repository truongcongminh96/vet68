import { describe, expect, it } from "vitest";
import { getProductCacheTags } from "@/lib/cache-tags";
describe("catalogue revalidation tags", () => { it("bao phủ catalogue, homepage, sitemap và product", () => { expect(getProductCacheTags("demo")).toEqual(["catalogue", "homepage-products", "sitemap", "product:demo"]); }); });
