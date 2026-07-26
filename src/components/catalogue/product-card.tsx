import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductPrice } from "@/components/catalogue/product-price";
import { ZaloConsultationButton } from "@/components/contact/zalo-consultation-button";
import { buildProductConsultationMessage } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { absoluteUrl } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import type { Product } from "@/types/catalogue";

export async function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  const url = absoluteUrl(`/san-pham/${product.slug}`);
  const message = buildProductConsultationMessage(product, url);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action/70 hover:retail-card-shadow motion-reduce:transform-none">
      <Link href={`/san-pham/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#f4f8fa] p-4 sm:p-6">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill loading={eager ? "eager" : "lazy"} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-3 transition-transform duration-200 motion-reduce:transition-none group-hover:scale-[1.025]" />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.animals.slice(0, 2).map((animal) => <Badge key={animal.id} variant="secondary" className="bg-soft-blue text-primary">{animal.name}</Badge>)}
          {product.requiresConsultation ? <Badge variant="outline" className="border-action text-primary"><ShieldCheck aria-hidden="true" /> Cần tư vấn</Badge> : null}
          {product.isNew ? <Badge className="ms-auto bg-[#fff8d6] text-[#735e00]">Mới</Badge> : null}
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-foreground sm:text-lg">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-primary">{product.name}</Link>
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{product.brand.name} | {product.packaging}</p>
        {demoMode ? <p className="mt-1 text-[11px] font-medium text-muted-foreground">Hình và dữ liệu minh hoạ</p> : null}
        <div className="mt-4 border-t border-border/80 pt-4"><ProductPrice product={product} compact /></div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <Button className="action-button h-9 px-3" asChild><Link href={`/san-pham/${product.slug}`}>Xem chi tiết <ArrowRight aria-hidden="true" /></Link></Button>
          <ZaloConsultationButton zaloUrl={contact.zaloUrl} message={message} variant="link" label="Hỏi qua Zalo" className="h-auto px-0 font-semibold text-primary" />
        </div>
      </div>
    </article>
  );
}
