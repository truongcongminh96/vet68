import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock3, CreditCard, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function SiteFooter() {
  const contact = await getContactSettings();
  const demoMode = !hasSupabaseEnv();

  return (
    <footer className="mt-auto border-t border-[#eaf0ec] bg-[#f7ebde]/40 pt-10 text-[#33302f]">
      <div className="site-container">
        {/* Policy Trust Header Bar */}
        <div className="mb-12 rounded-2xl border border-white/80 bg-white p-6 shadow-[0_10px_30px_rgba(31,74,58,0.06)]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf3ea] text-main-green">
                <Truck className="size-6 text-price-orange" />
              </div>
              <div>
                <p className="text-sm font-bold text-main-green">Giao hàng nhanh</p>
                <span className="text-xs text-muted-foreground">Đóng gói bảo quản chuyên dụng</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf3ea] text-main-green">
                <ShieldCheck className="size-6 text-main-green" />
              </div>
              <div>
                <p className="text-sm font-bold text-main-green">Chuẩn GMP - Chính hãng</p>
                <span className="text-xs text-muted-foreground">Xuất hoá đơn VAT đầy đủ</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf3ea] text-main-green">
                <CreditCard className="size-6 text-price-orange" />
              </div>
              <div>
                <p className="text-sm font-bold text-main-green">Thanh toán an toàn</p>
                <span className="text-xs text-muted-foreground">Xác nhận đơn minh bạch</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf3ea] text-main-green">
                <MessageCircle className="size-6 text-main-green" />
              </div>
              <div>
                <p className="text-sm font-bold text-main-green">Tư vấn chuyên môn 24/7</p>
                <span className="text-xs text-muted-foreground">Đội ngũ bác sĩ thú y đồng hành</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: About Vet68 & Socials */}
          <div>
            <SiteLogo />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Vet Medicine 68 - Hệ sinh thái tra cứu, cung cấp dược phẩm, vaccine, dinh dưỡng và thiết bị thú y chất lượng cao cho phòng khám, trang trại và người nuôi thú cưng trên toàn quốc.
            </p>
            {demoMode ? (
              <p className="mt-2 text-[11px] font-semibold text-price-orange">
                * Dữ liệu website đang ở chế độ xem mẫu.
              </p>
            ) : null}
            <div className="mt-5 flex items-center gap-2">
              <a
                href={contact.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-full bg-white text-main-green shadow-sm transition-all hover:bg-main-green hover:text-white"
                title="Zalo OA"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={getTelephoneUrl(contact.phone)}
                className="flex size-9 items-center justify-center rounded-full bg-white text-main-green shadow-sm transition-all hover:bg-main-green hover:text-white"
                title="Gọi Hotline"
              >
                <Phone className="size-4" />
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex size-9 items-center justify-center rounded-full bg-white text-main-green shadow-sm transition-all hover:bg-main-green hover:text-white"
                title="Gửi Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-main-green">
              Liên hệ với Vet68
            </h3>
            <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-price-orange" />
                <span>
                  Hotline:{" "}
                  <a href={getTelephoneUrl(contact.phone)} className="font-bold text-foreground hover:text-main-green">
                    {contact.phoneDisplay}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-price-orange" />
                <span>
                  Email:{" "}
                  <a href={`mailto:${contact.email}`} className="text-foreground hover:text-main-green">
                    {contact.email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-price-orange" />
                <span>{contact.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-price-orange" />
                <span>Thứ 2 - Thứ 7: 8:00 - 18:00 (Hỗ trợ cấp cứu 24/7)</span>
              </p>
            </div>
          </div>

          {/* Col 3: Payment & Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-main-green">
              Phương thức thanh toán
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">Hỗ trợ đa dạng hình thức thanh toán & xuất hoá đơn VAT điện tử:</p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <Image src="/images/payments/visa.svg" alt="Visa" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
              <Image src="/images/payments/momo.svg" alt="MoMo" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
              <Image src="/images/payments/napas.svg" alt="Napas" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
              <Image src="/images/payments/zalopay.svg" alt="ZaloPay" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
              <Image src="/images/payments/vnpay.svg" alt="VNPay" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
              <Image src="/images/payments/mastercard.svg" alt="MasterCard" width={72} height={40} className="h-8.5 w-auto object-contain transition-transform hover:scale-105" />
            </div>
          </div>

          {/* Col 4: Zalo QR & Fast Quote */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-main-green">
              Tư vấn & Nhận báo giá
            </h3>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#eaf0ec] bg-white p-3 shadow-xs">
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-main-green text-white">
                <MessageCircle className="size-6 text-white" />
                <span className="text-[9px] font-bold mt-0.5">ZALO OA</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-main-green">Zalo Official Account</p>
                <p className="text-muted-foreground mt-0.5">Quét mã hoặc bấm để kết nối trực tiếp Bác sĩ thú y</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-menu Navigation Links */}
        <div className="grid grid-cols-2 gap-8 border-t border-[#eaf0ec] py-8 sm:grid-cols-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main-green">Về chúng tôi</h4>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
              <Link href="/gioi-thieu" className="hover:text-main-green">Giới thiệu Vet68</Link>
              <Link href="/san-pham" className="hover:text-main-green">Catalogue sản phẩm</Link>
              <Link href="/kien-thuc-thu-y" className="hover:text-main-green">Kiến thức chuyên môn</Link>
              <Link href="/lien-he" className="hover:text-main-green">Hệ thống phân phối</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main-green">Hỗ trợ khách hàng</h4>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
              <Link href="/khuyen-mai" className="hover:text-main-green">Chương trình khuyến mãi</Link>
              <Link href="/lien-he" className="hover:text-main-green">Hướng dẫn tra cứu giá</Link>
              <Link href="/lien-he" className="hover:text-main-green">Quy trình xác nhận đơn</Link>
              <Link href="/lien-he" className="hover:text-main-green">Câu hỏi thường gặp</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main-green">Chính sách</h4>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
              <Link href="/lien-he" className="hover:text-main-green">Chính sách bảo hành & đổi trả</Link>
              <Link href="/lien-he" className="hover:text-main-green">Chính sách vận chuyển thuốc</Link>
              <Link href="/lien-he" className="hover:text-main-green">Chính sách đại lý & phòng khám</Link>
              <Link href="/lien-he" className="hover:text-main-green">Bảo mật thông tin</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main-green">Dòng sản phẩm</h4>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
              <Link href="/danh-muc/khang-sinh" className="hover:text-main-green">Kháng sinh & Đặc trị</Link>
              <Link href="/danh-muc/vitamin-khoang-chat" className="hover:text-main-green">Vitamin & Tăng lực</Link>
              <Link href="/danh-muc/sat-trung" className="hover:text-main-green">Sát trùng & Môi trường</Link>
              <Link href="/vat-nuoi/cho-va-meo" className="hover:text-main-green">Sản phẩm Chó & Mèo</Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t border-[#eaf0ec] py-6 text-center text-xs text-muted-foreground sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 Vet Medicine 68. Giao diện thiết kế theo phong cách tinh tế, chuẩn xác và hiện đại.</p>
          <p className="mt-2 sm:mt-0 text-[11px]">Thông tin website mang tính chất tham khảo kỹ thuật chuyên môn.</p>
        </div>
      </div>
    </footer>
  );
}
