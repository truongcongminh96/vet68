import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductSearch({ defaultValue = "", compact = false, onDark = false }: { defaultValue?: string; compact?: boolean; onDark?: boolean }) {
  return (
    <form action="/tim-kiem" role="search" className="flex w-full items-stretch">
      <label htmlFor={compact ? "header-search-mobile" : "header-search"} className="sr-only">Tìm tên sản phẩm, SKU, thương hiệu hoặc hoạt chất</label>
      <Input id={compact ? "header-search-mobile" : "header-search"} name="q" defaultValue={defaultValue} placeholder="Tìm sản phẩm..." className={`h-10 rounded-full pe-12 text-sm shadow-none ${onDark ? "border-white/15 bg-white text-primary placeholder:text-muted-foreground" : "bg-white"}`} />
      <Button type="submit" variant="ghost" size="icon" className={`-ms-11 z-10 size-10 rounded-full ${onDark ? "text-primary hover:bg-petshop-cream" : "text-primary"}`} aria-label="Tìm sản phẩm"><Search aria-hidden="true" /></Button>
    </form>
  );
}
