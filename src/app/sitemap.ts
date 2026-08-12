import type { MetadataRoute } from "next";
import { getPosts, getSitemapProducts, getTaxonomy } from "@/lib/catalogue/queries";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, taxonomy, posts] = await Promise.all([getSitemapProducts(), getTaxonomy(), getPosts()]);
  const staticRoutes = ["", "/san-pham", "/khuyen-mai", "/kien-thuc-thu-y", "/gioi-thieu", "/lien-he"];
  return [
    ...staticRoutes.map((route) => ({ url: absoluteUrl(route || "/"), lastModified: new Date(), changeFrequency: route === "" ? "daily" as const : "weekly" as const, priority: route === "" ? 1 : 0.7 })),
    ...products.map((item) => ({ url: absoluteUrl(`/san-pham/${item.slug}`), lastModified: new Date(item.updatedAt), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...taxonomy.categories.map((item) => ({ url: absoluteUrl(`/danh-muc/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...taxonomy.animalTypes.map((item) => ({ url: absoluteUrl(`/vat-nuoi/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...taxonomy.companies.map((item) => ({ url: absoluteUrl(`/cong-ty/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...taxonomy.brands.map((item) => ({ url: absoluteUrl(`/thuong-hieu/${item.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...posts.map((item) => ({ url: absoluteUrl(`/kien-thuc-thu-y/${item.slug}`), lastModified: new Date(item.publishedAt), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
