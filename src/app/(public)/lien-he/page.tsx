import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Liên hệ", description: "Liên hệ Vet Medicine 68 qua Zalo, hotline hoặc email để hỏi giá và thông tin sản phẩm.", alternates: { canonical: "/lien-he" } };

export default async function ContactPage() {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  const methods = [[MessageCircle, "Tư vấn qua Zalo", "Gửi tên sản phẩm hoặc mã SKU để Vet68 hỗ trợ kiểm tra.", contact.zaloUrl, true], [Phone, "Hotline", contact.phoneDisplay, getTelephoneUrl(contact.phone), false], [Mail, "Email", contact.email, `mailto:${contact.email}`, false], [MapPin, "Địa chỉ", contact.address, undefined, false]] as const;
  return (
    <div className="paper-page">
      <section className="site-container grid items-center gap-10 py-12 md:grid-cols-[.88fr_1.12fr] md:py-18 lg:gap-16 lg:py-22">
        <div><span className="hero-ray-mark" aria-hidden="true" /><p className="paper-eyebrow">Kết nối cùng Vet68</p><h1 className="paper-heading mt-4 max-w-[570px] text-[2.5rem] sm:text-5xl lg:text-[58px]">Liên hệ Vet Medicine 68</h1><p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground md:text-base">Gửi tên sản phẩm, SKU và quy cách. Đội ngũ Vet68 sẽ giúp bạn kiểm tra thông tin nhanh và rõ ràng hơn.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="action-button h-12 rounded-full px-6 font-extrabold" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button><Button size="lg" variant="outline" className="h-12 rounded-full border-[#e5d5b9] bg-white px-6" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> Gọi Vet68</a></Button></div></div>
        <div className="paper-hero-photo relative aspect-[4/3]"><Image src="/images/home/promotion-vet-cat-consultation.png" alt="Bác sĩ thú y tư vấn cùng người nuôi mèo" fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover object-[65%_center]" /></div>
      </section>
      <section className="paper-navy-section"><div className="site-container relative z-10 grid gap-8 py-14 md:grid-cols-[.8fr_1.2fr] md:py-18"><div className="self-center"><p className="font-heading text-xs font-extrabold uppercase tracking-[.15em] text-petshop-yellow">Thông tin liên hệ</p><h2 className="mt-3 max-w-md text-3xl font-extrabold leading-[1.04] tracking-[-.045em] text-white md:text-[44px]">Chọn cách tiện nhất để bắt đầu</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/72 md:text-base">Bạn có thể nhắn Zalo, gọi hotline hoặc gửi email. Vet68 sẽ xác nhận thông tin phù hợp theo từng sản phẩm.</p>{demoMode ? <p className="mt-6 text-sm font-semibold text-petshop-yellow">Thông tin liên hệ hiện là cấu hình demo.</p> : null}</div><div className="paper-note grid overflow-hidden p-0 md:grid-cols-2">{methods.map(([Icon, title, body, href, external], index) => <div key={title} className={`min-h-40 p-6 ${index > 1 ? "border-t border-[#eadfc8]" : ""} ${index % 2 ? "md:border-l md:border-[#eadfc8]" : ""}`}><span className="flex size-11 items-center justify-center rounded-full bg-petshop-teal text-white"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>{href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="mt-2 block text-sm leading-6 text-muted-foreground hover:text-medical-red">{body}</a> : <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>}</div>)}</div></div></section>
    </div>
  );
}
