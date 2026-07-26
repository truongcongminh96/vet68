import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContactSettings } from "@/lib/contact-settings";
import { getActiveBanners } from "@/lib/content/queries";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Khuyến mãi", description: "Thông tin chương trình và ưu đãi được Vet Medicine 68 xác nhận tại thời điểm liên hệ.", alternates: { canonical: "/khuyen-mai" } };

export default async function PromotionsPage() {
  const [contact, banners] = await Promise.all([getContactSettings(), getActiveBanners("promotions_page")]);
  const demoMode = !hasSupabaseEnv();
  const banner = banners[0];
  return <div className="site-container section-space"><div className="grid overflow-hidden rounded-2xl border border-[#d5e8ef] bg-soft-blue lg:grid-cols-[1fr_0.9fr]"><div className="relative min-h-80 lg:min-h-[500px]"><Image src={banner?.image ?? "/images/demo/article-care.jpg"} alt={banner?.imageAlt ?? "Người chăm sóc mèo, hình minh hoạ cho tư vấn sản phẩm thú y"} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div><div className="flex flex-col justify-center p-7 md:p-10 lg:p-12"><h1 className="text-4xl font-bold tracking-[-0.04em] text-primary md:text-5xl">{banner?.title ?? "Chương trình được xác nhận khi liên hệ"}</h1><p className="mt-5 leading-7 text-muted-foreground">{banner?.subtitle ?? (demoMode ? "Trang hiện dùng nội dung demo. Khuyến mãi thật cần có thời gian áp dụng, phạm vi sản phẩm và điều kiện rõ ràng trước khi xuất bản." : "Thời gian áp dụng, sản phẩm tham gia và điều kiện chương trình được xác nhận trực tiếp tại thời điểm liên hệ.")}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="action-button h-11 px-5" asChild><a href={banner?.linkUrl ?? contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button><Button size="lg" variant="outline" className="h-11 bg-white px-5" asChild><Link href="/san-pham">Xem sản phẩm <ArrowRight aria-hidden="true" /></Link></Button></div></div></div></div>;
}
