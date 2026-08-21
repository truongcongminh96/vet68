"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Heart, Maximize2, Sparkles } from "lucide-react";

type ProductImage = {
  src: string;
  alt: string;
};

export function ProductDetailGallery({
  images,
  productName,
  isFeatured = false,
  isNew = false,
}: {
  images: ProductImage[];
  productName: string;
  isFeatured?: boolean;
  isNew?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayImages = images.length > 0 ? images : [
    { src: "/images/demo/article-care.jpg", alt: productName },
    { src: "/images/products/demo-antibiotic-sachet.svg", alt: productName },
    { src: "/images/products/demo-vitamin-bottle.svg", alt: productName },
    { src: "/images/products/demo-disinfectant.svg", alt: productName },
  ];

  const activeImage = displayImages[selectedIndex] ?? displayImages[0];

  const scrollUp = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const scrollDown = () => {
    setSelectedIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:gap-4">
      {/* 1. Left Vertical Thumbnails Strip (Wolf Yoga Style) */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:flex-col sm:overflow-visible shrink-0">
        {displayImages.length > 3 && (
          <button
            type="button"
            onClick={scrollUp}
            aria-label="Ảnh trước"
            className="hidden size-7 items-center justify-center rounded-full bg-white text-muted-foreground shadow-2xs hover:bg-main-green hover:text-white sm:flex"
          >
            <ChevronUp className="size-4" />
          </button>
        )}

        <div className="flex gap-2 sm:flex-col">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.src + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#faf8f5] p-1.5 transition-all sm:size-18 ${
                  isSelected
                    ? "border-main-green shadow-xs scale-102"
                    : "border-[#eaf0ec] opacity-70 hover:opacity-100"
                }`}
                title={`Xem ảnh ${idx + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>

        {displayImages.length > 3 && (
          <button
            type="button"
            onClick={scrollDown}
            aria-label="Ảnh tiếp theo"
            className="hidden size-7 items-center justify-center rounded-full bg-white text-muted-foreground shadow-2xs hover:bg-main-green hover:text-white sm:flex"
          >
            <ChevronDown className="size-4" />
          </button>
        )}
      </div>

      {/* 2. Main Product Image (Portrait 3/4 Frame with Floating Controls) */}
      <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden rounded-2xl border border-[#eaf0ec] bg-[#faf8f5] p-4 sm:rounded-3xl sm:p-6 shadow-[0_8px_30px_rgba(31,74,58,0.04)]">
        {/* Floating Action Buttons on Top Right (Wishlist & Zoom) */}
        <div className="absolute right-3.5 top-3.5 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Yêu thích sản phẩm"
            className={`flex size-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-xs transition-all hover:scale-110 ${
              isWishlisted ? "text-red-500" : "text-[#20212b] hover:text-red-500"
            }`}
          >
            <Heart className={`size-5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            aria-label="Phóng to ảnh"
            className="flex size-10 items-center justify-center rounded-full bg-white/95 text-[#20212b] shadow-sm backdrop-blur-xs transition-all hover:scale-110 hover:bg-main-green hover:text-white"
          >
            <Maximize2 className="size-4.5" />
          </button>
        </div>

        {/* Badges */}
        {isFeatured ? (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-[#d37643] px-3 py-1 text-xs font-bold text-white shadow-xs">
            NỔI BẬT
          </span>
        ) : isNew ? (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-main-green px-3 py-1 text-xs font-bold text-white shadow-xs">
            MỚI
          </span>
        ) : null}

        {/* Main Image */}
        <div className="relative size-full">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-4 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}
