import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, MessageCircle, PackageCheck, Phone, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/catalogue/product-card";
import { ProductPrice } from "@/components/catalogue/product-price";
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

export default async function HomePage() {
  const [taxonomy, featuredProducts, newProducts, posts, heroBanners, promotionBanners] = await Promise.all([getTaxonomy(), getFeaturedProducts(4), getNewProducts(4), getPosts(), getActiveBanners("home_hero"), getActiveBanners("home_promotion")]);
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  const heroBanner = heroBanners[0];
  const promotionBanner = promotionBanners[0];
  const needs = taxonomy.categories.filter((item) => item.kind === "treatment_need");

  return (
    <>
      <section className="border-b bg-card">
        <div className="site-container grid min-h-[calc(100dvh-175px)] items-center gap-8 py-8 md:min-h-0 md:grid-cols-[0.92fr_1.08fr] md:py-12 lg:min-h-[590px] lg:gap-12">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary">Catalogue và tư vấn thú y</Badge>
            <h1 className="max-w-[19ch] text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-primary md:text-5xl lg:text-6xl">Tìm đúng sản phẩm. Hỏi đúng thông tin.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">Tra cứu sản phẩm thú y và liên hệ Vet68 để xác nhận giá, quy cách, cách đặt hàng.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild><Link href="/san-pham">Xem sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
              <Button size="lg" variant="outline" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button>
            </div>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-secondary subtle-shadow md:aspect-[4/3]">
            <Image src={heroBanner?.image ?? "/images/demo/hero-veterinary.jpg"} alt={heroBanner?.imageAlt ?? "Nhân viên y tế sử dụng điện thoại, hình minh họa cho dịch vụ tư vấn"} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </div>
      </section>

      {demoMode ? <div className="border-b bg-card"><div className="site-container py-3 text-center text-xs font-semibold leading-5 text-medical-red">{DEMO_NOTICE}</div></div> : null}

      <section className="section-space">
        <div className="site-container">
          <div className="max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Tìm theo vật nuôi</h2><p className="mt-3 leading-7 text-muted-foreground">Bắt đầu từ nhóm vật nuôi để thu hẹp catalogue. Việc lựa chọn cuối cùng vẫn cần dựa trên nhãn và tư vấn phù hợp.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr] lg:grid-rows-2">
            {taxonomy.animalTypes.map((animal, index) => (
              <Link key={animal.id} href={`/vat-nuoi/${animal.slug}`} className={index === 0 ? "group relative min-h-72 overflow-hidden rounded-2xl lg:row-span-2" : "group relative min-h-52 overflow-hidden rounded-2xl"}>
                <Image src={animal.image} alt={animal.imageAlt ?? `Hình minh họa nhóm ${animal.name}`} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#052f49]/90 via-[#052f49]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white"><h3 className="text-2xl font-bold">{animal.name}</h3><p className="mt-1 max-w-sm text-sm text-white/80">{animal.description}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card section-space">
        <div className="site-container grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Tìm theo nhu cầu sử dụng</h2><p className="mt-3 max-w-lg leading-7 text-muted-foreground">Các nhóm dưới đây hỗ trợ việc tìm kiếm, không phải chẩn đoán hoặc chỉ định điều trị.</p><Button variant="outline" className="mt-6" asChild><Link href="/san-pham">Mở bộ lọc đầy đủ <ArrowRight aria-hidden="true" /></Link></Button></div>
          <div className="grid gap-x-8 md:grid-cols-2">
            {needs.map((need) => <Link key={need.id} href={`/danh-muc/${need.slug}`} className="group flex min-h-28 items-center justify-between gap-4 border-b py-5"><div><h3 className="text-lg font-bold group-hover:text-primary">{need.name}</h3><p className="mt-1 text-sm text-muted-foreground">{need.description}</p></div><ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" /></Link>)}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Sản phẩm nổi bật</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{demoMode ? "Dữ liệu mẫu giúp kiểm tra cách hiển thị giá, quy cách và yêu cầu tư vấn." : "Các sản phẩm được Vet68 chọn để khách hàng tra cứu nhanh thông tin và quy cách."}</p></div><Button variant="outline" asChild><Link href="/san-pham">Xem catalogue</Link></Button></div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#073e5f] text-[#f8fbfd]">
        <div className="site-container py-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-highlight">Thương hiệu trong catalogue</p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 md:grid-cols-4">
            {taxonomy.brands.map((brand) => <Link key={brand.id} href={`/thuong-hieu/${brand.slug}`} className="flex min-h-24 items-center justify-center bg-[#073e5f] px-4 text-center font-heading text-lg font-extrabold hover:bg-[#0b4b70]">{brand.logo ? <Image src={brand.logo} alt={brand.logoAlt ?? `Logo ${brand.name}`} width={150} height={56} unoptimized={brand.logo.toLowerCase().includes(".svg")} className="max-h-14 w-auto max-w-full object-contain" /> : brand.name}</Link>)}
          </div>
          <p className="mt-4 text-xs text-[#f8fbfd]/70">{demoMode ? "Các tên thương hiệu trên là dữ liệu minh họa, không đại diện cho quan hệ phân phối thực tế." : "Chọn một thương hiệu để xem các sản phẩm đang được công khai trong catalogue."}</p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <div className="grid overflow-hidden rounded-2xl border bg-card md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-72 md:min-h-[410px]"><Image src={promotionBanner?.image ?? "/images/demo/medicine-lab.jpg"} alt={promotionBanner?.imageAlt ?? "Các vỉ thuốc dùng làm hình minh họa cho catalogue"} fill loading="eager" sizes="(max-width: 768px) 100vw, 52vw" className="object-cover" /></div>
            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12"><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{promotionBanner?.title ?? "Cần kiểm tra giá hiện tại?"}</h2><p className="mt-4 max-w-lg leading-7 text-muted-foreground">{promotionBanner?.subtitle ?? "Gửi tên sản phẩm và SKU qua Zalo. Vet68 sẽ dễ dàng xác định đúng mặt hàng và quy cách bạn đang hỏi."}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><a href={promotionBanner?.linkUrl ?? contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button><Button size="lg" variant="outline" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> Gọi Vet68</a></Button></div></div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card section-space">
        <div className="site-container">
          <div className="max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Sản phẩm mới cập nhật</h2><p className="mt-3 leading-7 text-muted-foreground">Danh sách dạng gọn để tránh lặp lại một carousel sản phẩm giống phần nổi bật.</p></div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {newProducts.map((product) => <article key={product.id} className="grid grid-cols-[116px_1fr] gap-4 rounded-xl border bg-background p-3 sm:grid-cols-[150px_1fr]"><Link href={`/san-pham/${product.slug}`} className="relative aspect-square overflow-hidden rounded-lg bg-muted"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="150px" className="object-cover" /></Link><div className="flex min-w-0 flex-col"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold text-muted-foreground">{product.brand.name}</p><h3 className="mt-1 font-bold leading-6"><Link href={`/san-pham/${product.slug}`} className="hover:text-primary">{product.name}</Link></h3></div><Badge variant="secondary">Mới</Badge></div><p className="mt-1 text-xs text-muted-foreground">{product.sku} | {product.packaging}</p><div className="mt-auto pt-3"><ProductPrice product={product} compact /></div></div></article>)}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src="/images/demo/authenticity.jpg" alt="Thuốc đóng gói dùng làm hình minh họa cho quy trình kiểm tra sản phẩm" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" /></div>
          <div><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Rõ nguồn thông tin trước khi tư vấn</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Trang sản phẩm tách rõ giá tham khảo, quy cách, thành phần và phần thông tin đang chờ xác minh. Nội dung chưa được duyệt không được trình bày như dữ liệu chính thức.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><BadgeCheck className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" /><div><h3 className="font-bold">Đúng tên và SKU</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Giúp khách hàng và nhân viên nhận diện cùng một sản phẩm.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" /><div><h3 className="font-bold">Cảnh báo an toàn</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Không biến nội dung catalogue thành chỉ định điều trị.</p></div></div></div></div>
        </div>
      </section>

      <section className="border-y bg-card section-space">
        <div className="site-container">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Kiến thức thú y</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Nội dung giáo dục cần có nguồn và người duyệt trước khi xuất bản chính thức.</p></div><Button variant="outline" asChild><Link href="/kien-thuc-thu-y">Xem bài viết</Link></Button></div>
          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            {posts.slice(0, 1).map((post) => <article key={post.id} className="overflow-hidden rounded-2xl border bg-background"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative block aspect-[16/8]"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" /></Link><div className="p-6"><p className="text-xs font-semibold text-muted-foreground">{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))} | {post.readingMinutes} phút đọc</p><h3 className="mt-2 text-2xl font-bold"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-primary">{post.title}</Link></h3><p className="mt-3 leading-7 text-muted-foreground">{post.excerpt}</p></div></article>)}
            <div className="grid gap-4">{posts.slice(1).map((post) => <article key={post.id} className="grid grid-cols-[104px_1fr] gap-4 border-b pb-4"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-square overflow-hidden rounded-lg"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="104px" className="object-cover" /></Link><div><p className="text-xs text-muted-foreground">{post.readingMinutes} phút đọc</p><h3 className="mt-1 font-bold leading-6"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-primary">{post.title}</Link></h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p></div></article>)}</div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">Tư vấn rõ ràng, giao nhận theo xác nhận thực tế</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Headphones, "Tư vấn theo sản phẩm", "Gửi tên, SKU và quy cách để trao đổi đúng mặt hàng."],
              [PackageCheck, "Xác nhận trước khi đặt", "Giá và tình trạng cung ứng được kiểm tra tại thời điểm liên hệ."],
              [Truck, "Trao đổi giao nhận", "Phạm vi và thời gian giao được xác nhận trực tiếp với khách hàng."],
              [ShieldCheck, "Thông tin có giới hạn", "Website không thay thế tư vấn chuyên môn hoặc nhãn sản phẩm."],
            ].map(([Icon, title, description]) => <div key={String(title)} className="border-t-2 border-primary pt-5"><Icon className="size-6 text-primary" aria-hidden="true" /><h3 className="mt-4 text-lg font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(description)}</p></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
