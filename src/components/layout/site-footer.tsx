import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function SiteFooter() {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="site-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
        <div><SiteLogo /><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Catalogue thuốc thú y và sản phẩm chăm sóc vật nuôi. Vet68 tư vấn qua Zalo hoặc điện thoại trước khi xác nhận giá và đặt hàng.</p>{demoMode ? <p className="mt-3 text-xs font-semibold text-medical-red">Dữ liệu hiện tại là nội dung minh họa.</p> : null}</div>
        <div><h2 className="font-bold">Khám phá</h2><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><Link href="/san-pham">Tất cả sản phẩm</Link><Link href="/khuyen-mai">Khuyến mãi</Link><Link href="/kien-thuc-thu-y">Kiến thức thú y</Link><Link href="/gioi-thieu">Giới thiệu</Link></div></div>
        <div><h2 className="font-bold">Hỗ trợ</h2><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><Link href="/lien-he">Liên hệ</Link><Link href="/san-pham?consultation=required">Sản phẩm cần tư vấn</Link><Link href="/robots.txt">Thông tin website</Link></div></div>
        <div><h2 className="font-bold">Liên hệ Vet68</h2><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><a className="flex items-start gap-2" href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Tư vấn qua Zalo</a><a className="flex items-start gap-2" href={getTelephoneUrl(contact.phone)}><Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.phoneDisplay}</a><a className="flex items-start gap-2" href={`mailto:${contact.email}`}><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.email}</a><p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.address}</p></div></div>
      </div>
      <div className="border-t"><div className="site-container flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Vet Medicine 68. Thông tin website mang tính tham khảo.</p><p>Không thay thế tư vấn của bác sĩ thú y hoặc nhà sản xuất.</p></div></div>
    </footer>
  );
}
