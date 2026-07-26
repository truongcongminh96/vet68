export const SITE_NAME = "Vet Medicine 68";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const DEFAULT_DESCRIPTION = "Catalogue thuốc thú y, vaccine, dinh dưỡng, sát trùng và dụng cụ thú y. Liên hệ Vet Medicine 68 qua Zalo hoặc hotline để được tư vấn.";
export const DEMO_NOTICE = "Website đang hiển thị dữ liệu minh họa. Giá, sản phẩm và nội dung chuyên môn chưa phải thông tin bán hàng chính thức.";

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
