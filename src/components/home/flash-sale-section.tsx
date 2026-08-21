import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { ProductCard } from "@/components/catalogue/product-card";
import { FlashSaleCountdown } from "@/components/home/flash-sale-countdown";
import type { Product } from "@/types/catalogue";

export function FlashSaleSection({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section aria-label="Deal chớp nhoáng" className="py-6 lg:py-10">
      <div className="site-container">
        <div className="rounded-3xl border border-[#f7ebde] bg-[#faf9f2] p-5 shadow-[0_12px_35px_rgba(31,74,58,0.06)] lg:p-8">
          {/* Header Row: Flash Sale Title + Live Countdown Timer */}
          <div className="flex flex-col gap-5 border-b border-[#f0e6da] pb-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Title & Badge */}
            <div className="flex items-center gap-3.5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-price-orange text-white shadow-[0_6px_18px_rgba(237,101,20,0.35)]">
                <Flame className="size-8 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-playfair text-2xl font-bold uppercase tracking-tight text-main-green sm:text-3xl">
                    Flash Sale
                  </h2>
                  <span className="rounded-full bg-price-orange/15 px-2.5 py-0.5 text-[11px] font-bold text-price-orange">
                    Giảm tới 30%
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#33302f]/70">
                  Ưu đãi chớp nhoáng - <span className="text-price-orange font-bold">Số lượng có hạn</span>
                </p>
              </div>
            </div>

            {/* Client Countdown Box */}
            <FlashSaleCountdown />
          </div>

          {/* Product Cards Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} eager />
            ))}
          </div>

          {/* Bottom View All Link */}
          <div className="mt-7 text-center">
            <Link
              href="/khuyen-mai"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-main-green shadow-sm transition-all hover:bg-main-green hover:text-white"
            >
              <span>Xem tất cả ưu đãi Flash Sale</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
