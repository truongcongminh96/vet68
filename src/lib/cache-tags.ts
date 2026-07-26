export function getProductCacheTags(slug: string) { return ["catalogue", "homepage-products", "sitemap", `product:${slug}`] as const; }
