import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Gift,
  Heart,
  HelpCircle,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductDetailGallery } from "@/components/catalogue/product-detail-gallery";
import { ProductDetailVouchers } from "@/components/catalogue/product-detail-vouchers";
import { ProductPrice } from "@/components/catalogue/product-price";
import { RecentlyViewedProducts } from "@/components/catalogue/recently-viewed-products";
import { MobileProductContactBar } from "@/components/contact/mobile-product-contact-bar";
import { ZaloConsultationButton } from "@/components/contact/zalo-consultation-button";
import {
  getProductBySlug,
  getRecentlyViewableProducts,
  getRelatedProducts,
} from "@/lib/catalogue/queries";
import { buildProductConsultationMessage, getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { absoluteUrl, serializeJsonLd, SITE_NAME, SITE_URL } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} - Vet Medicine 68`,
    description: product.shortDescription || product.description.slice(0, 160),
    alternates: { canonical: `/san-pham/${slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0]?.src ?? "/images/demo/article-care.jpg", alt: product.images[0]?.alt ?? product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, contact, recentlyViewable] = await Promise.all([
    getRelatedProducts(product, 4),
    getContactSettings(),
    getRecentlyViewableProducts(12),
  ]);

  const demoMode = !hasSupabaseEnv();
  const productUrl = absoluteUrl(`/san-pham/${product.slug}`);
  const message = buildProductConsultationMessage(product, productUrl);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription || product.description,
    image: product.images.map((item) => absoluteUrl(item.src)),
    brand: { "@type": "Brand", name: product.brand.name },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: absoluteUrl("/san-pham") },
      { "@type": "ListItem", position: 3, name: product.category.name, item: absoluteUrl(`/danh-muc/${product.category.slug}`) },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      {/* 1. Breadcrumbs Bar (Wolf Yoga Style) */}
      <div className="border-b border-[#eaf0ec] bg-white py-3">
        <div className="site-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto small-scrollbar py-0.5">
            <Link href="/" className="font-medium hover:text-main-green shrink-0">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link href="/san-pham" className="font-medium hover:text-main-green shrink-0">
              Sản phẩm
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link
              href={`/danh-muc/${product.category.slug}`}
              className="font-medium hover:text-main-green shrink-0"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <span className="font-bold text-main-green truncate max-w-[220px] sm:max-w-none shrink-0" aria-current="page">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="site-container pt-6 lg:pt-9">
        {/* 2. Main Product Showcase (Wolf Layout - Gallery Left, Info Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <ProductDetailGallery
              images={product.images}
              productName={product.name}
              isFeatured={product.isFeatured}
              isNew={product.isNew}
            />

            {/* Trust Assurance Strip under Gallery */}
            <div className="mt-5 rounded-2xl border border-[#eaf0ec] bg-white p-4 text-xs text-muted-foreground shadow-2xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-main-green shrink-0" />
                  <span>Chuẩn GMP-WHO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-price-orange shrink-0" />
                  <span>Giao nhanh toàn quốc</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-main-green shrink-0" />
                  <span>Xuất hoá đơn VAT</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-4 text-price-orange shrink-0" />
                  <span>Bác sĩ tư vấn 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Information (7 cols) */}
          <div className="flex flex-col lg:col-span-7">
            {/* Title & Brand Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.requiresConsultation ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-700">
                    <ShieldAlert className="size-3.5" /> Thuốc kê đơn / Cần tư vấn
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="size-3.5" /> Có sẵn - Giao ngay
                  </span>
                )}
                {demoMode && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                    Dữ liệu demo
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-playfair text-2xl font-bold uppercase tracking-tight text-main-green sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              {/* Meta details row: SKU, Brand, Rating */}
              <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                <div>
                  Mã SKU: <strong className="font-semibold text-foreground">{product.sku}</strong>
                </div>
                <div className="h-3 w-px bg-border hidden sm:block" />
                <div>
                  Hãng:{" "}
                  <Link
                    href={`/cong-ty/${product.company.slug}`}
                    className="font-bold text-main-green hover:underline"
                  >
                    {product.company.name}
                  </Link>
                </div>
                <div className="h-3 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-[#f59e0b]">
                    <Star className="size-3.5 fill-current" />
                    <Star className="size-3.5 fill-current" />
                    <Star className="size-3.5 fill-current" />
                    <Star className="size-3.5 fill-current" />
                    <Star className="size-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-foreground">(5.0)</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-4 rounded-2xl border border-[#f0e6da] bg-white p-4 shadow-2xs sm:p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground">Giá tham khảo:</span>
                <div className="text-2xl font-bold text-price-orange sm:text-3xl">
                  <ProductPrice product={product} />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Giá trên chỉ mang tính tham khảo. Quý khách liên hệ trực tiếp với Vet68 để nhận chính sách chiết khấu tốt nhất theo số lượng.
              </p>
            </div>

            {/* Voucher Mini Cards (Wolf Yoga Coupon Block) */}
            <div className="mt-4">
              <ProductDetailVouchers />
            </div>

            {/* Key Specifications Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#eaf0ec] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-price-orange">
                  Quy cách đóng gói
                </span>
                <p className="mt-1 text-xs font-semibold text-main-green">{product.packaging}</p>
              </div>

              <div className="rounded-2xl border border-[#eaf0ec] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-price-orange">
                  Dạng bào chế
                </span>
                <p className="mt-1 text-xs font-semibold text-main-green">{product.dosageForm}</p>
              </div>

              <div className="rounded-2xl border border-[#eaf0ec] bg-white p-3.5 shadow-2xs col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-price-orange">
                  Hoạt chất / Thành phần chính
                </span>
                <p className="mt-1 text-xs font-semibold text-main-green">{product.activeIngredients}</p>
              </div>
            </div>

            {/* Target Animal Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Chỉ định dùng cho:</span>
              {product.animals.map((animal) => (
                <span
                  key={animal.id}
                  className="rounded-lg bg-[#faf3ea] px-2.5 py-1 text-xs font-bold text-main-green"
                >
                  {animal.name}
                </span>
              ))}
            </div>

            {/* Action CTA Buttons Row */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <ZaloConsultationButton
                  zaloUrl={contact.zaloUrl}
                  message={message}
                  size="lg"
                  className="w-full rounded-2xl bg-price-orange py-6 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-price-orange-dark"
                />
              </div>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-main-green/30 bg-white py-6 text-sm font-bold uppercase tracking-wider text-main-green shadow-2xs hover:bg-main-green hover:text-white"
              >
                <a href={getTelephoneUrl(contact.phone)} className="flex items-center gap-2">
                  <Phone className="size-4" />
                  <span>Gọi Hotline {contact.phone}</span>
                </a>
              </Button>
            </div>

            {/* Promotion & Gift Block (Wolf Yoga promotion-section) */}
            <div className="mt-6 rounded-2xl border border-[#eaf0ec] bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2.5 font-bold text-main-green text-xs uppercase tracking-wider">
                <div className="flex size-7 items-center justify-center rounded-full bg-[#faf3ea] text-price-orange">
                  <Gift className="size-4" />
                </div>
                <span>Hỗ Trợ Kỹ Thuật & Ưu Đãi Đặc Biệt</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Tặng kèm phác đồ điều trị & hướng dẫn phòng bệnh chuẩn y khoa</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Cam kết xuất hoá đơn VAT đầy đủ & chứng nhận chất lượng COA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Bảo quản chuẩn kho lạnh GSP đảm bảo hoạt lực thuốc tối đa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Detailed Information Tabs (ant-product-des-and-specs) */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Tabs (8 cols) */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="information" className="rounded-3xl border border-[#eaf0ec] bg-white p-5 sm:p-7 shadow-[0_8px_25px_rgba(31,74,58,0.04)]">
              <TabsList className="!grid !h-auto w-full grid-cols-1 gap-2 rounded-2xl bg-[#faf3ea] p-1.5 sm:grid-cols-3">
                <TabsTrigger
                  value="information"
                  className="!h-12 rounded-xl text-xs font-bold uppercase tracking-wider data-active:bg-main-green data-active:text-white sm:text-xs"
                >
                  <ClipboardList className="size-4 mr-1.5" /> Thông tin sản phẩm
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="!h-12 rounded-xl text-xs font-bold uppercase tracking-wider data-active:bg-main-green data-active:text-white sm:text-xs"
                >
                  <PackageCheck className="size-4 mr-1.5" /> Hướng dẫn sử dụng
                </TabsTrigger>
                <TabsTrigger
                  value="storage"
                  className="!h-12 rounded-xl text-xs font-bold uppercase tracking-wider data-active:bg-main-green data-active:text-white sm:text-xs"
                >
                  <Archive className="size-4 mr-1.5" /> Hướng dẫn bảo quản
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: General Info */}
              <TabsContent value="information" className="mt-6 space-y-5 text-xs sm:text-sm">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-main-green">Mô tả sản phẩm</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground whitespace-pre-line">
                    {product.description || product.shortDescription}
                  </p>
                </div>

                <div className="border-t border-[#f0e6da] pt-4">
                  <h3 className="font-playfair text-lg font-bold text-main-green">Thành phần hoạt chất</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground whitespace-pre-line">
                    {product.activeIngredients}
                  </p>
                </div>

                <div className="border-t border-[#f0e6da] pt-4">
                  <h3 className="font-playfair text-lg font-bold text-main-green">Chỉ định & Công dụng điều trị</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground whitespace-pre-line">
                    {product.indications}
                  </p>
                </div>
              </TabsContent>

              {/* Tab 2: Usage */}
              <TabsContent value="usage" className="mt-6 space-y-4 text-xs sm:text-sm">
                <h3 className="font-playfair text-lg font-bold text-main-green">Cách dùng & Liều lượng khuyến cáo</h3>
                <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                  {product.usageInformation}
                </p>
                <div className="rounded-2xl bg-[#faf3ea] p-4 text-xs text-main-green">
                  <strong>Khuyến nghị bác sĩ:</strong> Liều lượng có thể điều chỉnh tùy thuộc vào thể trọng, mức độ nhiễm khuẩn và tình trạng sức khỏe thực tế của đàn vật nuôi.
                </div>
              </TabsContent>

              {/* Tab 3: Storage */}
              <TabsContent value="storage" className="mt-6 space-y-4 text-xs sm:text-sm">
                <h3 className="font-playfair text-lg font-bold text-main-green">Hướng dẫn bảo quản</h3>
                <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                  {product.storageInformation}
                </p>
                <div className="border-t border-[#f0e6da] pt-4">
                  <h3 className="font-playfair text-lg font-bold text-main-green">Chính sách giao nhận & Đổi trả</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Sản phẩm được vận chuyển trong thùng xốp chuyên dụng kèm gel giữ lạnh đối với vaccine và kháng sinh sinh học. Hỗ trợ đổi trả trong vòng 7 ngày nếu bao bì có dấu hiệu rò rỉ hoặc lỗi niêm phong từ nhà sản xuất.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Safety Card (4 cols) */}
          <div className="lg:col-span-4">
            <aside className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-[0_8px_25px_rgba(220,38,38,0.04)]">
              <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider text-xs">
                <AlertTriangle className="size-5" />
                <span>Lưu Ý An Toàn & Khuyến Cáo</span>
              </div>

              <h2 className="mt-3 font-playfair text-lg font-bold text-red-900">
                Sử Dụng Thuốc An Toàn
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-red-800/85">
                {product.safetyInformation}
              </p>

              <div className="mt-4 rounded-xl bg-white p-3.5 text-xs leading-relaxed text-red-900 shadow-2xs">
                <strong>Lưu ý quan trọng:</strong> Thông tin trên website không thay thế cho chỉ định trực tiếp từ Bác sĩ thú y hoặc hướng dẫn chính thức từ nhà sản xuất.
              </div>

              <div className="mt-5">
                <Button
                  asChild
                  className="w-full rounded-xl bg-main-green text-xs font-bold text-white hover:bg-[#163b2e]"
                >
                  <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                    <MessageCircle className="size-4" />
                    <span>Hỏi Bác sĩ thú y qua Zalo</span>
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </div>

        {/* 4. Related Products (wolf-product-relate) */}
        {related.length > 0 && (
          <section aria-label="Sản phẩm tương tự" className="mt-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-main-green/10 text-main-green">
                  <Sparkles className="size-5 text-price-orange" />
                </div>
                <div>
                  <h2 className="font-playfair text-xl font-bold uppercase tracking-tight text-main-green sm:text-2xl">
                    Sản Phẩm Tương Tự
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Các dòng dược phẩm cùng công dụng hoặc nhóm điều trị
                  </p>
                </div>
              </div>

              <Link
                href={`/danh-muc/${product.category.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-main-green hover:text-price-orange"
              >
                <span>Xem danh mục</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Recently Viewed Products */}
        <div className="mt-14">
          <RecentlyViewedProducts currentSlug={product.slug} products={recentlyViewable} />
        </div>

        {/* Mobile Fixed Contact Bar */}
        <MobileProductContactBar
          phone={contact.phone}
          zaloUrl={contact.zaloUrl}
          message={message}
        />
      </div>
    </div>
  );
}
