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
  ["Khuyến mãi", "/khuyen-mai"],
  ["Kiến thức thú y", "/kien-thuc-thu-y"],
  ["Liên hệ", "/lien-he"],
] as const;

const announcementText = "Giá trên website là giá tham khảo. Vet68 xác nhận giá và quy cách khi tư vấn.";

export async function SiteHeader() {
  const [contact, taxonomy] = await Promise.all([
    getContactSettings(),
    getTaxonomy(),
  ]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/97 backdrop-blur-md">
      <AnnouncementBar text={announcementText} />

      <div className="site-container grid min-h-[82px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 md:grid-cols-[220px_minmax(320px,1fr)_auto] lg:gap-6">
        <SiteLogo compact />
        <div className="hidden md:block"><ProductSearch /></div>
        <div className="flex items-center justify-end gap-2">
          <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft-blue lg:flex">
            <MessageCircle className="size-4 text-[#1686b5]" aria-hidden="true" />
            <span><span className="block text-[11px] font-medium text-muted-foreground">Tư vấn</span>Zalo Vet68</span>
          </a>
          <a href={getTelephoneUrl(contact.phone)} className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft-blue sm:flex">
            <Phone className="size-4 text-medical-red" aria-hidden="true" />
            <span><span className="block text-[11px] font-medium text-muted-foreground">Hotline</span>{contact.phoneDisplay}</span>
          </a>
          <MobileMenu categories={taxonomy.categories} animalTypes={taxonomy.animalTypes} companies={taxonomy.companies} />
        </div>
        <div className="col-span-2 md:hidden"><ProductSearch compact /></div>
      </div>

      <DesktopNavigation categories={taxonomy.categories} animalTypes={taxonomy.animalTypes} companies={taxonomy.companies} />
    </header>
  );
}

function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="announcement-bar overflow-hidden bg-deep-navy text-white">
      <div className="announcement-track flex w-max items-center text-sm font-semibold sm:text-[15px]">
        <p className="announcement-item">{text}</p>
        <p className="announcement-item" aria-hidden="true">{text}</p>
      </div>
    </div>
  );
}

function DesktopNavigation({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <div className="hidden border-t bg-white xl:block">
      <div className="site-container relative flex h-13 items-center">
        <nav className="flex h-full items-center gap-7" aria-label="Điều hướng chính">
          {primaryNavItems.map(([label, href]) => <NavigationLink key={href} href={href}>{label}</NavigationLink>)}
          <details className="group h-full">
            <summary className="flex h-full cursor-pointer list-none items-center gap-2 whitespace-nowrap font-semibold text-foreground transition-colors hover:text-primary">
              Sản phẩm phân phối
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <MegaMenu categories={categories} animalTypes={animalTypes} companies={companies} />
          </details>
          {secondaryNavItems.map(([label, href]) => <NavigationLink key={href} href={href}>{label}</NavigationLink>)}
        </nav>
      </div>
    </div>
  );
}

function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative whitespace-nowrap text-sm font-semibold text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-action after:transition-transform hover:text-primary hover:after:scale-x-100">
      {children}
    </Link>
  );
}

function MegaMenu({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <div className="absolute inset-x-4 top-full z-40 mt-px rounded-b-2xl border bg-popover p-7 text-popover-foreground subtle-shadow">
      <div className="grid grid-cols-[0.95fr_1.35fr_0.9fr] gap-9">
        <MenuColumn title="Tên Cty" items={companies} hrefPrefix="/cong-ty" />
        <MenuColumn title="Danh mục" items={categories.filter((item) => item.kind === "product_type")} hrefPrefix="/danh-muc" columns={2} />
        <div className="rounded-xl bg-secondary p-5">
          <MenuColumn title="Đối tượng sử dụng" items={animalTypes} hrefPrefix="/vat-nuoi" columns={2} emphasized />
          <Button className="action-button mt-6 w-full" asChild><Link href="/san-pham">Xem tất cả sản phẩm</Link></Button>
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
      <h2 className="border-b border-border pb-3 text-sm font-extrabold uppercase tracking-[0.08em] text-primary">{title}</h2>
      <div className={`mt-4 grid gap-x-5 gap-y-2.5 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {items.map((item) => (
          <Link key={item.id} href={`${hrefPrefix}/${item.slug}`} className={emphasized ? "text-sm font-semibold text-primary hover:underline" : "text-sm text-muted-foreground transition-colors hover:text-primary"}>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ categories, animalTypes, companies }: TaxonomyProps) {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline" size="icon" className="xl:hidden" aria-label="Mở menu"><Menu aria-hidden="true" /></Button></SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
        <SheetHeader className="border-b">
          <SheetTitle><SiteLogo /></SheetTitle>
          <SheetDescription>Danh mục và thông tin Vet Medicine 68</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 px-4 pb-5" aria-label="Điều hướng mobile">
          {primaryNavItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}>{label}</Link></Button>)}
          <details className="group rounded-lg border border-border/80">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between px-3 text-sm font-semibold">
              Sản phẩm phân phối
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-5 border-t p-4">
              <MobileMenuGroup title="Tên Cty" items={companies} hrefPrefix="/cong-ty" />
              <MobileMenuGroup title="Danh mục" items={categories.filter((item) => item.kind === "product_type")} hrefPrefix="/danh-muc" />
              <MobileMenuGroup title="Đối tượng sử dụng" items={animalTypes} hrefPrefix="/vat-nuoi" />
              <Button className="action-button w-full" asChild><Link href="/san-pham">Xem tất cả sản phẩm</Link></Button>
            </div>
          </details>
          {secondaryNavItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}>{label}</Link></Button>)}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileMenuGroup({ title, items, hrefPrefix }: {
  title: string;
  items: Array<Company | Category | AnimalType>;
  hrefPrefix: string;
}) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
        {items.map((item) => <Link key={item.id} href={`${hrefPrefix}/${item.slug}`} className="text-sm font-medium text-primary hover:underline">{item.name}</Link>)}
      </div>
    </div>
  );
}

type TaxonomyProps = {
  categories: Category[];
  animalTypes: AnimalType[];
  companies: Company[];
};
