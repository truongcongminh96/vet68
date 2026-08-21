import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/catalogue/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalogue";

export function FeaturedCollections({
  newProducts,
  featuredProducts,
}: {
  newProducts: Product[];
  featuredProducts: Product[];
}) {
  return (
    <section aria-label="Sản phẩm mới về và nổi bật" className="py-8 lg:py-14">
      <div className="site-container">
        {/* Top Split Header: Title Info (Left) + Promo Banner (Right) */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Header Column */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-price-orange">
              <Sparkles className="size-3.5" /> Dược phẩm & Chăm sóc 2026
            </span>
            <h2 className="mt-2 font-playfair text-3xl font-bold tracking-tight text-main-green sm:text-4xl">
              Sản Phẩm <span className="italic font-normal text-price-orange">Mới Về</span>
            </h2>
            <div className="my-3 flex items-center gap-2">
              <div className="h-0.5 w-12 bg-price-orange/60" />
              <div className="size-1.5 rotate-45 bg-price-orange" />
              <div className="h-0.5 w-20 bg-main-green/30" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Những dòng thuốc thú y thế hệ mới, dinh dưỡng tăng trọng và sinh phẩm phòng dịch tối ưu, giúp nâng cao năng suất và chất lượng sống cho vật nuôi mỗi ngày.
            </p>
            <div className="mt-6">
              <Button
                asChild
                className="rounded-xl bg-main-green px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#163b2e]"
              >
                <Link href="/san-pham" className="flex items-center gap-2">
                  <span>Xem tất cả sản phẩm</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Showcase Banner */}
          <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-[#eaf0ec] bg-[#faf3ea] p-6 shadow-sm sm:min-h-[260px] lg:col-span-7">
            <Image
              src="/images/home/promotion-vet-cat-consultation.png"
              alt="Sản phẩm thú y mới về"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[75%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/90 via-[#faf8f5]/60 to-transparent" />
            <div className="relative z-10 flex h-full max-w-xs flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-price-orange">
                Ưu đãi bác sĩ khuyên dùng
              </span>
              <p className="mt-1 font-playfair text-xl font-bold text-main-green sm:text-2xl">
                Tư Vấn Đúng Thuốc, <br />
                Đúng Liều & Tiết Kiệm
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Đội ngũ chuyên môn Vet68 hỗ trợ kê phác đồ miễn phí qua Zalo.
              </p>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Secondary Featured Collection Strip */}
        <div className="mt-16 rounded-3xl bg-[#faf3ea]/70 p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-main-green">
                Được phòng khám tin dùng
              </span>
              <h3 className="font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl">
                Sản Phẩm <span className="italic font-normal text-price-orange">Nổi Bật Nhất</span>
              </h3>
            </div>
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-price-orange hover:text-price-orange-dark"
            >
              <span>Xem thêm danh mục nổi bật</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
