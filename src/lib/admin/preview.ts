export type PostPreviewDraft = {
  title: string;
  excerpt: string;
  content: string;
  coverPath: string;
  coverAlt: string;
};

export type BannerPreviewDraft = {
  title: string;
  subtitle: string;
  placement: "home_hero" | "home_promotion" | "promotions_page";
  desktopPath: string;
  mobilePath: string;
  imageAlt: string;
  linkUrl: string;
};

export function readPostPreview(formData: FormData): PostPreviewDraft {
  return {
    title: formValue(formData, "title") || "Tiêu đề bài viết",
    excerpt: formValue(formData, "excerpt") || "Tóm tắt bài viết sẽ hiển thị tại đây.",
    content: formValue(formData, "content_markdown") || "Nội dung bài viết chưa được nhập.",
    coverPath: formValue(formData, "cover_path"),
    coverAlt: formValue(formData, "cover_alt") || "Ảnh bìa bài viết",
  };
}

export function readBannerPreview(formData: FormData): BannerPreviewDraft {
  const placement = formValue(formData, "placement");
  return {
    title: formValue(formData, "title") || "Tiêu đề banner",
    subtitle: formValue(formData, "subtitle") || "Mô tả banner sẽ hiển thị tại đây.",
    placement: placement === "home_promotion" || placement === "promotions_page" ? placement : "home_hero",
    desktopPath: formValue(formData, "desktop_image_path"),
    mobilePath: formValue(formData, "mobile_image_path"),
    imageAlt: formValue(formData, "image_alt") || "Ảnh banner",
    linkUrl: safeLink(formValue(formData, "link_url")),
  };
}

function safeLink(value: string) {
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : "";
  } catch {
    return "";
  }
}

function formValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
