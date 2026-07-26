import type { PickRequired } from "@/types/helpers";
import type { Product } from "@/types/catalogue";

export type PriceProduct = PickRequired<Product, "priceDisplayMode"> & Pick<Product, "referencePrice" | "priceNote">;

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

export function getPriceDisplay(product: PriceProduct) {
  if (product.priceDisplayMode === "contact") return { label: "Liên hệ báo giá", detail: product.priceNote };
  if (product.referencePrice === null || product.referencePrice <= 0) return { label: "Liên hệ báo giá", detail: "Giá chưa được công bố." };
  if (product.priceDisplayMode === "approximate") return { label: `Giá tham khảo: khoảng ${formatCurrency(product.referencePrice)}`, detail: product.priceNote };
  return { label: formatCurrency(product.referencePrice), detail: product.priceNote };
}
