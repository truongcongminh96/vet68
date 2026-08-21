"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    tag: "Chăm Sóc Toàn Diện",
    titlePrimary: "Khỏe Mạnh An Yên",
    titleSecondary: "Vững Vàng Từng Bé Cưng",
    description:
      "Vet68 đồng hành cùng bạn trên hành trình chăm sóc sức khoẻ vật nuôi & thú cưng. Cung cấp thuốc thú y, vaccine và dinh dưỡng đạt chuẩn GMP-WHO.",
    primaryCta: { label: "Xem sản phẩm ngay", href: "/san-pham" },
    secondaryCta: { label: "Tra cứu theo nhóm", href: "/danh-muc" },
    image: "/images/home/hero-vet68-full-bleed.png",
    fallbackBg: "from-[#1f4a3a] to-[#0a5d4f]",
  },
  {
    id: 2,
    tag: "Dược Phẩm Uy Tín",
    titlePrimary: "Giải Pháp Phòng Trị Bệnh",
    titleSecondary: "Hiệu Quả & Minh Bạch",
    description:
      "Catalogue tra cứu đầy đủ thành phần, chỉ định, công ty phân phối và quy cách đóng gói. Hỗ trợ xuất hoá đơn VAT và xác nhận giá nhanh qua Zalo.",
    primaryCta: { label: "Khám phá danh mục", href: "/san-pham" },
    secondaryCta: { label: "Tư vấn chuyên môn", href: "/lien-he" },
    image: "/images/home/about-vet68-full-bleed.png",
    fallbackBg: "from-[#163b2e] to-[#1f4a3a]",
  },
];

export function HomeHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section aria-label="Banner nổi bật" className="relative overflow-hidden bg-[#f7ebde]/50 py-4 lg:py-8">
      <div className="site-container">
        <div className="relative min-h-[480px] overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_16px_45px_rgba(31,74,58,0.08)] sm:min-h-[540px] lg:min-h-[580px]">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.image}
              alt={slide.titlePrimary}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_center] transition-all duration-700 md:object-[65%_center]"
            />
            {/* Soft Warm Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/90 to-transparent lg:via-[#faf8f5]/80" />
          </div>

          {/* Slide Text Content */}
          <div className="relative z-10 flex min-h-[480px] max-w-2xl flex-col justify-center p-6 sm:min-h-[540px] sm:p-10 lg:min-h-[580px] lg:p-14">
            {/* Tag Badge */}
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-main-green/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-main-green">
              <Sparkles className="size-3.5 text-price-orange" />
              <span>{slide.tag}</span>
            </div>

            {/* Main Serif Heading (Wolf Yoga Style) */}
            <h1 className="font-playfair text-3xl font-bold leading-tight tracking-tight text-main-green sm:text-4xl lg:text-5xl">
              <span>{slide.titlePrimary}</span>
              <br />
              <span className="italic text-price-orange font-normal">{slide.titleSecondary}</span>
            </h1>

            {/* Split Ornament Divider */}
            <div className="my-4 flex items-center gap-2">
              <div className="h-0.5 w-12 bg-price-orange/60" />
              <div className="size-1.5 rotate-45 bg-price-orange" />
              <div className="h-0.5 w-24 bg-main-green/30" />
            </div>

            {/* Subtitle Description */}
            <p className="max-w-xl text-sm leading-relaxed text-[#33302f]/80 sm:text-base">
              {slide.description}
            </p>

            {/* Action Buttons Group */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-main-green px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(31,74,58,0.25)] transition-all hover:bg-[#163b2e] hover:scale-105"
              >
                <Link href={slide.primaryCta.href} className="flex items-center gap-2">
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl border-[#1f4a3a]/30 bg-white/80 px-5 text-sm font-bold text-main-green backdrop-blur-xs transition-all hover:bg-white hover:border-main-green"
              >
                <Link href={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>

          {/* Slider Arrows & Dots Controls */}
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide trước"
              className="flex size-9 items-center justify-center rounded-full bg-white/90 text-main-green shadow-md backdrop-blur-xs transition-transform hover:scale-110 hover:bg-main-green hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide tiếp theo"
              className="flex size-9 items-center justify-center rounded-full bg-white/90 text-main-green shadow-md backdrop-blur-xs transition-transform hover:scale-110 hover:bg-main-green hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-5 left-6 z-20 flex items-center gap-2 sm:bottom-8 sm:left-10 lg:left-14">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển tới slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-7 bg-main-green" : "w-2 bg-main-green/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
