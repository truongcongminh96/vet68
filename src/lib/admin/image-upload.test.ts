import { describe, expect, it } from "vitest";
import { buildAdminImagePath, validateAdminImageFile } from "@/lib/admin/image-upload";

describe("admin image upload", () => {
  it("chặn file không phải ảnh", () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    expect(validateAdminImageFile(file, 6 * 1024 * 1024)).toBe("Tệp đã chọn không phải hình ảnh được hỗ trợ.");
  });

  it("chặn ảnh vượt giới hạn bucket", () => {
    const file = new File([new Uint8Array(1025)], "large.png", { type: "image/png" });
    expect(validateAdminImageFile(file, 1024)).toBe("Ảnh không được vượt quá 1 KB.");
  });

  it("tạo storage path an toàn từ folder và loại file", () => {
    const file = new File(["image"], "Ảnh đại diện.PNG", { type: "image/png" });
    expect(buildAdminImagePath(file, "article covers", () => "fixed-id")).toBe("admin/article-covers/fixed-id.png");
  });
});
