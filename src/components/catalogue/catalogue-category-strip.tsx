import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/catalogue";

type CategorySummary = {
  category: Category;
  productCount: number;
  image: string;
  imageAlt: string;
};

export function CatalogueCategoryStrip({ categories }: { categories: CategorySummary[] }) {
  if (!categories.length) return null;

  return (
    <section className="mt-8" aria-labelledby="catalogue-categories-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="paper-eyebrow">Tìm nhanh theo nhóm</p>
          <h2 id="catalogue-categories-title" className="paper-heading mt-2 text-2xl md:text-3xl">Danh mục sản phẩm</h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">Kéo ngang để xem thêm</p>
      </div>

      <div className="mt-4 grid snap-x snap-mandatory auto-cols-[235px] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-3 sm:auto-cols-[260px] [scrollbar-color:#75c7e3_transparent] [scrollbar-width:thin]" aria-label="Các danh mục sản phẩm">
        {categories.map(({ category, productCount, image, imageAlt }) => (
          <Link key={category.id} href={`/danh-muc/${category.slug}`} className="paper-panel group grid min-h-24 snap-start grid-cols-[76px_minmax(0,1fr)] items-center gap-3 p-3 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-petshop-teal motion-reduce:transform-none">
            <span className="relative size-[76px] overflow-hidden rounded-lg bg-soft-blue">
              <Image src={image} alt={imageAlt} fill sizes="76px" className="object-contain p-2.5 transition-transform group-hover:scale-105 motion-reduce:transition-none" />
            </span>
            <span className="min-w-0">
              <strong className="line-clamp-2 block text-sm leading-5 text-foreground group-hover:text-primary">{category.name}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{productCount} sản phẩm</span>
              <span className="mt-2 flex items-center gap-1 text-xs font-bold text-[#257493]">Xem nhóm <ArrowRight className="size-3.5" aria-hidden="true" /></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
