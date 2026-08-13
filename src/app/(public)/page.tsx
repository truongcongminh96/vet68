import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bug,
  CalendarDays,
  Headset,
  HeartPulse,
  Heart,
  MessageCircle,
  Pill,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Syringe,
  Truck,
  Wind,
  Wrench,
} from "lucide-react";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductPrice } from "@/components/catalogue/product-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [taxonomy, featuredProducts, newProducts, posts, heroBanners, promotionBanners, contact] = await Promise.all([
    getTaxonomy(),
    getFeaturedProducts(6),
    getNewProducts(6),
    getPosts(),
    getActiveBanners("home_hero"),
    getActiveBanners("home_promotion"),
    getContactSettings(),
  ]);
  const demoMode = !hasSupabaseEnv()
    || featuredProducts.some((product) => product.slug.endsWith("-demo"))
    || taxonomy.brands.some((brand) => brand.name.toLocaleLowerCase("vi").includes("demo"));
  const heroBanner = heroBanners[0];
  const promotionBanner = promotionBanners[0];
  const needs = taxonomy.categories.filter((item) => item.kind === "treatment_need" && item.slug in needIcons).slice(0, 8);

  return (
    <div className="overflow-hidden bg-[#fffaf0]">
      <section className="hero-editorial">
        <div className="site-container relative z-10 grid min-h-[520px] items-center gap-7 py-9 md:min-h-[570px] md:grid-cols-[0.96fr_1.04fr] md:py-12 lg:min-h-[600px] lg:gap-10">
          <div className="relative z-10 pb-1 md:pb-12">
            <span className="hero-ray-mark" aria-hidden="true" />
            <p className="whitespace-nowrap font-heading text-[clamp(2.35rem,4.7vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.06em] text-primary">Vet Medicine <span className="text-medical-red">68</span></p>
            <h1 className="mt-5 max-w-[590px] text-[2rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-primary sm:text-[2.4rem] lg:text-[44px]">
              {heroBanner?.title ?? "Thuốc thú y chất lượng, dễ dàng tra cứu"}
            </h1>
            <p className="mt-4 max-w-[530px] text-[15px] leading-7 text-[#405c68] md:text-base">
              {heroBanner?.subtitle ?? "Tìm đúng sản phẩm theo công ty phân phối, danh mục và đối tượng sử dụng. Vet68 hỗ trợ xác nhận giá và quy cách trước khi đặt hàng."}
            </p>
            <Button size="lg" className="action-button mt-6 h-13 rounded-full px-6 text-base font-extrabold shadow-[3px_4px_0_rgba(6,45,62,0.12)]" asChild>
              <Link href="/san-pham">Xem danh mục sản phẩm <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>

          <div className="relative min-h-[350px] self-stretch md:min-h-[480px]">
            <span className="hero-hand-loop hero-hand-loop-top hidden md:block" aria-hidden="true" />
            <div className="hero-photo-frame absolute inset-x-[6%] bottom-3 top-3 md:left-[11%] md:right-[7%] md:bottom-7 md:top-6">
              <div className="hero-photo-inner">
                <Image
                  src={heroBanner?.image ?? "/images/home/hero-vet-dog.png"}
                  alt={heroBanner?.imageAlt ?? "Bác sĩ thú y kiểm tra sức khoẻ cho chó golden retriever"}
                  fill
                  priority
                  sizes="(max-width: 768px) 94vw, 52vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <span className="hero-hand-loop hero-hand-loop-bottom hidden md:block" aria-hidden="true" />
            <Heart className="hero-doodle-heart hidden md:block" strokeWidth={2.6} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="trust-paper-strip relative z-10" aria-label="Cam kết của Vet68">
        <div className="site-container grid grid-cols-2 gap-y-4 pb-7 pt-5 lg:grid-cols-4 lg:pb-8 lg:pt-6">
          {[
            [BadgeCheck, "Sản phẩm chất lượng", "Thông tin rõ ràng, dễ kiểm tra", "bg-petshop-teal"],
            [ReceiptText, "Hóa đơn đầy đủ", "Minh bạch khi xác nhận đơn", "bg-medical-red"],
            [Truck, "Giao hàng nhanh", "Hỗ trợ xử lý đúng thời gian", "bg-petshop-teal"],
            [Headset, "Tư vấn tận tình", "Trực tiếp qua Zalo và hotline", "bg-medical-red"],
          ].map(([Icon, title, text, color], index) => (
            <div key={String(title)} className={`flex min-h-16 items-center gap-3 px-2 sm:px-5 ${index > 0 ? "lg:border-l lg:border-border" : ""}`}>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white sm:size-12 ${String(color)}`}><Icon className="size-5" aria-hidden="true" /></span>
              <div><p className="font-heading text-sm font-extrabold text-primary sm:text-base">{String(title)}</p><p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">{String(text)}</p></div>
            </div>
          ))}
        </div>
      </section>

      {demoMode ? <div className="border-y border-[#eedf9d] bg-[#fff7cc]"><div className="site-container py-2.5 text-center text-xs font-semibold leading-5 text-[#685300]">{DEMO_NOTICE}</div></div> : null}

      <main className="paper-canvas py-11 md:py-14">
        <section id="vat-nuoi" className="scroll-mt-36">
          <div className="site-container">
            <h2 className="petshop-section-title">Tìm theo vật nuôi</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Chọn đúng nhóm vật nuôi để thu hẹp catalogue nhanh hơn.</p>
            <div className="petshop-scroll-row -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-6">
              {taxonomy.animalTypes.slice(0, 6).map((animal) => (
                <Link key={animal.id} href={`/vat-nuoi/${animal.slug}`} className="group min-w-[170px] snap-start overflow-hidden rounded-[18px] border-4 border-white bg-white petshop-card-shadow transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none md:min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-petshop-cream">
                    <Image src={animal.image} alt={animal.imageAlt ?? `Hình minh hoạ nhóm ${animal.name}`} fill sizes="(max-width: 768px) 170px, 17vw" className={animal.slug === "thiet-bi-thu-y" ? "object-contain p-4 transition-transform group-hover:scale-105" : "object-cover transition-transform group-hover:scale-105"} />
                  </div>
                  <div className="m-1 flex items-center justify-between gap-2 rounded-xl bg-petshop-teal px-3 py-2.5 text-white">
                    <h3 className="truncate font-heading text-sm font-extrabold">{animal.name}</h3>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-petshop-teal"><ArrowRight className="size-3.5" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-9 md:pt-11">
          <div className="site-container">
            <h2 className="petshop-section-title">Tìm theo nhu cầu sử dụng</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Lối vào thực dụng khi bạn đã biết mục đích cần tra cứu.</p>
            <div className="petshop-scroll-row -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 lg:grid-cols-8">
              {needs.map((need) => {
                const Icon = needIcons[need.slug as keyof typeof needIcons];
                return (
                  <Link key={need.id} href={`/danh-muc/${need.slug}`} className="group flex min-h-32 min-w-[138px] snap-start flex-col items-center justify-center rounded-[18px] border border-[#eee5d4] bg-white p-4 text-center petshop-card-shadow transition-[border-color,transform] hover:-translate-y-1 hover:border-petshop-teal motion-reduce:transform-none md:min-w-0">
                    <Icon className="size-9 text-[#08728a] transition-transform group-hover:scale-110" strokeWidth={1.7} aria-hidden="true" />
                    <h3 className="mt-3 text-xs font-extrabold leading-5 text-primary">{need.name}</h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pt-9 md:pt-11">
          <div className="site-container">
            <SectionHeading title="Sản phẩm nổi bật" href="/san-pham" label="Xem tất cả" />
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Những sản phẩm đang được khách hàng quan tâm trong catalogue.</p>
            <div className="petshop-scroll-row -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 xl:grid-cols-6">
              {featuredProducts.map((product, index) => <div key={product.id} className="min-w-[240px] snap-start lg:min-w-0"><ProductCard product={product} eager={index < 4} showcase /></div>)}
            </div>
            <p className="mt-1 text-xs font-semibold text-[#755b00]">Giá hiển thị mang tính tham khảo và có thể thay đổi theo thời điểm.</p>
          </div>
        </section>

        <section className="pt-10 md:pt-12">
          <div className="site-container">
            <div className="relative grid min-h-[250px] overflow-hidden rounded-[24px] bg-deep-navy text-white petshop-card-shadow md:grid-cols-[0.88fr_1.12fr]">
              <div className="relative min-h-60 overflow-hidden md:min-h-[300px]">
                <Image src={promotionBanner?.image ?? "/images/home/consultation-vet-dog.png"} alt={promotionBanner?.imageAlt ?? "Bác sĩ thú y bế chó nhỏ để tư vấn chăm sóc"} fill sizes="(max-width: 768px) 100vw, 44vw" className="object-cover object-left" />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-deep-navy md:block" />
              </div>
              <div className="petshop-paw-pattern relative flex flex-col justify-center px-6 py-8 md:px-10 lg:px-14">
                <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-white md:text-[38px]">{promotionBanner?.title ?? "Cần tư vấn sản phẩm phù hợp?"}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-base">{promotionBanner?.subtitle ?? "Gửi tên sản phẩm hoặc mã SKU. Đội ngũ Vet68 sẽ hỗ trợ xác nhận đúng mặt hàng và quy cách hiện tại."}</p>
                <Button size="lg" className="mt-6 w-fit rounded-full bg-petshop-yellow px-6 font-extrabold text-primary hover:bg-[#ffd13a]" asChild>
                  <a href={promotionBanner?.linkUrl ?? contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Chat ngay với chuyên gia</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="thuong-hieu" className="scroll-mt-36 pt-9 md:pt-11">
          <div className="site-container">
            <SectionHeading title="Thương hiệu trong catalogue" href="/san-pham" label="Xem tất cả" />
            <div className="petshop-scroll-row -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-4">
              {taxonomy.brands.map((brand) => (
                <Link key={brand.id} href={`/thuong-hieu/${brand.slug}`} className="group flex min-h-28 min-w-[210px] snap-start items-center justify-center rounded-[18px] border border-[#eee5d4] bg-white p-5 petshop-card-shadow transition-[border-color,transform] hover:-translate-y-1 hover:border-petshop-teal motion-reduce:transform-none md:min-w-0">
                  {brand.logo ? <Image src={brand.logo} alt={brand.logoAlt ?? `Logo ${brand.name}`} width={190} height={76} unoptimized={brand.logo.toLowerCase().includes(".svg")} className="h-12 w-auto max-w-full object-contain transition-transform group-hover:scale-105" /> : <span className="font-heading text-xl font-extrabold text-primary">{brand.name}</span>}
                </Link>
              ))}
            </div>
            {demoMode ? <p className="text-xs text-muted-foreground">Tên và logo thương hiệu trong phần này là dữ liệu minh hoạ.</p> : null}
          </div>
        </section>

        {newProducts.length >= 4 ? (
          <section className="pt-9 md:pt-11">
            <div className="site-container">
              <SectionHeading title="Sản phẩm mới cập nhật" href="/san-pham" label="Xem tất cả" />
              <div className="petshop-scroll-row -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 xl:grid-cols-6">
                {newProducts.map((product) => (
                  <article key={product.id} className="flex min-w-[225px] snap-start flex-col overflow-hidden rounded-[18px] border border-[#eee5d4] bg-white petshop-card-shadow lg:min-w-0">
                    <Link href={`/san-pham/${product.slug}`} className="relative aspect-[4/3] bg-[#fffdf8]"><Badge className="absolute left-3 top-3 z-10 rounded-full bg-medical-red text-white">Mới</Badge><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="225px" className="object-contain p-5" /></Link>
                    <div className="flex flex-1 flex-col p-4"><p className="truncate text-[11px] font-semibold text-muted-foreground">{product.brand.name}</p><h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-primary"><Link href={`/san-pham/${product.slug}`} className="hover:text-medical-red">{product.name}</Link></h3><p className="mt-1 truncate text-[10px] text-muted-foreground">{product.sku} · {product.packaging}</p><div className="mt-auto pt-3 [&_p]:text-medical-red"><ProductPrice product={product} compact /></div></div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="pt-9 md:pt-11">
          <div className="site-container">
            <SectionHeading title="Kiến thức thú y" href="/kien-thuc-thu-y" label="Xem tất cả" icon="book" />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <article key={post.id} className="group flex flex-col overflow-hidden rounded-[18px] border border-[#eee5d4] bg-white petshop-card-shadow transition-transform hover:-translate-y-1 motion-reduce:transform-none">
                  <Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[3/2] overflow-hidden bg-petshop-cream"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={post.coverImage.endsWith(".svg") ? "object-contain p-5 transition-transform group-hover:scale-105" : "object-cover transition-transform group-hover:scale-105"} /></Link>
                  <div className="flex flex-1 flex-col p-4"><p className="text-xs font-bold text-petshop-teal">{knowledgeCategories[index] ?? "Kiến thức thú y"}</p><h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-6 text-primary"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-medical-red">{post.title}</Link></h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><div className="mt-auto flex items-center gap-1 pt-4 text-xs text-muted-foreground"><CalendarDays className="size-3.5" aria-hidden="true" />{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))}</div></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ title, href, label, icon }: { title: string; href: string; label: string; icon?: "book" }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="petshop-section-title">{title}</h2>
      <Button variant="ghost" className="h-9 rounded-full bg-petshop-teal px-4 text-xs font-extrabold text-white hover:bg-[#128794] hover:text-white" asChild>
        <Link href={href}>{label} {icon === "book" ? <BookOpen aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</Link>
      </Button>
    </div>
  );
}
