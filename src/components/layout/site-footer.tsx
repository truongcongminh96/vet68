import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function SiteFooter() {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();
  return (
    <footer className="mt-auto bg-deep-navy text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.25fr_0.82fr_0.82fr_1.1fr] lg:py-16">
        <div><div className="inline-flex rounded-xl bg-white p-2.5"><SiteLogo /></div><p className="mt-5 max-w-md text-sm leading-7 text-white/72">Catalogue thuốc thú y, vaccine, dinh dưỡng, sát trùng và dụng cụ. Vet68 hỗ trợ xác nhận đúng sản phẩm, giá tham khảo và quy cách hiện tại.</p>{demoMode ? <p className="mt-3 text-xs font-semibold text-[#ffd6d8]">Dữ liệu hiện tại là nội dung minh hoạ.</p> : null}</div>
        <div><h2 className="font-bold text-white">Danh mục</h2><div className="mt-4 grid gap-3 text-sm text-white/68"><Link className="hover:text-action" href="/san-pham">Tất cả sản phẩm</Link><Link className="hover:text-action" href="/danh-muc/thuoc-thu-y">Thuốc thú y</Link><Link className="hover:text-action" href="/danh-muc/vaccine-sinh-pham">Vaccine và sinh phẩm</Link><Link className="hover:text-action" href="/danh-muc/vitamin-dinh-duong">Vitamin và dinh dưỡng</Link><Link className="hover:text-action" href="/danh-muc/dung-cu-thu-y">Dụng cụ thú y</Link></div></div>
        <div><h2 className="font-bold text-white">Hỗ trợ</h2><div className="mt-4 grid gap-3 text-sm text-white/68"><Link className="hover:text-action" href="/khuyen-mai">Khuyến mãi</Link><Link className="hover:text-action" href="/kien-thuc-thu-y">Kiến thức thú y</Link><Link className="hover:text-action" href="/gioi-thieu">Về Vet68</Link><Link className="hover:text-action" href="/lien-he">Liên hệ</Link><Link className="hover:text-action" href="/robots.txt">Thông tin website</Link></div></div>
        <div><h2 className="font-bold text-white">Liên hệ Vet68</h2><div className="mt-4 grid gap-3 text-sm text-white/72"><a className="flex items-start gap-2 hover:text-action" href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Tư vấn qua Zalo</a><a className="flex items-start gap-2 hover:text-action" href={getTelephoneUrl(contact.phone)}><Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.phoneDisplay}</a><a className="flex items-start gap-2 hover:text-action" href={`mailto:${contact.email}`}><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.email}</a><p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {contact.address}</p><p className="flex items-start gap-2"><Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Thứ 2 - Thứ 7, 8:00 - 18:00</p></div></div>
      </div>
      <div className="border-t border-white/12"><div className="site-container flex flex-col gap-2 py-5 pb-24 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between md:pb-5"><p>© 2026 Vet Medicine 68. Thông tin website mang tính tham khảo.</p><p>Không thay thế tư vấn của bác sĩ thú y hoặc hướng dẫn từ nhà sản xuất.</p></div></div>
    </footer>
  );
}
