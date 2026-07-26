"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/catalogue";

const KEY = "vet68-recent-products";

export function RecentlyViewedProducts({ currentSlug, products }: { currentSlug: string; products: Product[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    let previous: string[] = [];
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(stored)) previous = stored.filter((value): value is string => typeof value === "string");
    } catch {
      previous = [];
    }
    const next = [currentSlug, ...previous.filter((slug) => slug !== currentSlug)].slice(0, 6);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Recently viewed is optional when storage is unavailable. */ }
    const timer = window.setTimeout(() => setSlugs(previous.filter((slug) => slug !== currentSlug)), 0);
    return () => window.clearTimeout(timer);
  }, [currentSlug]);
  const items = useMemo(() => slugs.map((slug) => products.find((product) => product.slug === slug)).filter((item): item is Product => Boolean(item)).slice(0, 4), [products, slugs]);
  if (!items.length) return null;
  return <section className="mt-12"><h2 className="text-2xl font-bold text-primary">Sản phẩm đã xem gần đây</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((product) => <Link key={product.id} href={`/san-pham/${product.slug}`} className="grid grid-cols-[72px_1fr] gap-3 rounded-xl border border-border bg-white p-3 transition-colors hover:border-action"><span className="relative aspect-square overflow-hidden rounded-lg bg-[#f4f8fa]"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="72px" className="object-contain p-1" /></span><span><strong className="line-clamp-2 text-sm leading-5">{product.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{product.sku}</span></span></Link>)}</div></section>;
}
