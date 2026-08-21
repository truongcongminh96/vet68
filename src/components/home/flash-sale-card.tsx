import Image from "next/image";
import Link from "next/link";
import { Layers, Star } from "lucide-react";
import { formatCurrency } from "@/lib/price";
import type { Product } from "@/types/catalogue";

export function FlashSaleCard({ product }: { product: Product }) {
  const discountPercent = product.isFeatured ? 28 : product.isNew ? 25 : 20;

  // Derive mock original price from reference price if available
  const hasRefPrice =
    product.priceDisplayMode !== "contact" &&
    product.referencePrice !== null &&
    product.referencePrice > 0;

  const originalPrice = hasRefPrice
    ? Math.round((product.referencePrice! * 1.35) / 1000) * 1000
    : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(31,74,58,0.08)]">
      {/* Discount Badge on Top Left (Wolf Yoga Style) */}
      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#d37643] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
        - {discountPercent}%
      </span>

      {/* Product Image Container */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#faf8f5] p-3 transition-colors group-hover:bg-[#f5f1eb]"
      >
        <Image
          src={product.images[0]?.src ?? "/images/demo/article-care.jpg"}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Product Title */}
        <h3 className="line-clamp-2 min-h-10 text-xs font-semibold leading-snug text-[#20212b] transition-colors group-hover:text-main-green sm:text-[13px]">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* 5-Star Rating Row */}
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#5e6973]">
          <span className="font-semibold text-main-green">5.0</span>
          <Star className="size-3 fill-[#f59e0b] text-[#f59e0b]" />
          <span className="text-[10px] text-muted-foreground">(5 Đánh giá)</span>
        </div>

        {/* Bottom Price & Action Button Row */}
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-3">
          <div className="flex flex-wrap items-baseline gap-1">
            {hasRefPrice ? (
              <>
                <span className="text-xs font-bold text-price-orange sm:text-sm">
                  {formatCurrency(product.referencePrice!)}
                </span>
                {originalPrice ? (
                  <span className="text-[10px] text-muted-foreground line-through sm:text-[11px]">
                    {formatCurrency(originalPrice)}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-xs font-bold text-price-orange sm:text-[13px]">
                Liên hệ báo giá
              </span>
            )}
          </div>

          {/* Quick Details / Options Icon Button */}
          <Link
            href={`/san-pham/${product.slug}`}
            className="flex size-7.5 shrink-0 items-center justify-center rounded-full border border-main-green/20 bg-white text-main-green transition-all duration-200 hover:bg-main-green hover:text-white"
            title="Xem chi tiết & tuỳ chọn"
          >
            <Layers className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
