import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlashSaleCard } from "@/components/home/flash-sale-card";
import { FlashSaleCountdown } from "@/components/home/flash-sale-countdown";
import type { Product } from "@/types/catalogue";

export function FlashSaleSection({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section aria-label="Flash Sale Ưu đãi chớp nhoáng" className="py-6 lg:py-10">
      <div className="site-container">
        {/* Large Rounded Warm Cream Box (Wolf Yoga Style) */}
        <div className="rounded-3xl border border-[#ecd9c6] bg-[#f7ebde] p-5 shadow-[0_12px_40px_rgba(31,74,58,0.06)] sm:p-7 lg:p-9">
          {/* Header Row: Artistic Title Left + Countdown Box Right */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left: Artistic Icon + Flash Sale Title */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Artistic Brand Emblem (Wolf Yoga Style) */}
              <div className="relative size-16 shrink-0 sm:size-20">
                <Image
                  src="/brand/vet-medicine-68-mark.png"
                  alt="Vet68 Flash Sale"
                  fill
                  className="object-contain"
                />
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-bold uppercase tracking-tight text-main-green sm:text-3xl lg:text-[38px] leading-none">
                  FLASH SALE
                </h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#33302f] sm:text-sm">
                  ƯU ĐÃI CHỚP NHOÁNG - <span className="font-bold text-[#b84c1e]">SỐ LƯỢNG CÓ HẠN</span>
                </p>

                {/* Symmetrical Ornament Divider */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-px w-10 bg-[#d37643]/70" />
                  <div className="flex items-center gap-1 text-[#d37643]">
                    <span className="text-[9px]">✦</span>
                    <span className="text-xs font-bold">❖</span>
                    <span className="text-[9px]">✦</span>
                  </div>
                  <div className="h-px w-16 bg-main-green/30" />
                </div>
              </div>
            </div>

            {/* Right: Clean Countdown Box with Top Badge */}
            <div className="self-center md:self-auto">
              <FlashSaleCountdown />
            </div>
          </div>

          {/* Product Cards Grid: 5 items row on desktop */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
            {products.slice(0, 5).map((product) => (
              <FlashSaleCard key={product.id} product={product} />
            ))}
          </div>

          {/* Bottom Link to View All Deals */}
          <div className="mt-7 text-center">
            <Link
              href="/khuyen-mai"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-main-green shadow-xs transition-all hover:bg-main-green hover:text-white"
            >
              <span>Xem tất cả sản phẩm Flash Sale</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
