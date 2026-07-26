import { z } from "zod";
import type { Product } from "@/types/catalogue";

export const contactSchema = z.object({
  phone: z.string().min(8),
  phoneDisplay: z.string().min(8),
  zaloUrl: z.string().url(),
  email: z.string().email(),
  address: z.string().min(3),
});

export type ContactSettings = z.infer<typeof contactSchema>;

export function getEnvironmentContactSettings(): ContactSettings {
  return contactSchema.parse({
    phone: process.env.NEXT_PUBLIC_VET68_PHONE ?? "0900000068",
    phoneDisplay: process.env.NEXT_PUBLIC_VET68_PHONE_DISPLAY ?? "0900 000 068",
    zaloUrl: process.env.NEXT_PUBLIC_VET68_ZALO_URL ?? "https://zalo.me/0900000068",
    email: process.env.NEXT_PUBLIC_VET68_EMAIL ?? "lienhe@vetmedicine68.vn",
    address: process.env.NEXT_PUBLIC_VET68_ADDRESS ?? "Địa chỉ demo, vui lòng cập nhật trong Site settings",
  });
}

export function buildProductConsultationMessage(product: Pick<Product, "name" | "sku" | "packaging">, productUrl: string) {
  return `Xin chào Vet Medicine 68, tôi muốn được tư vấn sản phẩm ${product.name}, mã ${product.sku}, quy cách ${product.packaging}. Link sản phẩm: ${productUrl}. Nhờ Vet68 tư vấn giá và cách đặt hàng.`;
}

export function getTelephoneUrl(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
