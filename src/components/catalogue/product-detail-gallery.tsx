"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Heart, Share2, Sparkles } from "lucide-react";

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
  const activeImage = images[selectedIndex] ?? images[0] ?? {
    src: "/images/demo/article-care.jpg",
    alt: productName,
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#eaf0ec] bg-white p-6 shadow-[0_12px_35px_rgba(31,74,58,0.06)]">
        {/* Badges */}
        {isFeatured ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-price-orange px-3 py-1 text-xs font-bold text-white shadow-xs">
            NỔI BẬT
          </span>
        ) : isNew ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-main-green px-3 py-1 text-xs font-bold text-white shadow-xs">
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

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 small-scrollbar">
          {images.map((image, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={image.src + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative size-18 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all ${
                  isSelected
                    ? "border-main-green shadow-xs scale-105"
                    : "border-[#eaf0ec] opacity-75 hover:opacity-100"
                }`}
                title={`Xem ảnh ${idx + 1}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
