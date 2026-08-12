import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { ProductPrice } from "@/components/catalogue/product-price";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalogue";

export function CatalogueDealStrip({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#f2d7cf] bg-[#fff8f3] p-2.5 sm:p-4" aria-labelledby="catalogue-deals-title">
      <div className="grid grid-cols-[145px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-3 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="flex min-h-72 flex-col justify-between rounded-xl bg-primary p-4 text-white sm:min-h-80 sm:p-5 lg:p-6">
          <div>
            <span className="flex size-10 items-center justify-center rounded-full bg-white/12 text-action"><Sparkles className="size-5" aria-hidden="true" /></span>
            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-action sm:mt-5 sm:text-xs sm:tracking-[0.14em]">Sản phẩm nổi bật</p>
            <h2 id="catalogue-deals-title" className="mt-2 text-2xl font-bold leading-none tracking-[-0.04em] sm:text-3xl">Deal tốt<br />hôm nay</h2>
            <p className="mt-3 text-xs leading-5 text-white/72 sm:text-sm sm:leading-6">Liên hệ Vet68 để xác nhận giá, quy cách và tình trạng sản phẩm.</p>
          </div>
          <Button className="mt-5 h-auto w-full whitespace-normal bg-white px-3 py-2.5 text-primary hover:bg-white/90" asChild><Link href="/lien-he"><MessageCircle aria-hidden="true" /> Liên hệ đặt mua</Link></Button>
        </div>

        <div className="grid snap-x snap-mandatory auto-cols-[170px] grid-flow-col gap-2.5 overflow-x-auto overscroll-x-contain pb-2 sm:auto-cols-[210px] sm:gap-3 lg:auto-cols-[minmax(190px,1fr)] [scrollbar-color:#75c7e3_transparent] [scrollbar-width:thin]" aria-label="Danh sách deal tốt hôm nay">
          {products.map((product, index) => <DealProductCard key={product.id} product={product} eager={index < 3} />)}
        </div>
      </div>
    </section>
  );
}

function DealProductCard({ product, eager }: { product: Product; eager: boolean }) {
  return (
    <article className="group relative flex min-w-0 snap-start flex-col overflow-hidden rounded-xl border border-[#ecdcd5] bg-white">
      <span className="absolute left-3 top-3 z-10 rounded-md bg-[#c93434] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white retail-card-shadow">Sale Shock</span>
      <Link href={`/san-pham/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#f4f8fa]">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill loading={eager ? "eager" : "lazy"} sizes="220px" className="object-contain p-5 transition-transform duration-200 group-hover:scale-[1.035] motion-reduce:transition-none" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#257493]">{product.company.name}</p>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6"><Link href={`/san-pham/${product.slug}`} className="hover:text-primary">{product.name}</Link></h3>
        <div className="mt-auto pt-4"><ProductPrice product={product} compact /></div>
        <Link href={`/san-pham/${product.slug}`} className="mt-4 flex items-center gap-1 text-sm font-bold text-primary hover:text-[#257493]">Xem sản phẩm <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
