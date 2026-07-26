import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bug,
  CalendarDays,
  HeartPulse,
  MessageCircle,
  PackageCheck,
  Phone,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Syringe,
  Wind,
  Wrench,
} from "lucide-react";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductPrice } from "@/components/catalogue/product-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { getFeaturedProducts, getNewProducts, getPosts, getTaxonomy } from "@/lib/catalogue/queries";
import { getActiveBanners } from "@/lib/content/queries";
import { DEMO_NOTICE } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Thuốc thú y và sản phẩm chăm sóc vật nuôi",
  description: "Tra cứu thuốc thú y, vaccine, dinh dưỡng, sát trùng và dụng cụ. Liên hệ Vet Medicine 68 để xác nhận giá và được tư vấn.",
  alternates: { canonical: "/" },
};

const needIcons = {
  "khang-sinh": Pill,
  "vitamin-khoang-chat": Sparkles,
  "ho-tro-tieu-hoa": HeartPulse,
  "ho-tro-ho-hap": Wind,
  "sat-trung": ShieldCheck,
  vaccine: Syringe,
  "kiem-soat-ky-sinh-trung": Bug,
  "dung-cu": Wrench,
} as const;

const knowledgeCategories = ["Thông tin sử dụng", "Tư vấn sản phẩm", "Chăm sóc vật nuôi"];

export default async function HomePage() {
  const [taxonomy, featuredProducts, newProducts, posts, heroBanners, promotionBanners] = await Promise.all([
    getTaxonomy(),
    getFeaturedProducts(4),
    getNewProducts(4),
    getPosts(),
    getActiveBanners("home_hero"),
    getActiveBanners("home_promotion"),
  ]);
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv()
    || featuredProducts.some((product) => product.slug.endsWith("-demo"))
    || taxonomy.brands.some((brand) => brand.name.toLocaleLowerCase("vi").includes("demo"));
  const heroBanner = heroBanners[0];
  const promotionBanner = promotionBanners[0];
  const needs = taxonomy.categories
    .filter((item) => item.kind === "treatment_need" && item.slug in needIcons)
    .slice(0, 8);

  return (
    <>
      <section className="overflow-hidden border-b border-border bg-white">
        <div className="site-container grid items-center gap-10 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-16 lg:min-h-[600px] lg:gap-14 lg:py-18">
          <div className="max-w-[650px]">
            <p className="mb-4 font-heading text-sm font-bold text-[#257493]">Catalogue thuốc và sản phẩm thú y</p>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary sm:text-5xl lg:text-[58px]">
              Thuốc thú y chính hãng, dễ dàng tra cứu
            </h1>
            <p className="mt-5 max-w-[590px] text-base leading-7 text-muted-foreground md:text-lg">
              Tìm theo vật nuôi, công dụng, thương hiệu hoặc hoạt chất. Liên hệ Vet68 để xác nhận giá và quy cách hiện tại.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="action-button h-11 px-5" asChild>
                <Link href="/san-pham">Xem danh mục sản phẩm <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-11 bg-white px-5" asChild>
                <a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a>
              </Button>
            </div>
          </div>

          <div className="grid min-h-[430px] grid-cols-[1.15fr_0.85fr] gap-3 sm:gap-4" aria-label="Hình ảnh minh hoạ thú y và sản phẩm">
            <div className="relative overflow-hidden rounded-2xl bg-soft-blue retail-card-shadow">
              <Image
                src={heroBanner?.image ?? "/images/home/hero-veterinary-products.jpg"}
                alt={heroBanner?.imageAlt ?? "Chó đeo ống nghe, hình minh hoạ cho hoạt động tư vấn thú y"}
                fill
                priority
                sizes="(max-width: 768px) 60vw, 38vw"
                className="object-cover object-center"
              />
            </div>
            <div className="grid grid-rows-2 gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-[#f4f8fa]">
                <Image src="/images/products/demo-vitamin-bottle.svg" alt="Minh hoạ chai vitamin thú y demo" fill priority sizes="(max-width: 768px) 36vw, 20vw" className="object-contain p-3" />
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-soft-blue">
                <Image src="/images/demo/animal-cats.jpg" alt="Mèo, nhóm vật nuôi trong catalogue Vet68" fill sizes="(max-width: 768px) 36vw, 20vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white" aria-label="Lợi ích tra cứu">
        <div className="site-container grid grid-cols-2 py-5 md:grid-cols-4 md:py-6">
          {[
            [BadgeCheck, "Thông tin rõ ràng", "Tên, SKU và quy cách"],
            [Search, "Tìm kiếm nhanh", "Theo vật nuôi và nhu cầu"],
            [PackageCheck, "Giá tham khảo", "Xác nhận khi liên hệ"],
            [MessageCircle, "Tư vấn trực tiếp", "Qua Zalo và hotline"],
          ].map(([Icon, title, text], index) => (
            <div key={String(title)} className={`flex gap-3 px-2 py-3 sm:px-4 ${index % 2 ? "border-l border-border" : ""} md:border-l md:first:border-l-0`}>
              <Icon className="mt-0.5 size-5 shrink-0 text-[#257493]" aria-hidden="true" />
              <div><p className="text-sm font-bold text-foreground">{String(title)}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{String(text)}</p></div>
            </div>
          ))}
        </div>
      </section>

      {demoMode ? (
        <div className="border-b border-[#efe2a6] bg-[#fffaf0]">
          <div className="site-container py-3 text-center text-xs font-semibold leading-5 text-[#6b5700]">{DEMO_NOTICE}</div>
        </div>
      ) : null}

      <section id="vat-nuoi" className="section-space bg-[#f7f9fa] scroll-mt-44">
        <div className="site-container">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Tìm theo vật nuôi</h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Bắt đầu từ nhóm phù hợp để thu hẹp catalogue nhanh hơn.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {taxonomy.animalTypes.slice(0, 6).map((animal) => (
              <Link key={animal.id} href={`/vat-nuoi/${animal.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action/70 hover:retail-card-shadow motion-reduce:transform-none">
                <div className="relative aspect-[4/3] overflow-hidden bg-soft-blue">
                  <Image src={animal.image} alt={animal.imageAlt ?? `Hình minh hoạ nhóm ${animal.name}`} fill sizes="(max-width: 768px) 50vw, 33vw" className={animal.slug === "thiet-bi-thu-y" ? "object-contain p-4 transition-transform duration-200 group-hover:scale-[1.025]" : "object-cover transition-transform duration-200 group-hover:scale-[1.025]"} />
                </div>
                <div className="flex items-center justify-between gap-3 p-4 md:p-5">
                  <div><h3 className="font-heading text-base font-bold text-foreground md:text-lg">{animal.name}</h3><p className="mt-1 hidden text-sm leading-6 text-muted-foreground sm:line-clamp-2 sm:block">{animal.description}</p></div>
                  <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-[#dbeaf0] bg-soft-blue">
        <div className="site-container">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Tìm theo nhu cầu sử dụng</h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Lối vào thực dụng cho khách hàng đã biết mục đích cần tra cứu.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {needs.map((need) => {
              const Icon = needIcons[need.slug as keyof typeof needIcons];
              return (
                <Link key={need.id} href={`/danh-muc/${need.slug}`} className="group rounded-2xl border border-white bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action hover:retail-card-shadow motion-reduce:transform-none md:p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-soft-blue text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                  <h3 className="mt-4 font-heading text-sm font-bold leading-5 text-foreground md:text-base">{need.name}</h3>
                  <p className="mt-2 hidden text-sm leading-6 text-muted-foreground md:line-clamp-2 md:block">{need.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Xem nhóm <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="site-container">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl"><h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Sản phẩm nổi bật</h2><p className="mt-3 leading-7 text-muted-foreground">Các sản phẩm demo thể hiện đầy đủ ba trạng thái giá của catalogue.</p></div>
            <Button variant="outline" className="bg-white" asChild><Link href="/san-pham">Xem toàn bộ catalogue <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
          <p className="mt-5 inline-flex rounded-lg bg-[#fffaf0] px-3 py-2 text-xs font-semibold text-[#6b5700]">Giá hiển thị chỉ mang tính tham khảo và có thể thay đổi.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">{featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} eager={index < 4} />)}</div>
        </div>
      </section>

      <section className="section-space bg-[#f7f9fa]">
        <div className="site-container">
          <div className="grid overflow-hidden rounded-2xl border border-[#d5e8ef] bg-soft-blue lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <h2 className="max-w-xl text-3xl font-bold tracking-[-0.03em] text-primary md:text-[38px]">{promotionBanner?.title ?? "Bạn cần kiểm tra giá hoặc quy cách hiện tại?"}</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{promotionBanner?.subtitle ?? "Gửi tên sản phẩm hoặc mã SKU qua Zalo. Vet68 sẽ hỗ trợ xác nhận đúng mặt hàng và tư vấn phù hợp."}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="action-button h-11 px-5" asChild><a href={promotionBanner?.linkUrl ?? contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button>
                <Button size="lg" variant="outline" className="h-11 bg-white px-5" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> {contact.phoneDisplay}</a></Button>
              </div>
            </div>
            <div className="relative min-h-72 lg:min-h-[390px]">
              <Image src={promotionBanner?.image ?? "/images/demo/article-care.jpg"} alt={promotionBanner?.imageAlt ?? "Người chăm sóc mèo, hình minh hoạ cho tư vấn sản phẩm thú y"} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="thuong-hieu" className="section-space bg-white scroll-mt-44">
        <div className="site-container">
          <div className="max-w-2xl"><h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Thương hiệu trong catalogue</h2><p className="mt-3 leading-7 text-muted-foreground">Chọn thương hiệu để xem các sản phẩm đang được công khai.</p></div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {taxonomy.brands.map((brand) => (
              <Link key={brand.id} href={`/thuong-hieu/${brand.slug}`} className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-border bg-white p-5 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action hover:retail-card-shadow motion-reduce:transform-none">
                {brand.logo ? <Image src={brand.logo} alt={brand.logoAlt ?? `Logo ${brand.name}`} width={190} height={76} unoptimized={brand.logo.toLowerCase().includes(".svg")} className="h-14 w-auto max-w-full object-contain grayscale transition-[filter] duration-200 group-hover:grayscale-0" /> : <span className="font-heading text-xl font-extrabold text-primary">{brand.name}</span>}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-primary">Xem sản phẩm <ArrowRight className="size-3.5" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          {demoMode ? <p className="mt-4 text-xs text-muted-foreground">Tên và logo thương hiệu trong phần này là dữ liệu minh hoạ.</p> : null}
        </div>
      </section>

      {newProducts.length >= 4 ? (
        <section className="section-space border-y border-border bg-[#f7f9fa]">
          <div className="site-container">
            <div className="max-w-2xl"><h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Sản phẩm mới cập nhật</h2><p className="mt-3 leading-7 text-muted-foreground">Các mặt hàng vừa được bổ sung hoặc cập nhật thông tin.</p></div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {newProducts.map((product) => (
                <article key={product.id} className="grid grid-cols-[112px_1fr] gap-4 rounded-2xl border border-border bg-white p-3 transition-colors hover:border-action sm:grid-cols-[140px_1fr]">
                  <Link href={`/san-pham/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-[#f4f8fa]"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="140px" className="object-contain p-2" /></Link>
                  <div className="flex min-w-0 flex-col py-1"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold text-muted-foreground">{product.brand.name}</p><h3 className="mt-1 line-clamp-2 font-heading font-bold leading-6"><Link href={`/san-pham/${product.slug}`} className="hover:text-primary">{product.name}</Link></h3></div><Badge className="bg-[#fff8d6] text-[#735e00]">Mới</Badge></div><p className="mt-1 text-xs text-muted-foreground">{product.sku} | {product.packaging}</p><div className="mt-auto pt-3"><ProductPrice product={product} compact /></div></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-space bg-white">
        <div className="site-container">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><h2 className="text-3xl font-bold tracking-[-0.03em] text-primary md:text-[40px]">Kiến thức thú y</h2><p className="mt-3 leading-7 text-muted-foreground">Nội dung demo về cách tra cứu, sử dụng sản phẩm và chăm sóc vật nuôi.</p></div><Button variant="outline" className="bg-white" asChild><Link href="/kien-thuc-thu-y">Xem tất cả bài viết <BookOpen aria-hidden="true" /></Link></Button></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post, index) => (
              <article key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action hover:retail-card-shadow motion-reduce:transform-none">
                <Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[3/2] overflow-hidden bg-soft-blue"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={post.coverImage.endsWith(".svg") ? "object-contain p-3 transition-transform duration-200 group-hover:scale-[1.025]" : "object-cover transition-transform duration-200 group-hover:scale-[1.025]"} /></Link>
                <div className="flex flex-1 flex-col p-5"><p className="text-xs font-bold text-[#257493]">{knowledgeCategories[index] ?? "Kiến thức thú y"}</p><h3 className="mt-2 text-xl font-bold leading-7 text-foreground"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-primary">{post.title}</Link></h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" aria-hidden="true" />{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))}</span><Link href={`/kien-thuc-thu-y/${post.slug}`} className="inline-flex items-center gap-1 font-bold text-primary">Đọc thêm <ArrowRight className="size-3.5" aria-hidden="true" /></Link></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
