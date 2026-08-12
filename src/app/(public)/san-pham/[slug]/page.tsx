import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Archive, ClipboardList, MessageCircle, PackageCheck, Phone, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div><div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-[#f4f8fa]"><Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain p-5 md:p-8" /></div>{product.images.length > 1 ? <div className="mt-3 grid grid-cols-4 gap-3">{product.images.slice(1).map((image) => <div key={image.src} className="relative aspect-square overflow-hidden rounded-lg border bg-[#f4f8fa]"><Image src={image.src} alt={image.alt} fill sizes="120px" className="object-contain p-2" /></div>)}</div> : null}{demoMode ? <p className="mt-3 text-xs text-muted-foreground">Hình ảnh demo là minh hoạ bố cục, không phải bao bì sản phẩm đang kinh doanh.</p> : null}</div>
        <div>
          <div className="flex flex-wrap gap-2">{demoMode ? <Badge variant="secondary">Dữ liệu demo</Badge> : null}{product.requiresConsultation ? <Badge className="bg-medical-red text-white"><ShieldAlert aria-hidden="true" /> Cần tư vấn</Badge> : null}</div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">{product.name}</h1>
          <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2"><p>Mã sản phẩm: <strong className="text-foreground">{product.sku}</strong></p><p>Công ty phân phối: <Link href={`/cong-ty/${product.company.slug}`} className="font-semibold text-primary hover:underline">{product.company.name}</Link></p><p>Thương hiệu: <Link href={`/thuong-hieu/${product.brand.slug}`} className="font-semibold text-primary hover:underline">{product.brand.name}</Link></p></div>
          <div className="mt-6 rounded-xl border bg-card p-5"><ProductPrice product={product} /><p className="mt-3 text-xs leading-5 text-muted-foreground">Giá hiển thị chỉ mang tính tham khảo và có thể thay đổi. Hãy liên hệ Vet68 để xác nhận giá hiện tại.</p></div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProductSpecification label="Quy cách / dung tích / trọng lượng" value={product.packaging} />
            <ProductSpecification label="Đơn vị" value={product.unit} />
            <ProductSpecification label="Hàm lượng / thành phần" value={product.activeIngredients} />
            <ProductSpecification label="Dạng sản phẩm" value={product.dosageForm} />
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">{product.animals.map((animal) => <Badge key={animal.id} variant="secondary" className="bg-soft-blue text-primary">Dùng cho {animal.name}</Badge>)}</div>
          <div className="mt-6 rounded-xl bg-secondary p-5"><p className="text-sm font-bold">Khi liên hệ, vui lòng ghi:</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{product.name} | {product.sku} | {product.packaging}</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><ZaloConsultationButton zaloUrl={contact.zaloUrl} message={message} size="lg" /><Button size="lg" variant="outline" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> Gọi Vet68</a></Button></div>
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.34fr]">
        <Tabs defaultValue="information" className="min-w-0 rounded-2xl border border-border bg-white p-4 sm:p-6">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-secondary p-1.5 sm:grid-cols-3">
            <TabsTrigger value="information" className="min-h-11 px-3 py-2"><ClipboardList aria-hidden="true" /> Thông tin sản phẩm</TabsTrigger>
            <TabsTrigger value="usage" className="min-h-11 px-3 py-2"><PackageCheck aria-hidden="true" /> Hướng dẫn sử dụng</TabsTrigger>
            <TabsTrigger value="storage" className="min-h-11 px-3 py-2"><Archive aria-hidden="true" /> Hướng dẫn bảo quản</TabsTrigger>
          </TabsList>
          <TabsContent value="information" className="pt-6">
            <ProductContentSection title="Mô tả sản phẩm" content={product.description} />
            <ProductContentSection title="Thành phần / hàm lượng" content={product.activeIngredients} />
            <ProductContentSection title="Chỉ định" content={product.indications} />
          </TabsContent>
          <TabsContent value="usage" className="pt-6"><ProductContentSection title="Hướng dẫn sử dụng" content={product.usageInformation} /></TabsContent>
          <TabsContent value="storage" className="pt-6"><ProductContentSection title="Hướng dẫn bảo quản" content={product.storageInformation} /></TabsContent>
        </Tabs>
        <aside className="h-fit rounded-xl border border-medical-red/30 bg-card p-6"><AlertTriangle className="size-7 text-medical-red" aria-hidden="true" /><h2 className="mt-4 text-xl font-extrabold">Lưu ý an toàn</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.safetyInformation}</p><p className="mt-4 text-sm font-semibold text-medical-red">Thông tin website không thay thế tư vấn của bác sĩ thú y hoặc hướng dẫn từ nhà sản xuất.</p><Button variant="outline" className="mt-5 w-full" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button></aside>
      </div>
      {related.length ? <section className="mt-14"><h2 className="text-3xl font-extrabold">Sản phẩm liên quan</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section> : null}
      <RecentlyViewedProducts currentSlug={product.slug} products={recentlyViewable} />
      <MobileProductContactBar phone={contact.phone} zaloUrl={contact.zaloUrl} message={message} />
    </div>
  );
}

function ProductSpecification({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-white p-4"><dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#257493]">{label}</dt><dd className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-foreground">{value}</dd></div>;
}

function ProductContentSection({ title, content }: { title: string; content: string }) {
  return <section className="border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0"><h2 className="text-xl font-extrabold text-primary">{title}</h2><p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">{content}</p></section>;
}
