import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Heart, MessageCircle, Star } from "lucide-react";
import { ProductPrice } from "@/components/catalogue/product-price";
import { Badge } from "@/components/ui/badge";
import { getTelephoneUrl } from "@/lib/contact";
import { buildProductConsultationMessage } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { absoluteUrl } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import type { Product } from "@/types/catalogue";

export async function ProductCard({
  product,
  eager = false,
  showcase = false,
}: {
  product: Product;
  eager?: boolean;
  showcase?: boolean;
}) {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  const url = absoluteUrl(`/san-pham/${product.slug}`);
  const message = buildProductConsultationMessage(product, url);

  // Calculate a visual demo discount tag if isFeatured or isNew
  const discountPercent = product.isFeatured ? 25 : product.isNew ? 15 : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#eaf0ec] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-main-green/30 hover:shadow-[0_16px_36px_rgba(31,74,58,0.09)]">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#faf8f5] p-5">
        {/* Sale / New Badge */}
        {discountPercent ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-price-orange px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
            -{discountPercent}%
          </span>
        ) : product.isNew ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-main-green px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
            MỚI
          </span>
        ) : null}

        {/* Hover Action Buttons Toolbar */}
        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
          <Link
            href={`/san-pham/${product.slug}`}
            className="flex size-9 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-transform hover:scale-110 hover:bg-main-green hover:text-white"
            title="Xem chi tiết"
          >
            <Eye className="size-4" />
          </Link>
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noreferrer"
            className="flex size-9 items-center justify-center rounded-full bg-white text-price-orange shadow-md transition-transform hover:scale-110 hover:bg-price-orange hover:text-white"
            title="Tư vấn nhanh Zalo"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>

        {/* Product Image */}
        <Link href={`/san-pham/${product.slug}`} className="relative block size-full">
          <Image
            src={product.images[0]?.src ?? "/images/demo/article-care.jpg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Animal or Category Tags */}
        <div className="flex flex-wrap items-center gap-1">
          {product.animals.slice(0, 2).map((animal) => (
            <span
              key={animal.id}
              className="rounded-md bg-[#faf3ea] px-2 py-0.5 text-[10px] font-semibold text-main-green"
            >
              {animal.name}
            </span>
          ))}
          <span className="ms-auto truncate text-[10px] text-muted-foreground">
            {product.brand.name}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-main-green">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* 5-Star Rating Row */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <div className="flex items-center text-[#f59e0b]">
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
          </div>
          <span className="text-[10px] font-medium">(5.0)</span>
        </div>

        {/* Packaging / Specs */}
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          Quy cách: {product.packaging}
        </p>

        {/* Price & Action Button Row */}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#f0e6da]/60 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Giá tham khảo:</span>
            <div className="flex items-baseline gap-1.5 font-bold text-price-orange">
              <ProductPrice product={product} compact />
            </div>
          </div>

          <Link
            href={`/san-pham/${product.slug}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4f3ef] text-main-green transition-all duration-200 hover:bg-main-green hover:text-white"
            title="Xem thông tin chi tiết"
          >
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
