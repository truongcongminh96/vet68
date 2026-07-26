import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductSearch } from "@/components/layout/product-search";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { getTaxonomy } from "@/lib/catalogue/queries";

const navItems = [
  ["Sản phẩm", "/san-pham"],
  ["Khuyến mãi", "/khuyen-mai"],
  ["Kiến thức thú y", "/kien-thuc-thu-y"],
  ["Giới thiệu", "/gioi-thieu"],
  ["Liên hệ", "/lien-he"],
] as const;

export async function SiteHeader() {
  const contact = await getContactSettings();
  const taxonomy = await getTaxonomy();
  return (
    <header className="relative z-30 border-b bg-card">
      <div className="bg-[#073e5f] text-[#f8fbfd]">
        <div className="site-container flex min-h-9 items-center justify-center py-1 text-center text-xs font-semibold sm:text-sm">
          Catalogue tham khảo. Liên hệ Vet68 để xác nhận giá, sản phẩm và tư vấn phù hợp.
        </div>
      </div>
      <div className="site-container grid min-h-[78px] grid-cols-[auto_1fr_auto] items-center gap-3 py-3 lg:grid-cols-[190px_minmax(320px,1fr)_auto] lg:gap-6">
        <div className="hidden lg:block"><SiteLogo /></div>
        <div className="lg:hidden"><SiteLogo compact /></div>
        <div className="hidden md:block"><ProductSearch /></div>
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button variant="ghost" className="hidden xl:inline-flex" asChild><a href={contact.zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn qua Zalo</a></Button>
          <Button variant="outline" className="hidden sm:inline-flex" asChild><a href={getTelephoneUrl(contact.phone)}><Phone aria-hidden="true" /> {contact.phoneDisplay}</a></Button>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden" aria-label="Mở menu"><Menu aria-hidden="true" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader className="border-b"><SheetTitle><SiteLogo /></SheetTitle><SheetDescription>Danh mục và thông tin Vet Medicine 68</SheetDescription></SheetHeader>
              <nav className="grid gap-1 px-4 pb-5" aria-label="Điều hướng mobile">
                {navItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}>{label}</Link></Button>)}
                <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Theo vật nuôi</p>
                {taxonomy.animalTypes.map((item) => <Button key={item.id} variant="ghost" className="justify-start" asChild><Link href={`/vat-nuoi/${item.slug}`}>{item.name}</Link></Button>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="col-span-3 md:hidden"><ProductSearch compact /></div>
      </div>
      <div className="hidden border-t lg:block">
        <div className="site-container flex h-12 items-center gap-7">
          <details className="group relative h-full">
            <summary className="flex h-full cursor-pointer list-none items-center gap-2 font-semibold text-primary">Danh mục sản phẩm <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" /></summary>
            <div className="absolute left-0 top-full z-40 mt-px w-[760px] rounded-b-xl border bg-popover p-6 text-popover-foreground subtle-shadow">
              <div className="grid grid-cols-[1fr_1fr_0.9fr] gap-7">
                <div><h2 className="text-base font-bold">Nhóm sản phẩm</h2><div className="mt-3 grid gap-2">{taxonomy.categories.filter((item) => item.kind === "product_type").map((item) => <Link key={item.id} href={`/danh-muc/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary">{item.name}</Link>)}</div></div>
                <div><h2 className="text-base font-bold">Theo nhu cầu</h2><div className="mt-3 grid gap-2">{taxonomy.categories.filter((item) => item.kind === "treatment_need").map((item) => <Link key={item.id} href={`/danh-muc/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary">{item.name}</Link>)}</div></div>
                <div className="rounded-xl bg-secondary p-4"><h2 className="text-base font-bold">Theo vật nuôi</h2><div className="mt-3 grid grid-cols-2 gap-2">{taxonomy.animalTypes.map((item) => <Link key={item.id} href={`/vat-nuoi/${item.slug}`} className="text-sm font-semibold text-primary hover:underline">{item.name}</Link>)}</div><Button className="mt-5 w-full" asChild><Link href="/san-pham">Xem tất cả</Link></Button></div>
              </div>
            </div>
          </details>
          <nav className="flex items-center gap-7" aria-label="Điều hướng chính">{navItems.slice(1).map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap text-sm font-semibold hover:text-primary">{label}</Link>)}</nav>
        </div>
      </div>
    </header>
  );
}
