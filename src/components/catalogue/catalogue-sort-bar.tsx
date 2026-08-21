import Link from "next/link";
import { ArrowDownAZ, ArrowDownZA, ArrowDownWideNarrow, ArrowUpNarrowWide, Sparkles } from "lucide-react";
import type { CatalogueFilters, CatalogueSort } from "@/types/catalogue";

const sortOptions: { label: string; value: CatalogueSort; icon: typeof ArrowDownAZ }[] = [
  { label: "Tên A-Z", value: "name_asc", icon: ArrowDownAZ },
  { label: "Tên Z-A", value: "name_desc", icon: ArrowDownZA },
  { label: "Hàng mới", value: "newest", icon: Sparkles },
  { label: "Giá tăng dần", value: "price_asc", icon: ArrowUpNarrowWide },
  { label: "Giá giảm dần", value: "price_desc", icon: ArrowDownWideNarrow },
];

type CatalogueSortBarProps = {
  basePath: string;
  filters: CatalogueFilters;
  total: number;
  currentPage: number;
  pageSize: number;
  mobileFilterTrigger?: React.ReactNode;
};

export function CatalogueSortBar({
  basePath,
  filters,
  total,
  currentPage,
  pageSize,
  mobileFilterTrigger,
}: CatalogueSortBarProps) {
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const buildSortUrl = (sort: CatalogueSort) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.animal) params.set("animal", filters.animal);
    if (filters.category) params.set("category", filters.category);
    if (filters.company) params.set("company", filters.company);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.priceMin !== undefined) params.set("price_min", String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set("price_max", String(filters.priceMax));
    if (filters.dosageForm) params.set("dosage_form", filters.dosageForm);
    if (filters.consultation) params.set("consultation", filters.consultation);
    if (filters.priceMode) params.set("price_mode", filters.priceMode);
    if (sort !== "name_asc") params.set("sort", sort);

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#eaf0ec] bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      {/* Product count & Mobile filter button */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          Hiển thị{" "}
          <strong className="font-bold text-main-green">
            {startItem}-{endItem}
          </strong>{" "}
          trong <strong className="font-bold text-foreground">{total}</strong> sản phẩm
        </div>
        {mobileFilterTrigger && (
          <div className="block lg:hidden">{mobileFilterTrigger}</div>
        )}
      </div>

      {/* Sort Buttons Bar (Wolf Yoga Style) */}
      <div className="flex flex-wrap items-center gap-1 overflow-x-auto text-xs small-scrollbar">
        <span className="hidden text-xs font-semibold text-muted-foreground xl:inline mr-1">
          Sắp xếp:
        </span>
        {sortOptions.map((opt) => {
          const active = filters.sort === opt.value;
          const Icon = opt.icon;
          return (
            <Link
              key={opt.value}
              href={buildSortUrl(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                active
                  ? "bg-main-green font-bold text-white shadow-xs"
                  : "bg-[#faf8f5] text-[#33302f] hover:bg-[#faf3ea] hover:text-main-green"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{opt.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
