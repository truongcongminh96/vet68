import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductSearch } from "@/components/layout/product-search";
import { SiteLogo } from "@/components/layout/site-logo";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";
import { getTaxonomy } from "@/lib/catalogue/queries";

const navItems = [
  ["Vật nuôi", "/#vat-nuoi"],
  ["Thương hiệu", "/#thuong-hieu"],
  ["Khuyến mãi", "/khuyen-mai"],
  ["Kiến thức thú y", "/kien-thuc-thu-y"],
  ["Về Vet68", "/gioi-thieu"],
  ["Liên hệ", "/lien-he"],
] as const;

export async function SiteHeader() {
  const contact = await getContactSettings();
  const taxonomy = await getTaxonomy();
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/97 backdrop-blur-md">
      <div className="bg-deep-navy text-white">
        <div className="site-container flex min-h-8 items-center justify-center py-1 text-center text-xs font-medium sm:text-sm">
          Giá trên website là giá tham khảo. Vet68 xác nhận giá và quy cách khi tư vấn.
        </div>
      </div>
      <div className="site-container grid min-h-[76px] grid-cols-[auto_1fr_auto] items-center gap-3 py-3 lg:grid-cols-[220px_minmax(320px,1fr)_auto] lg:gap-6">
        <div className="hidden sm:block"><SiteLogo /></div>
        <div className="sm:hidden"><SiteLogo compact /></div>
        <div className="hidden md:block"><ProductSearch /></div>
        <div className="flex items-center justify-end gap-2">
          <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft-blue lg:flex"><MessageCircle className="size-4 text-[#1686b5]" aria-hidden="true" /><span><span className="block text-[11px] font-medium text-muted-foreground">Tư vấn</span>Zalo Vet68</span></a>
          <a href={getTelephoneUrl(contact.phone)} className="hidden items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft-blue sm:flex"><Phone className="size-4 text-medical-red" aria-hidden="true" /><span><span className="block text-[11px] font-medium text-muted-foreground">Hotline</span>{contact.phoneDisplay}</span></a>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="xl:hidden" aria-label="Mở menu"><Menu aria-hidden="true" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader className="border-b"><SheetTitle><SiteLogo /></SheetTitle><SheetDescription>Danh mục và thông tin Vet Medicine 68</SheetDescription></SheetHeader>
              <nav className="grid gap-1 px-4 pb-5" aria-label="Điều hướng mobile">
                <Button variant="ghost" className="justify-start" asChild><Link href="/san-pham">Tất cả sản phẩm</Link></Button>
                {navItems.map(([label, href]) => <Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}>{label}</Link></Button>)}
                <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Theo vật nuôi</p>
                {taxonomy.animalTypes.map((item) => <Button key={item.id} variant="ghost" className="justify-start" asChild><Link href={`/vat-nuoi/${item.slug}`}>{item.name}</Link></Button>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="col-span-3 md:hidden"><ProductSearch compact /></div>
      </div>
      <div className="hidden border-t bg-white xl:block">
        <div className="site-container flex h-12 items-center gap-7">
          <details className="group relative h-full">
            <summary className="flex h-full cursor-pointer list-none items-center gap-2 border-b-2 border-primary font-semibold text-primary">Danh mục sản phẩm <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" /></summary>
            <div className="absolute left-0 top-full z-40 mt-px w-[760px] rounded-b-xl border bg-popover p-6 text-popover-foreground subtle-shadow">
              <div className="grid grid-cols-[1fr_1fr_0.9fr] gap-7">
                <div><h2 className="text-base font-bold">Nhóm sản phẩm</h2><div className="mt-3 grid gap-2">{taxonomy.categories.filter((item) => item.kind === "product_type").map((item) => <Link key={item.id} href={`/danh-muc/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary">{item.name}</Link>)}</div></div>
                <div><h2 className="text-base font-bold">Theo nhu cầu</h2><div className="mt-3 grid gap-2">{taxonomy.categories.filter((item) => item.kind === "treatment_need").map((item) => <Link key={item.id} href={`/danh-muc/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary">{item.name}</Link>)}</div></div>
                <div className="rounded-xl bg-secondary p-4"><h2 className="text-base font-bold">Theo vật nuôi</h2><div className="mt-3 grid grid-cols-2 gap-2">{taxonomy.animalTypes.map((item) => <Link key={item.id} href={`/vat-nuoi/${item.slug}`} className="text-sm font-semibold text-primary hover:underline">{item.name}</Link>)}</div><Button className="mt-5 w-full" asChild><Link href="/san-pham">Xem tất cả</Link></Button></div>
              </div>
            </div>
          </details>
          <nav className="flex items-center gap-7" aria-label="Điều hướng chính">{navItems.map(([label, href]) => <Link key={href} href={href} className="relative whitespace-nowrap text-sm font-semibold text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-action after:transition-transform hover:text-primary hover:after:scale-x-100">{label}</Link>)}</nav>
        </div>
      </div>
    </header>
  );
}
