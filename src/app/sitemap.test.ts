import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("chứa product và article công khai", async () => { const urls = (await sitemap()).map((item) => item.url); expect(urls.some((url) => url.includes("/san-pham/amoxicillin-50-demo"))).toBe(true); expect(urls.some((url) => url.includes("/kien-thuc-thu-y/cach-doc-thong-tin"))).toBe(true); });
  it("không chứa admin hoặc search", async () => { const urls = (await sitemap()).map((item) => item.url); expect(urls.some((url) => url.includes("/admin") || url.includes("/tim-kiem"))).toBe(false); });
});
