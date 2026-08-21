"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnimalType, CatalogueFilters, Category, Company } from "@/types/catalogue";

type PriceRangeOption = {
  label: string;
  min?: number;
  max?: number;
};

const priceRangeOptions: PriceRangeOption[] = [
  { label: "Dưới 100.000đ", max: 100000 },
  { label: "100.000đ - 300.000đ", min: 100000, max: 300000 },
  { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { label: "Trên 1.000.000đ", min: 1000000 },
];

type CatalogueFilterSidebarProps = {
  basePath: string;
  filters: CatalogueFilters;
  companies: Company[];
  animalTypes: AnimalType[];
  categories: Category[];
  dosageForms: string[];
};

export function CatalogueFilterSidebar({
  basePath,
  filters,
  companies,
  animalTypes,
  categories,
  dosageForms,
}: CatalogueFilterSidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper to build URL with toggled filter parameter
  const buildFilterUrl = (updates: Partial<CatalogueFilters>) => {
    const nextFilters = { ...filters, ...updates, page: 1 };
    const params = new URLSearchParams();

    if (nextFilters.query) params.set("q", nextFilters.query);
    if (nextFilters.animal) params.set("animal", nextFilters.animal);
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.company) params.set("company", nextFilters.company);
    if (nextFilters.brand) params.set("brand", nextFilters.brand);
    if (nextFilters.priceMin !== undefined) params.set("price_min", String(nextFilters.priceMin));
    if (nextFilters.priceMax !== undefined) params.set("price_max", String(nextFilters.priceMax));
    if (nextFilters.dosageForm) params.set("dosage_form", nextFilters.dosageForm);
    if (nextFilters.consultation) params.set("consultation", nextFilters.consultation);
    if (nextFilters.priceMode) params.set("price_mode", nextFilters.priceMode);
    if (nextFilters.sort && nextFilters.sort !== "name_asc") params.set("sort", nextFilters.sort);

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Check active counts
  const activeChips: { label: string; removeUrl: string }[] = [];
  if (filters.company) {
    const comp = companies.find((c) => c.slug === filters.company);
    activeChips.push({
      label: `Hãng: ${comp?.name ?? filters.company}`,
      removeUrl: buildFilterUrl({ company: undefined }),
    });
  }
  if (filters.animal) {
    const animal = animalTypes.find((a) => a.slug === filters.animal);
    activeChips.push({
      label: `Vật nuôi: ${animal?.name ?? filters.animal}`,
      removeUrl: buildFilterUrl({ animal: undefined }),
    });
  }
  if (filters.category && basePath === "/san-pham") {
    const cat = categories.find((c) => c.slug === filters.category);
    activeChips.push({
      label: `Nhóm: ${cat?.name ?? filters.category}`,
      removeUrl: buildFilterUrl({ category: undefined }),
    });
  }
  if (filters.dosageForm) {
    activeChips.push({
      label: `Dạng: ${filters.dosageForm}`,
      removeUrl: buildFilterUrl({ dosageForm: undefined }),
    });
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    let priceLabel = "Khoảng giá";
    if (filters.priceMin && filters.priceMax) {
      priceLabel = `${(filters.priceMin / 1000).toLocaleString("vi-VN")}k - ${(filters.priceMax / 1000).toLocaleString("vi-VN")}k`;
    } else if (filters.priceMax) {
      priceLabel = `Dưới ${(filters.priceMax / 1000).toLocaleString("vi-VN")}k`;
    } else if (filters.priceMin) {
      priceLabel = `Trên ${(filters.priceMin / 1000).toLocaleString("vi-VN")}k`;
    }
    activeChips.push({
      label: priceLabel,
      removeUrl: buildFilterUrl({ priceMin: undefined, priceMax: undefined }),
    });
  }

  const isPriceSelected = (option: PriceRangeOption) => {
    return filters.priceMin === option.min && filters.priceMax === option.max;
  };

  const filterBody = (
    <div className="space-y-6">
      {/* 1. Active Filters List (if any) */}
      {activeChips.length > 0 && (
        <div className="rounded-2xl border border-price-orange/20 bg-price-orange/5 p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-price-orange">
            <span>Đang chọn ({activeChips.length})</span>
            <Link
              href={basePath}
              className="inline-flex items-center gap-1 text-[11px] underline hover:text-price-orange-dark"
            >
              <RotateCcw className="size-3" /> Bỏ hết
            </Link>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {activeChips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.removeUrl}
                className="inline-flex items-center gap-1 rounded-md border border-price-orange/30 bg-white px-2 py-1 text-[11px] font-medium text-main-green shadow-2xs hover:border-price-orange"
              >
                <span>{chip.label}</span>
                <X className="size-3 text-price-orange" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. Khoảng giá (Price ranges) */}
      <div className="border-b border-[#f0e6da] pb-5">
        <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-main-green">
          <span>Khoảng giá</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </h4>
        <div className="mt-3 space-y-2 text-xs">
          {priceRangeOptions.map((opt) => {
            const active = isPriceSelected(opt);
            return (
              <Link
                key={opt.label}
                href={
                  active
                    ? buildFilterUrl({ priceMin: undefined, priceMax: undefined })
                    : buildFilterUrl({ priceMin: opt.min, priceMax: opt.max })
                }
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                  active
                    ? "bg-main-green font-bold text-white shadow-2xs"
                    : "text-[#33302f] hover:bg-[#faf3ea]"
                }`}
              >
                <span>{opt.label}</span>
                {active && <Check className="size-3.5" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Công ty phân phối / Thương hiệu */}
      {companies.length > 0 && (
        <div className="border-b border-[#f0e6da] pb-5">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-main-green">
            <span>Công ty phân phối</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </h4>
          <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto pr-1 text-xs small-scrollbar">
            {companies.map((comp) => {
              const active = filters.company === comp.slug;
              return (
                <Link
                  key={comp.id}
                  href={
                    active
                      ? buildFilterUrl({ company: undefined })
                      : buildFilterUrl({ company: comp.slug })
                  }
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                    active
                      ? "bg-main-green font-bold text-white shadow-2xs"
                      : "text-[#33302f] hover:bg-[#faf3ea]"
                  }`}
                >
                  <span className="truncate">{comp.name}</span>
                  {active && <Check className="size-3.5 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Nhóm đối tượng vật nuôi */}
      {animalTypes.length > 0 && (
        <div className="border-b border-[#f0e6da] pb-5">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-main-green">
            <span>Đối tượng sử dụng</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </h4>
          <div className="mt-3 space-y-1.5 text-xs">
            {animalTypes.map((animal) => {
              const active = filters.animal === animal.slug;
              return (
                <Link
                  key={animal.id}
                  href={
                    active
                      ? buildFilterUrl({ animal: undefined })
                      : buildFilterUrl({ animal: animal.slug })
                  }
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                    active
                      ? "bg-main-green font-bold text-white shadow-2xs"
                      : "text-[#33302f] hover:bg-[#faf3ea]"
                  }`}
                >
                  <span>{animal.name}</span>
                  {active && <Check className="size-3.5" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Dạng bào chế */}
      {dosageForms.length > 0 && (
        <div className="border-b border-[#f0e6da] pb-5">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-main-green">
            <span>Dạng bào chế</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </h4>
          <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto pr-1 text-xs small-scrollbar">
            {dosageForms.map((df) => {
              const active = filters.dosageForm === df;
              return (
                <Link
                  key={df}
                  href={
                    active
                      ? buildFilterUrl({ dosageForm: undefined })
                      : buildFilterUrl({ dosageForm: df })
                  }
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                    active
                      ? "bg-main-green font-bold text-white shadow-2xs"
                      : "text-[#33302f] hover:bg-[#faf3ea]"
                  }`}
                >
                  <span className="truncate">{df}</span>
                  {active && <Check className="size-3.5 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Filter Button */}
      <div className="pt-1">
        <Button
          variant="outline"
          asChild
          className="w-full rounded-xl border-main-green/20 text-xs font-bold text-main-green hover:bg-main-green hover:text-white"
        >
          <Link href={basePath} className="flex items-center justify-center gap-1.5">
            <Trash2 className="size-3.5" />
            <span>Xoá tất cả bộ lọc</span>
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Filter Card */}
      <div className="sticky top-20 hidden rounded-3xl border border-[#eaf0ec] bg-white p-5 shadow-[0_8px_25px_rgba(31,74,58,0.05)] lg:block">
        <div className="mb-5 flex items-center justify-between border-b border-[#f0e6da] pb-4">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-main-green">
            <SlidersHorizontal className="size-4 text-price-orange" />
            <span>Bộ lọc sản phẩm</span>
          </div>
          {activeChips.length > 0 && (
            <Link
              href={basePath}
              className="text-[11px] font-semibold text-price-orange hover:underline"
              title="Xoá bộ lọc"
            >
              Xoá lọc
            </Link>
          )}
        </div>
        {filterBody}
      </div>

      {/* Mobile Trigger Button & Drawer */}
      <div className="block lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-main-green/25 bg-white px-3.5 py-2 text-xs font-bold text-main-green shadow-xs hover:bg-[#faf3ea]"
        >
          <Filter className="size-3.5 text-price-orange" />
          <span>Bộ lọc {activeChips.length > 0 && `(${activeChips.length})`}</span>
        </button>

        {/* Mobile Slide-in Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Content */}
            <div className="relative z-10 flex h-full w-[85%] max-w-xs flex-col bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f0e6da] pb-3">
                <div className="flex items-center gap-2 font-bold text-main-green">
                  <SlidersHorizontal className="size-4 text-price-orange" />
                  <span>Bộ lọc sản phẩm</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-[#faf3ea] hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {filterBody}
              </div>

              <div className="border-t border-[#f0e6da] pt-3">
                <Button
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-xl bg-main-green text-xs font-bold uppercase tracking-wider text-white hover:bg-[#163b2e]"
                >
                  Xem kết quả
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
