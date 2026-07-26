import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductSearch({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  return (
    <form action="/tim-kiem" role="search" className="flex w-full items-stretch">
      <label htmlFor={compact ? "header-search-mobile" : "header-search"} className="sr-only">Tìm tên sản phẩm, SKU, thương hiệu hoặc hoạt chất</label>
      <Input id={compact ? "header-search-mobile" : "header-search"} name="q" defaultValue={defaultValue} placeholder="Tìm sản phẩm, SKU, thương hiệu, hoạt chất..." className="h-11 rounded-e-none border-e-0 bg-white text-sm shadow-none md:h-12" />
      <Button type="submit" className="action-button h-11 rounded-s-none px-4 md:h-12" aria-label="Tìm sản phẩm"><Search aria-hidden="true" /><span className="hidden lg:inline">Tìm kiếm</span></Button>
    </form>
  );
}
