import { describe, expect, it } from "vitest";
import { readBannerPreview, readPostPreview } from "@/lib/admin/preview";

describe("admin preview drafts", () => {
  it("đọc dữ liệu bài viết trực tiếp từ form chưa lưu", () => {
    const form = new FormData();
    form.set("title", "Bài viết nháp");
    form.set("excerpt", "Tóm tắt nháp");
    form.set("content_markdown", "## Nội dung");
    form.set("cover_path", "admin/covers/demo.webp");
    form.set("cover_alt", "Ảnh bìa demo");
    expect(readPostPreview(form)).toMatchObject({ title: "Bài viết nháp", content: "## Nội dung", coverPath: "admin/covers/demo.webp" });
  });

  it("đọc layout, ảnh và link banner trực tiếp từ form", () => {
    const form = new FormData();
    form.set("title", "Khuyến mãi");
    form.set("placement", "home_promotion");
    form.set("desktop_image_path", "admin/desktop/banner.webp");
    form.set("link_url", "/san-pham");
    expect(readBannerPreview(form)).toMatchObject({ title: "Khuyến mãi", placement: "home_promotion", desktopPath: "admin/desktop/banner.webp", linkUrl: "/san-pham" });
  });
});
