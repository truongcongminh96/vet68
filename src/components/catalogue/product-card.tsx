import Image from "next/image";
import Link from "next/link";
import { Eye, ShieldAlert } from "lucide-react";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card subtle-shadow">
      <Link href={`/san-pham/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill loading={eager ? "eager" : "lazy"} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.025]" />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2"><p className="me-auto text-xs font-semibold text-muted-foreground">{product.brand.name}</p>{product.isNew ? <Badge className="bg-primary text-primary-foreground">Mới</Badge> : null}{demoMode ? <Badge variant="secondary">Demo</Badge> : null}</div>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 sm:text-lg">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-primary">{product.name}</Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">Mã: {product.sku} | {product.packaging}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.animals.slice(0, 2).map((animal) => <Badge key={animal.id} variant="outline">{animal.name}</Badge>)}
          {product.requiresConsultation ? <Badge variant="outline" className="border-medical-red/40 text-medical-red"><ShieldAlert aria-hidden="true" /> Cần tư vấn</Badge> : null}
        </div>
        <div className="mt-4"><ProductPrice product={product} compact /></div>
        <div className="mt-auto grid grid-cols-1 gap-2 pt-4">
          <Button variant="outline" asChild><Link href={`/san-pham/${product.slug}`}><Eye aria-hidden="true" /> Chi tiết</Link></Button>
          <ZaloConsultationButton zaloUrl={contact.zaloUrl} message={message} />
        </div>
      </div>
    </article>
  );
}
