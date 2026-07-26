import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductPrice } from "@/components/catalogue/product-price";
import { RecentlyViewedProducts } from "@/components/catalogue/recently-viewed-products";
import { MobileProductContactBar } from "@/components/contact/mobile-product-contact-bar";
import { ZaloConsultationButton } from "@/components/contact/zalo-consultation-button";
import { getProductBySlug, getRecentlyViewableProducts, getRelatedProducts } from "@/lib/catalogue/queries";
import { buildProductConsultationMessage, getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { absoluteUrl, serializeJsonLd, SITE_NAME, SITE_URL } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = await getProductBySlug(slug); if (!product) return {}; return { title: product.name, description: product.shortDescription, alternates: { canonical: `/san-pham/${slug}` }, openGraph: { type: "website", title: product.name, description: product.shortDescription, images: [{ url: product.images[0].src, alt: product.images[0].alt }] } }; }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = await getProductBySlug(slug); if (!product) notFound();
  const [related, contact, recentlyViewable] = await Promise.all([getRelatedProducts(product), getContactSettings(), getRecentlyViewableProducts()]);
  const demoMode = !hasSupabaseEnv();
  const productUrl = absoluteUrl(`/san-pham/${product.slug}`);
  const message = buildProductConsultationMessage(product, productUrl);
  const productJsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, sku: product.sku, description: product.shortDescription, image: product.images.map((item) => absoluteUrl(item.src)), brand: { "@type": "Brand", name: product.brand.name } };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Sản phẩm", item: absoluteUrl("/san-pham") }, { "@type": "ListItem", position: 3, name: product.name, item: productUrl }] };
  return (
    <div className="site-container section-space pb-28 md:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/san-pham">Sản phẩm</Link><span>/</span><span aria-current="page">{product.name}</span></nav>
      <div className="grid gap-9 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
        <div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card"><Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" /></div>{product.images.length > 1 ? <div className="mt-3 grid grid-cols-4 gap-3">{product.images.slice(1).map((image) => <div key={image.src} className="relative aspect-square overflow-hidden rounded-lg border"><Image src={image.src} alt={image.alt} fill sizes="120px" className="object-cover" /></div>)}</div> : null}{demoMode ? <p className="mt-3 text-xs text-muted-foreground">Hình ảnh demo chỉ minh họa bố cục, không phải bao bì sản phẩm thật.</p> : null}</div>
        <div>
          <div className="flex flex-wrap gap-2">{demoMode ? <Badge variant="secondary">Dữ liệu demo</Badge> : null}{product.requiresConsultation ? <Badge className="bg-medical-red text-white"><ShieldAlert aria-hidden="true" /> Cần tư vấn</Badge> : null}</div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">{product.name}</h1>
          <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2"><p>Mã sản phẩm: <strong className="text-foreground">{product.sku}</strong></p><p>Thương hiệu: <Link href={`/thuong-hieu/${product.brand.slug}`} className="font-semibold text-primary hover:underline">{product.brand.name}</Link></p></div>
          <div className="mt-6 rounded-xl border bg-card p-5"><ProductPrice product={product} /><p className="mt-3 text-xs leading-5 text-muted-foreground">Giá hiển thị chỉ mang tính tham khảo và có thể thay đổi. Hãy liên hệ Vet68 để xác nhận giá hiện tại.</p></div>
          <dl className="mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-2"><div><dt className="text-xs font-bold text-muted-foreground">Quy cách</dt><dd className="mt-1 font-semibold">{product.packaging}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Đơn vị</dt><dd className="mt-1 font-semibold">{product.unit}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Dạng sản phẩm</dt><dd className="mt-1 font-semibold">{product.dosageForm}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Vật nuôi</dt><dd className="mt-1 font-semibold">{product.animals.map((item) => item.name).join(", ")}</dd></div></dl>
          <div className="mt-6 rounded-xl bg-secondary p-5"><p className="text-sm font-bold">Khi liên hệ, vui lòng ghi:</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{product.name} | {product.sku} | {product.packaging}</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><ZaloConsultationButton zaloUrl={contact.zaloUrl} message={message} size="lg" /><Button size="lg" variant="outline" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> Gọi Vet68</a></Button></div>
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
        <div className="space-y-8"><section><h2 className="text-2xl font-extrabold">Thông tin sản phẩm</h2><p className="mt-3 leading-7 text-muted-foreground">{product.description}</p></section><section><h2 className="text-2xl font-extrabold">Thành phần</h2><p className="mt-3 leading-7 text-muted-foreground">{product.activeIngredients}</p></section><section><h2 className="text-2xl font-extrabold">Thông tin chỉ định</h2><p className="mt-3 leading-7 text-muted-foreground">{product.indications}</p></section><section><h2 className="text-2xl font-extrabold">Thông tin sử dụng</h2><p className="mt-3 leading-7 text-muted-foreground">{product.usageInformation}</p></section></div>
        <aside className="h-fit rounded-xl border border-medical-red/30 bg-card p-6"><AlertTriangle className="size-7 text-medical-red" aria-hidden="true" /><h2 className="mt-4 text-xl font-extrabold">Lưu ý an toàn</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.safetyInformation}</p><p className="mt-4 text-sm font-semibold text-medical-red">Thông tin website không thay thế tư vấn của bác sĩ thú y hoặc hướng dẫn từ nhà sản xuất.</p><Button variant="outline" className="mt-5 w-full" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button></aside>
      </div>
      {related.length ? <section className="mt-14"><h2 className="text-3xl font-extrabold">Sản phẩm liên quan</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section> : null}
      <RecentlyViewedProducts currentSlug={product.slug} products={recentlyViewable} />
      <MobileProductContactBar phone={contact.phone} zaloUrl={contact.zaloUrl} message={message} />
    </div>
  );
}
