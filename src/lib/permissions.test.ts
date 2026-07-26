import { describe, expect, it } from "vitest";
import { canDeleteCatalogue, canManageCatalogue, canManageSiteSettings } from "@/lib/permissions";

describe("staff và admin permissions", () => {
  it("staff quản lý nội dung nhưng không xóa hoặc sửa site settings", () => {
    expect(canManageCatalogue("staff")).toBe(true);
    expect(canDeleteCatalogue("staff")).toBe(false);
    expect(canManageSiteSettings("staff")).toBe(false);
  });

  it("admin có toàn bộ quyền back-office", () => {
    expect(canManageCatalogue("admin")).toBe(true);
    expect(canDeleteCatalogue("admin")).toBe(true);
    expect(canManageSiteSettings("admin")).toBe(true);
  });
});
