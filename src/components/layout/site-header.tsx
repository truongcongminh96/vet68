import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, Phone } from "lucide-react";
import { ProductSearch } from "@/components/layout/product-search";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getTaxonomy } from "@/lib/catalogue/queries";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import type { AnimalType, Category, Company } from "@/types/catalogue";

const primaryNavItems = [
  ["Trang chủ", "/"],
  ["Giới thiệu", "/gioi-thieu"],
] as const;

const secondaryNavItems = [
  ["Thương hiệu", "/#thuong-hieu"],
  ["Khuyến mãi", "/khuyen-mai"],
  ["Kiến thức thú y", "/kien-thuc-thu-y"],
  ["Liên hệ", "/lien-he"],
] as const;

const announcementText = "Giá trên website là giá tham khảo. Vet68 xác nhận giá và quy cách khi tư vấn.";

export async function SiteHeader() {
  const [contact, taxonomy] = await Promise.all([getContactSettings(), getTaxonomy()]);

  return (
    <header className="sticky top-0 z-30 bg-deep-navy text-white shadow-[0_5px_20px_rgba(6,45,62,0.12)]">
      <AnnouncementBar text={announcementText} />

      <div className="site-container grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 md:grid-cols-[220px_minmax(250px,1fr)_auto] xl:grid-cols-[220px_minmax(550px,1fr)_310px_auto]">
        <SiteLogo compact inverted />
        <DesktopNavigation categories={taxonomy.categories} animalTypes={taxonomy.animalTypes} companies={taxonomy.companies} />
        <div className="hidden md:col-start-2 md:block xl:col-start-3"><ProductSearch onDark /></div>
        <div className="flex items-center justify-end gap-1.5">
          <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="hidden size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:flex" aria-label="Tư vấn qua Zalo">
            <MessageCircle className="size-5" aria-hidden="true" />
          </a>
          <a href={getTelephoneUrl(contact.phone)} className="hidden size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:flex" aria-label={`Gọi ${contact.phoneDisplay}`}>
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <MobileMenu categories={taxonomy.categories} animalTypes={taxonomy.animalTypes} companies={taxonomy.companies} />
        </div>
        <div className="col-span-2 md:hidden"><ProductSearch compact onDark /></div>
      </div>
    </header>
  );
}

function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="announcement-bar overflow-hidden bg-petshop-yellow text-primary">
      <div className="announcement-track flex w-max items-center text-xs font-extrabold sm:text-sm">
        <p className="announcement-item">{text}</p>
        <p className="announcement-item" aria-hidden="true">{text}</p>
      </div>
    </div>
  );
}

function DesktopNavigation({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <nav className="hidden h-full items-center justify-center gap-3 xl:flex" aria-label="Điều hướng chính">
      {primaryNavItems.map(([label, href]) => <NavigationLink key={href} href={href}>{label}</NavigationLink>)}
      <details className="group flex h-full items-center">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 whitespace-nowrap text-[13px] font-bold text-white/86 transition-colors hover:text-petshop-yellow">
          Sản phẩm
          <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <MegaMenu categories={categories} animalTypes={animalTypes} companies={companies} />
      </details>
      {secondaryNavItems.map(([label, href]) => <NavigationLink key={href} href={href}>{label}</NavigationLink>)}
    </nav>
  );
}

function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="whitespace-nowrap text-[13px] font-bold text-white/86 transition-colors hover:text-petshop-yellow">{children}</Link>;
}

function MegaMenu({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <div className="absolute inset-x-4 top-full z-40 mt-px rounded-b-[20px] border border-border bg-white p-7 text-foreground petshop-card-shadow">
      <div className="grid grid-cols-[0.95fr_1.35fr_0.9fr] gap-9">
        <MenuColumn title="Công ty phân phối" items={companies} hrefPrefix="/cong-ty" />
        <MenuColumn title="Danh mục" items={categories.filter((item) => item.kind === "product_type")} hrefPrefix="/danh-muc" columns={2} />
        <div className="rounded-2xl bg-petshop-cream/55 p-5">
          <MenuColumn title="Đối tượng sử dụng" items={animalTypes} hrefPrefix="/vat-nuoi" columns={2} emphasized />
          <Button className="action-button mt-6 w-full rounded-full" asChild><Link href="/san-pham">Xem tất cả sản phẩm</Link></Button>
        </div>
      </div>
    </div>
  );
}

function MenuColumn({ title, items, hrefPrefix, columns = 1, emphasized = false }: {
  title: string;
  items: Array<Company | Category | AnimalType>;
  hrefPrefix: string;
  columns?: 1 | 2;
  emphasized?: boolean;
}) {
  return (
    <div>
      <h2 className="border-b border-border pb-3 text-sm font-extrabold text-primary">{title}</h2>
      <div className={`mt-4 grid gap-x-5 gap-y-2.5 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {items.map((item) => (
          <Link key={item.id} href={`${hrefPrefix}/${item.slug}`} className={emphasized ? "text-sm font-semibold text-primary hover:text-medical-red" : "text-sm text-muted-foreground transition-colors hover:text-medical-red"}>{item.name}</Link>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-white xl:hidden" aria-label="Mở menu"><Menu aria-hidden="true" /></Button></SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-[#fffaf0]">
        <SheetHeader className="border-b">
          <SheetTitle><SiteLogo /></SheetTitle>
          <SheetDescription>Danh mục và thông tin Vet Medicine 68</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 px-4 pb-5" aria-label="Điều hướng mobile">
          {primaryNavItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start rounded-full" asChild><Link href={href}>{label}</Link></Button>)}
          <details className="group rounded-2xl border border-border bg-white">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold">
              Sản phẩm
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-5 border-t p-4">
              <MobileMenuGroup title="Công ty phân phối" items={companies} hrefPrefix="/cong-ty" />
              <MobileMenuGroup title="Danh mục" items={categories.filter((item) => item.kind === "product_type")} hrefPrefix="/danh-muc" />
              <MobileMenuGroup title="Đối tượng sử dụng" items={animalTypes} hrefPrefix="/vat-nuoi" />
              <Button className="action-button w-full rounded-full" asChild><Link href="/san-pham">Xem tất cả sản phẩm</Link></Button>
            </div>
          </details>
          {secondaryNavItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start rounded-full" asChild><Link href={href}>{label}</Link></Button>)}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileMenuGroup({ title, items, hrefPrefix }: { title: string; items: Array<Company | Category | AnimalType>; hrefPrefix: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold text-muted-foreground">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
        {items.map((item) => <Link key={item.id} href={`${hrefPrefix}/${item.slug}`} className="text-sm font-semibold text-primary hover:text-medical-red">{item.name}</Link>)}
      </div>
    </div>
  );
}

type TaxonomyProps = { categories: Category[]; animalTypes: AnimalType[]; companies: Company[] };
