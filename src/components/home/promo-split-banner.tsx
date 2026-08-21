import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoSplitBanner() {
  return (
    <section aria-label="Bộ sưu tập chuyên biệt" className="py-6 lg:py-10">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Promo Card 1: Pet Care (Chó & Mèo) */}
          <div className="group relative min-h-[320px] overflow-hidden rounded-3xl border border-[#eaf0ec] bg-white p-7 shadow-[0_12px_35px_rgba(31,74,58,0.06)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(31,74,58,0.12)] sm:p-9">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/home/hero-vet-dog.png"
                alt="Chăm sóc chó mèo tại Vet68"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-[80%_center] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/90 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full max-w-xs flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-price-orange/15 px-3 py-1 text-[11px] font-bold text-price-orange uppercase tracking-wider">
                  <Sparkles className="size-3" /> Dành Cho Thú Cưng
                </span>
                <h3 className="mt-3 font-playfair text-2xl font-bold text-main-green sm:text-3xl">
                  Chăm Sóc Bé Cưng <br />
                  <span className="italic font-normal text-price-orange">Toàn Diện & Yêu Thương</span>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#33302f]/80">
                  Dược phẩm, dinh dưỡng cao cấp, kiểm soát ve rận & trị nấm an toàn chuyên biệt cho Chó & Mèo.
                </p>
              </div>

              <div className="mt-6">
                <Button
                  asChild
                  className="rounded-xl bg-main-green px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#163b2e]"
                >
                  <Link href="/vat-nuoi/cho-va-meo" className="flex items-center gap-2">
                    <span>Xem sản phẩm Chó & Mèo</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Promo Card 2: Livestock & Farm Care (Gia súc, Gia cầm) */}
          <div className="group relative min-h-[320px] overflow-hidden rounded-3xl border border-[#eaf0ec] bg-white p-7 shadow-[0_12px_35px_rgba(31,74,58,0.06)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(31,74,58,0.12)] sm:p-9">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/home/brand-story-vet-team.png"
                alt="Giải pháp trang trại gia súc gia cầm tại Vet68"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-[80%_center] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/90 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full max-w-xs flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-main-green/15 px-3 py-1 text-[11px] font-bold text-main-green uppercase tracking-wider">
                  <Sparkles className="size-3" /> Trang Trại & Đại Lý
                </span>
                <h3 className="mt-3 font-playfair text-2xl font-bold text-main-green sm:text-3xl">
                  Giải Pháp Chăn Nuôi <br />
                  <span className="italic font-normal text-price-orange">Năng Suất & Bền Vững</span>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#33302f]/80">
                  Kháng sinh phổ rộng, premix khoáng, men vi sinh & sát trùng chuồng trại đạt chuẩn quốc tế.
                </p>
              </div>

              <div className="mt-6">
                <Button
                  asChild
                  className="rounded-xl bg-price-orange px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-price-orange-dark"
                >
                  <Link href="/vat-nuoi/heo" className="flex items-center gap-2">
                    <span>Xem danh mục Trang Trại</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
