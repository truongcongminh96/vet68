import Link from "next/link";
import { ArrowRight, Flame, Percent, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/catalogue/product-card";
import type { Product } from "@/types/catalogue";

export function CatalogueDealStrip({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section aria-label="Deal tốt hôm nay" className="my-6">
      <div className="rounded-3xl border border-[#f7ebde] bg-[#faf9f2] p-5 shadow-[0_10px_30px_rgba(31,74,58,0.05)] lg:p-7">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left Promo Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-main-green to-[#163b2e] p-6 text-white shadow-md lg:col-span-3 lg:min-h-[340px]">
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-price-orange backdrop-blur-xs">
                <Percent className="size-7 text-white" />
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-price-orange px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <Flame className="size-3.5" /> Ưu Đãi Giới Hạn
              </span>
              <h2 className="mt-3 font-playfair text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                Deal Tốt<br className="hidden sm:inline" /> Hôm Nay
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Săn ngay các sản phẩm dược phẩm & dinh dưỡng thú y với mức giá ưu đãi tốt nhất.
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/khuyen-mai"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-main-green shadow-xs transition-all hover:bg-price-orange hover:text-white"
              >
                <span>Xem tất cả Deal</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Products Scroll / Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:col-span-9 lg:grid-cols-3 lg:gap-4 xl:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} eager />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
