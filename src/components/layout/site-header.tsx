import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Flame, Heart, Menu, MessageCircle, Phone, Search, ShoppingBag } from "lucide-react";
import { ProductSearch } from "@/components/layout/product-search";
import { SiteLogo } from "@/components/layout/site-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getTaxonomy } from "@/lib/catalogue/queries";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import type { AnimalType, Category, Company } from "@/types/catalogue";

const primaryNavItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Ưu đãi chớp nhoáng", href: "/khuyen-mai", isDeal: true },
] as const;

const secondaryNavItems = [
  { label: "Kiến thức thú y", href: "/kien-thuc-thu-y" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export async function SiteHeader() {
  const [contact, taxonomy] = await Promise.all([getContactSettings(), getTaxonomy()]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eaf0ec] bg-white/95 backdrop-blur-md transition-all duration-200">
      {/* Top Marquee Announcement */}
      <div className="wolf-header-topbanner overflow-hidden bg-main-green py-2 text-white">
        <div className="site-container">
          <div className="announcement-bar relative flex items-center overflow-hidden">
            <div className="announcement-track flex w-max items-center gap-8 text-xs font-semibold tracking-wide sm:text-[13px]">
              <span className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Giao nhanh toàn quốc - Đóng gói chuyên dụng bảo quản thuốc
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                100% Sản phẩm chính hãng - Đạt chuẩn GMP & xuất hoá đơn VAT
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Bác sĩ thú y hỗ trợ tư vấn phác đồ & giải pháp phòng bệnh
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Liên hệ Zalo / Hotline để xác nhận quy cách & báo giá ưu đãi
              </span>
              {/* Duplicate track for seamless infinite marquee */}
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Giao nhanh toàn quốc - Đóng gói chuyên dụng bảo quản thuốc
              </span>
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                100% Sản phẩm chính hãng - Đạt chuẩn GMP & xuất hoá đơn VAT
              </span>
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Bác sĩ thú y hỗ trợ tư vấn phác đồ & giải pháp phòng bệnh
              </span>
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-price-orange" />
                Liên hệ Zalo / Hotline để xác nhận quy cách & báo giá ưu đãi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="site-container flex min-h-[76px] items-center justify-between gap-4 py-3">
        {/* Left: Mobile Drawer Button + Site Logo */}
        <div className="flex items-center gap-2 lg:gap-0">
          <MobileMenu categories={taxonomy.categories} animalTypes={taxonomy.animalTypes} companies={taxonomy.companies} />
          <SiteLogo compact />
        </div>

        {/* Center: Desktop Navigation Bar with Mega Menu */}
        <nav className="hidden items-center justify-center gap-6 xl:flex" aria-label="Điều hướng chính">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-1.5 whitespace-nowrap text-[14px] font-semibold transition-colors duration-200 ${
                "isDeal" in item && item.isDeal
                  ? "text-price-orange hover:text-price-orange-dark"
                  : "text-foreground hover:text-main-green"
              }`}
            >
              {"isDeal" in item && item.isDeal ? <Flame className="size-4 animate-bounce text-price-orange" /> : null}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Mega Menu Dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[14px] font-semibold text-foreground transition-colors hover:text-main-green"
            >
              <span>Sản phẩm</span>
              <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[920px] -translate-x-1/2 rounded-2xl border border-[#eaf0ec] bg-white p-7 opacity-0 shadow-[0_20px_50px_rgba(31,74,58,0.12)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-[1.1fr_1.4fr_1fr] gap-8">
                <div>
                  <h3 className="border-b border-[#eaf0ec] pb-2 text-xs font-bold uppercase tracking-wider text-main-green">
                    Công ty phân phối
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {taxonomy.companies.slice(0, 7).map((company) => (
                      <Link
                        key={company.id}
                        href={`/cong-ty/${company.slug}`}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-price-orange"
                      >
                        {company.name}
                      </Link>
                    ))}
                    <Link href="/san-pham" className="mt-1 text-xs font-bold text-main-green hover:underline">
                      Xem tất cả công ty →
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="border-b border-[#eaf0ec] pb-2 text-xs font-bold uppercase tracking-wider text-main-green">
                    Nhóm công dụng chính
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {taxonomy.categories.filter((c) => c.kind === "product_type").slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/danh-muc/${cat.slug}`}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-price-orange"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#faf3ea] p-4 text-center">
                  <span className="inline-block rounded-full bg-main-green px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                    Vật nuôi & Thú cưng
                  </span>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {taxonomy.animalTypes.map((animal) => (
                      <Link
                        key={animal.id}
                        href={`/vat-nuoi/${animal.slug}`}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-main-green shadow-sm transition-all hover:bg-main-green hover:text-white"
                      >
                        {animal.name}
                      </Link>
                    ))}
                  </div>
                  <Button className="mt-4 w-full rounded-xl bg-price-orange text-xs font-bold text-white hover:bg-price-orange-dark" asChild>
                    <Link href="/san-pham">Khám phá catalogue</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary links */}
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[14px] font-semibold text-foreground transition-colors hover:text-main-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search Box + Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden w-48 sm:w-60 md:block lg:w-72">
            <ProductSearch />
          </div>

          {/* Quick Consultation / Quote Cart Badge */}
          <Link
            href="/san-pham"
            title="Sản phẩm đã chọn & Báo giá"
            className="group relative flex size-10 items-center justify-center rounded-full bg-[#f4f3ef] text-main-green transition-all hover:bg-main-green hover:text-white"
          >
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-price-orange text-[10px] font-bold text-white shadow">
              0
            </span>
          </Link>

          {/* Direct Consultation Hotline Button */}
          <a
            href={getTelephoneUrl(contact.phone)}
            className="hidden items-center gap-2 rounded-full border border-[#eaf0ec] bg-white px-3.5 py-1.5 text-xs font-bold text-main-green shadow-sm transition-all hover:border-main-green hover:bg-[#faf3ea] md:flex"
            title={`Hotline: ${contact.phoneDisplay}`}
          >
            <Phone className="size-3.5 text-price-orange" />
            <span>{contact.phoneDisplay}</span>
          </a>

          {/* Zalo Button */}
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-main-green text-white shadow-sm transition-all hover:bg-[#163b2e] hover:scale-105"
            aria-label="Tư vấn phác đồ qua Zalo"
            title="Chat Zalo Tư Vấn"
          >
            <MessageCircle className="size-5" />
          </a>
        </div>
      </div>

      {/* Mobile Search Bar (Below Header on Small Devices) */}
      <div className="site-container pb-3 pt-1 md:hidden">
        <ProductSearch compact />
      </div>
    </header>
  );
}

function MobileMenu({ categories, animalTypes, companies }: { categories: Category[]; animalTypes: AnimalType[]; companies: Company[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-main-green hover:bg-[#faf3ea] xl:hidden"
          aria-label="Mở menu danh mục"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-[#faf8f5] p-5">
        <SheetHeader className="border-b border-[#eaf0ec] pb-4">
          <SheetTitle><SiteLogo /></SheetTitle>
          <SheetDescription>Dược phẩm & Sản phẩm chăm sóc thú y Vet68</SheetDescription>
        </SheetHeader>

        <nav className="mt-4 grid gap-2" aria-label="Điều hướng mobile">
          <Link href="/" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white hover:text-main-green">
            Trang chủ
          </Link>
          <Link href="/gioi-thieu" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white hover:text-main-green">
            Giới thiệu
          </Link>
          <Link href="/khuyen-mai" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-price-orange transition-colors hover:bg-white">
            <span className="flex items-center gap-1.5"><Flame className="size-4" /> Ưu đãi chớp nhoáng</span>
            <Badge className="bg-price-orange text-[10px] text-white">HOT</Badge>
          </Link>

          <details className="group rounded-xl border border-[#eaf0ec] bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-sm font-bold text-main-green">
              <span>Danh mục sản phẩm</span>
              <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="grid gap-4 border-t border-[#eaf0ec] p-4 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-price-orange">Nhóm vật nuôi</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {animalTypes.map((item) => (
                    <Link key={item.id} href={`/vat-nuoi/${item.slug}`} className="rounded-lg bg-[#faf8f5] p-2 text-center font-semibold text-foreground hover:bg-main-green hover:text-white">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-price-orange">Nhóm công dụng</p>
                <div className="mt-2 grid gap-1.5">
                  {categories.filter((c) => c.kind === "product_type").slice(0, 6).map((item) => (
                    <Link key={item.id} href={`/danh-muc/${item.slug}`} className="font-medium text-muted-foreground hover:text-main-green">
                      • {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <Link href="/kien-thuc-thu-y" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white hover:text-main-green">
            Kiến thức thú y
          </Link>
          <Link href="/lien-he" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white hover:text-main-green">
            Liên hệ & Tư vấn
          </Link>
        </nav>

        <div className="mt-8 rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-main-green uppercase tracking-wider">Cần hỗ trợ gấp?</p>
          <p className="mt-1 text-xs text-muted-foreground">Đội ngũ bác sĩ thú y luôn sẵn sàng tư vấn</p>
          <a
            href="tel:0909000068"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-main-green py-2.5 text-xs font-bold text-white hover:bg-[#163b2e]"
          >
            <Phone className="size-3.5" /> Gọi 0909 000 068
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
