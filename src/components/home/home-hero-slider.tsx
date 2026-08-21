"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    titleLine1: "Khỏe mạnh an tâm",
    titleLine2: "Vững vàng sinh kế",
    description:
      "Vet68 đồng hành cùng bạn trên hành trình chăm sóc và bảo vệ sức khoẻ đàn vật nuôi & thú cưng. Cung cấp thuốc thú y, vaccine và dinh dưỡng đạt chuẩn GMP-WHO.",
    primaryCta: { label: "Xem sản phẩm ngay", href: "/san-pham" },
    secondaryCta: { label: "Khám phá thêm", href: "/gioi-thieu" },
    image: "/images/home/hero-vet68-full-bleed.png",
  },
  {
    id: 2,
    titleLine1: "Chăm sóc toàn diện",
    titleLine2: "Hiệu quả & Minh bạch",
    description:
      "Catalogue tra cứu đầy đủ thành phần, chỉ định, công ty phân phối và quy cách đóng gói. Hỗ trợ xuất hoá đơn VAT và xác nhận giá nhanh qua Zalo.",
    primaryCta: { label: "Xem sản phẩm ngay", href: "/san-pham" },
    secondaryCta: { label: "Khám phá thêm", href: "/lien-he" },
    image: "/images/home/about-vet68-full-bleed.png",
  },
];

export function HomeHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
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
    <section aria-label="Banner nổi bật" className="relative w-full overflow-hidden bg-[#faf8f5]">
      {/* Full-bleed Hero Canvas */}
      <div className="relative min-h-[500px] w-full sm:min-h-[580px] lg:min-h-[640px]">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src={slide.image}
            alt={`${slide.titleLine1} ${slide.titleLine2}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_center] transition-all duration-700 md:object-[68%_center]"
          />
          {/* Natural Warm Cream Gradient Overlay (Wolf Yoga Style) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/90 to-transparent lg:via-[#faf8f5]/80" />
        </div>

        {/* Slide Content Container */}
        <div className="site-container relative z-10 flex min-h-[500px] items-center sm:min-h-[580px] lg:min-h-[640px] pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Main Serif Heading (Wolf Yoga Style) */}
            <h1 className="font-playfair text-4xl font-bold leading-[1.12] tracking-tight text-main-green sm:text-5xl lg:text-[58px]">
              <span className="block">{slide.titleLine1}</span>
              <span className="block">{slide.titleLine2}</span>
            </h1>

            {/* Symmetrical Ornament Divider (Wolf Yoga Style) */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px w-14 bg-[#d37643]/70" />
              <div className="flex items-center gap-1 text-[#d37643]">
                <span className="text-xs">✦</span>
                <span className="text-base font-bold">❖</span>
                <span className="text-xs">✦</span>
              </div>
              <div className="h-px w-24 bg-main-green/30" />
            </div>

            {/* Subtitle Description */}
            <p className="max-w-lg text-xs leading-relaxed text-[#33302f]/85 sm:text-sm md:text-[15px] md:leading-7">
              {slide.description}
            </p>

            {/* Action Buttons Group */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href={slide.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-main-green px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#163b2e] hover:shadow-md"
              >
                <span>{slide.primaryCta.label}</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg border border-[#e2cbb8] bg-[#f7ebde] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#33302f] transition-all hover:bg-[#f0decb]"
              >
                <span>{slide.secondaryCta.label}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Next Slide Button on Middle Right (Wolf Yoga Style) */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide tiếp theo"
          className="absolute right-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-main-green shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-xs transition-all hover:scale-110 hover:bg-main-green hover:text-white sm:flex sm:right-6 lg:right-10"
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Floating Prev Slide Button on Middle Left */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide trước"
          className="absolute left-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-main-green shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-xs transition-all hover:scale-110 hover:bg-main-green hover:text-white sm:flex sm:left-6 lg:left-10"
        >
          <ChevronLeft className="size-6" />
        </button>

        {/* Indicator Dots at Bottom Left */}
        <div className="absolute bottom-16 left-4 z-20 flex items-center gap-2 sm:bottom-20 sm:left-10 lg:left-16">
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
    </section>
  );
}
