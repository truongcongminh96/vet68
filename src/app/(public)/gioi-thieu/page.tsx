import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  HeartHandshake,
  HeartPulse,
  Leaf,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSitemapProducts } from "@/lib/catalogue/queries";

export const metadata: Metadata = {
  title: "Giới Thiệu - Vet Medicine 68",
  description: "Tìm hiểu về câu chuyện thương hiệu, sứ mệnh, giá trị cốt lõi và đội ngũ chuyên môn thú y tại Vet Medicine 68.",
  alternates: { canonical: "/gioi-thieu" },
};

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Chất lượng chuẩn mực",
    description: "Sản phẩm được chọn lọc kỹ lưỡng từ các nhà máy GMP-WHO, kiểm định nghiêm ngặt, an toàn và hiệu quả cao.",
    iconColor: "text-main-green",
  },
  {
    icon: HeartPulse,
    title: "Tư vấn chuyên sâu",
    description: "Đội ngũ bác sĩ thú y tận tâm hướng dẫn phác đồ điều trị, liều dùng chính xác và giải pháp phòng bệnh tối ưu.",
    iconColor: "text-price-orange",
  },
  {
    icon: FileCheck2,
    title: "Minh bạch & Tin cậy",
    description: "Thông tin thành phần, quy cách và giá tham khảo rõ ràng, xuất hoá đơn VAT đầy đủ cho phòng khám và trang trại.",
    iconColor: "text-main-green",
  },
  {
    icon: Leaf,
    title: "Phát triển bền vững",
    description: "Hướng đến chăn nuôi an toàn sinh học, giảm thiểu kháng thuốc và nâng cao phúc lợi động vật trong cộng đồng.",
    iconColor: "text-price-orange",
  },
];

const missionList = [
  "Chủ động kiểm soát và ngăn ngừa dịch bệnh hiệu quả cho thú cưng & đàn vật nuôi.",
  "Tối ưu chi phí điều trị với phác đồ chuẩn xác và nguồn dược phẩm chất lượng cao.",
  "Đồng hành hỗ trợ kỹ thuật chuyên môn 24/7 qua kênh tư vấn Zalo & Hotline.",
];

export default async function AboutPage() {
  const products = await getSitemapProducts();
  const productCount = products.length > 0 ? products.length : 500;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. Breadcrumb Bar (Wolf Yoga Style) */}
      <div className="border-b border-[#eaf0ec] bg-white py-3">
        <div className="site-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="font-medium hover:text-main-green">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-bold text-main-green" aria-current="page">
              Giới thiệu
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Top Hero Banner (wolf-about-top-slider style) */}
      <section aria-label="Giới thiệu chung" className="py-6 lg:py-10">
        <div className="site-container">
          <div className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/80 bg-white p-7 shadow-[0_16px_45px_rgba(31,74,58,0.07)] sm:min-h-[500px] sm:p-10 lg:min-h-[540px] lg:p-14">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/home/about-vet68-full-bleed.png"
                alt="Đội ngũ bác sĩ thú y Vet68"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[75%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/90 to-transparent lg:via-[#faf8f5]/80" />
            </div>

            {/* Left Content Card */}
            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-main-green/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-main-green w-fit">
                <Sparkles className="size-3.5 text-price-orange" /> Về Vet Medicine 68
              </span>

              <h1 className="mt-3 font-playfair text-3xl font-bold uppercase tracking-tight text-main-green sm:text-4xl lg:text-5xl">
                Vet Medicine 68
              </h1>

              <div className="mt-1 text-lg font-semibold uppercase tracking-wider text-price-orange sm:text-xl">
                Chăm Sóc Toàn Diện - Đồng Hành Tận Tâm
              </div>

              <div className="my-3.5 flex items-center gap-2">
                <div className="h-0.5 w-12 bg-price-orange/60" />
                <div className="size-1.5 rotate-45 bg-price-orange" />
                <div className="h-0.5 w-20 bg-main-green/30" />
              </div>

              <p className="max-w-lg text-xs leading-relaxed text-[#33302f]/85 sm:text-sm">
                Chúng tôi tin rằng sức khoẻ và phúc lợi của vật nuôi là nền tảng của niềm vui gia đình và nền chăn nuôi vững mạnh. Vet68 ra đời với sứ mệnh cung cấp các giải pháp dược phẩm, vaccine và dinh dưỡng thú y đạt chuẩn GMP-WHO, minh bạch và tận tâm.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="rounded-xl bg-main-green px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#163b2e]"
                >
                  <Link href="/san-pham" className="flex items-center gap-2">
                    <span>Khám phá catalogue</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-main-green/30 bg-white/80 px-5 text-xs font-bold uppercase tracking-wider text-main-green hover:bg-white"
                >
                  <Link href="/lien-he">Liên hệ tư vấn</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brand Story & Statistics (wolf-about-story style) */}
      <section aria-label="Câu chuyện thương hiệu" className="py-8 lg:py-14">
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Story Photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#eaf0ec] shadow-[0_12px_35px_rgba(31,74,58,0.06)] lg:col-span-5">
              <Image
                src="/images/home/brand-story-vet-team.png"
                alt="Đội ngũ thú y Vet68"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            {/* Story Content & 3 Stat Boxes */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-price-orange">
                Hành trình phát triển
              </span>
              <h2 className="mt-2 font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl lg:text-4xl">
                Câu Chuyện Thương Hiệu
              </h2>
              <div className="my-3 flex items-center gap-2">
                <div className="h-0.5 w-12 bg-price-orange/60" />
                <div className="size-1.5 rotate-45 bg-price-orange" />
                <div className="h-0.5 w-20 bg-main-green/30" />
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                <p>
                  Vet Medicine 68 được thành lập từ tình yêu thương động vật và tâm huyết mang đến nguồn dược phẩm thú y chất lượng cao, đúng phác đồ và giá thành hợp lý cho cộng đồng người nuôi và các trang trại chăn nuôi.
                </p>
                <p>
                  Từ những ngày đầu thành lập, chúng tôi luôn đặt tiêu chuẩn chọn lọc sản phẩm lên hàng đầu: chỉ phân phối các mặt hàng có nguồn gốc rõ ràng, đạt chuẩn GMP-WHO từ các công ty uy tín trong và ngoài nước, kèm quy trình bảo quản nhiệt độ nghiêm ngặt.
                </p>
              </div>

              {/* 3 Statistic Counters */}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-[#eaf0ec] bg-white p-4 text-center shadow-xs sm:gap-4 sm:p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#faf3ea] text-main-green sm:size-12">
                    <Calendar className="size-5 sm:size-6 text-main-green" />
                  </div>
                  <span className="mt-2 text-base font-bold text-main-green sm:text-xl">2026</span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">Năm thành lập</span>
                </div>

                <div className="flex flex-col items-center justify-center border-x border-[#f0e6da]">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#faf3ea] text-price-orange sm:size-12">
                    <UsersRound className="size-5 sm:size-6 text-price-orange" />
                  </div>
                  <span className="mt-2 text-base font-bold text-main-green sm:text-xl">10.000+</span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">Khách hàng tin tưởng</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#faf3ea] text-main-green sm:size-12">
                    <PackageCheck className="size-5 sm:size-6 text-main-green" />
                  </div>
                  <span className="mt-2 text-base font-bold text-main-green sm:text-xl">{productCount}+</span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">Sản phẩm đa dạng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Section (wolf-about-corevalues style) */}
      <section aria-label="Giá trị cốt lõi" className="py-8 lg:py-14 bg-[#faf3ea]/60">
        <div className="site-container">
          <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-price-orange">
              Tiêu chuẩn hành động
            </span>
            <h2 className="mt-2 font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl lg:text-4xl">
              Giá Trị Cốt Lõi
            </h2>
            <div className="mx-auto my-3 flex items-center justify-center gap-2">
              <div className="h-0.5 w-10 bg-price-orange/60" />
              <div className="size-1.5 rotate-45 bg-price-orange" />
              <div className="h-0.5 w-10 bg-main-green/30" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Bốn nguyên tắc nền tảng định hình chất lượng dịch vụ và uy tín thương hiệu của Vet Medicine 68.
            </p>
          </div>

          {/* 4 Core Value Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center rounded-3xl border border-[#eaf0ec] bg-white p-7 text-center shadow-[0_8px_25px_rgba(31,74,58,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_35px_rgba(31,74,58,0.09)]"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#faf8f5] shadow-xs">
                    <Icon className={`size-8 ${item.iconColor}`} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-main-green">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Mission Section (wolf-about-mission style) */}
      <section aria-label="Sứ mệnh thương hiệu" className="py-8 lg:py-14">
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Mission Content */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-price-orange">
                Mục tiêu của chúng tôi
              </span>
              <h2 className="mt-2 font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl lg:text-4xl">
                Sứ Mệnh Của Vet68
              </h2>
              <div className="my-3 flex items-center gap-2">
                <div className="h-0.5 w-12 bg-price-orange/60" />
                <div className="size-1.5 rotate-45 bg-price-orange" />
                <div className="h-0.5 w-20 bg-main-green/30" />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Vet Medicine 68 không chỉ là nơi cung cấp thuốc thú y và vật tư, mà còn là người bạn đồng hành tin cậy của các bác sĩ thú y, chủ phòng khám, trang trại và người nuôi thú cưng:
              </p>

              <ul className="mt-4 space-y-3 text-xs sm:text-sm">
                {missionList.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-price-orange" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Slogan Badge */}
              <div className="mt-6 rounded-2xl border border-[#eaf0ec] bg-white p-4 shadow-xs">
                <p className="font-playfair text-sm font-bold italic text-main-green sm:text-base">
                  &ldquo;Chăm sóc đúng sản phẩm, vững vàng cho từng bé cưng &ndash; Đồng hành cùng thịnh vượng nhà nông.&rdquo;
                </p>
              </div>

              <div className="mt-7">
                <Button
                  asChild
                  className="rounded-xl bg-price-orange px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-price-orange-dark"
                >
                  <Link href="/lien-he" className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    <span>Liên hệ trao đổi hợp tác</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Mission Photo */}
            <div className="order-1 relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#eaf0ec] shadow-[0_12px_35px_rgba(31,74,58,0.06)] lg:order-2 lg:col-span-5">
              <Image
                src="/images/home/consultation-vet-dog.png"
                alt="Sứ mệnh chăm sóc vật nuôi tại Vet68"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
