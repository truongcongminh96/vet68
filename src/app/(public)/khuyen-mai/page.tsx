import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, PackageCheck, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContactSettings } from "@/lib/contact-settings";
import { getActiveBanners } from "@/lib/content/queries";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Khuyến mãi", description: "Thông tin chương trình và ưu đãi được Vet Medicine 68 xác nhận tại thời điểm liên hệ.", alternates: { canonical: "/khuyen-mai" } };

const commitments = [[BadgeCheck, "Thông tin rõ ràng", "Xác nhận điều kiện trước khi liên hệ."], [PackageCheck, "Đúng sản phẩm", "Kiểm tra quy cách và tình trạng hàng."], [PhoneCall, "Hỗ trợ trực tiếp", "Tư vấn qua Zalo và hotline."]] as const;

export default async function PromotionsPage() {
  const [contact, banners] = await Promise.all([getContactSettings(), getActiveBanners("promotions_page")]);
  const demoMode = !hasSupabaseEnv();
  const banner = banners[0];
  return (
    <div className="paper-page">
      <section className="paper-navy-section">
        <div className="site-container relative z-10 grid min-h-[455px] items-center gap-8 py-11 md:min-h-[510px] md:grid-cols-[.92fr_1.08fr] md:py-14 lg:gap-14">
          <div className="relative z-10"><span className="hero-ray-mark" aria-hidden="true" /><p className="font-heading text-xs font-extrabold uppercase tracking-[.15em] text-petshop-yellow">Khuyến mãi</p><h1 className="mt-4 max-w-xl text-[2.35rem] font-extrabold leading-[1.03] tracking-[-.055em] text-white sm:text-5xl lg:text-[56px]">{banner?.title ?? "Thông tin ưu đãi được xác nhận khi liên hệ"}</h1><p className="mt-5 max-w-xl text-[15px] leading-7 text-white/76 md:text-base">{banner?.subtitle ?? (demoMode ? "Trang hiện dùng nội dung demo. Vet68 sẽ xác nhận điều kiện, thời gian và sản phẩm áp dụng trước khi tư vấn." : "Thời gian áp dụng, sản phẩm tham gia và điều kiện chương trình được xác nhận trực tiếp tại thời điểm liên hệ.")}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="h-12 rounded-full bg-petshop-yellow px-6 font-extrabold text-primary hover:bg-[#ffd13a]" asChild><a href={banner?.linkUrl ?? contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button><Button size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-white/8 px-6 text-white hover:bg-white hover:text-primary" asChild><Link href="/san-pham">Xem sản phẩm <ArrowRight aria-hidden="true" /></Link></Button></div></div>
          <div className="paper-hero-photo relative aspect-[16/10] md:aspect-[4/3]"><Image src={banner?.image ?? "/images/home/promotion-vet-cat-consultation.png"} alt={banner?.imageAlt ?? "Bác sĩ thú y tư vấn cho người nuôi mèo"} fill priority sizes="(max-width: 768px) 100vw, 54vw" className="object-cover object-[67%_center]" /></div>
        </div>
      </section>
      <section className="site-container py-12 md:py-16 lg:py-20"><div className="grid gap-4 sm:grid-cols-3">{commitments.map(([Icon, title, body], index) => <article key={title} className={`paper-panel p-6 ${index === 1 ? "paper-panel-warm sm:translate-y-5" : ""}`}><span className="flex size-12 items-center justify-center rounded-full bg-petshop-teal text-white"><Icon className="size-6" aria-hidden="true" /></span><h2 className="mt-5 text-xl font-extrabold text-primary">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}</div><div className="paper-note mx-auto mt-14 max-w-3xl p-7 text-center"><h2 className="paper-heading text-2xl md:text-3xl">Cần kiểm tra chương trình đang áp dụng?</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Gửi tên sản phẩm, mã SKU và quy cách. Vet68 sẽ phản hồi thông tin phù hợp tại thời điểm bạn liên hệ.</p><Button className="action-button mt-6 h-11 rounded-full px-5 font-extrabold" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Nhắn Zalo ngay</a></Button></div></section>
    </div>
  );
}
