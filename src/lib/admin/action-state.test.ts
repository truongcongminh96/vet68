import { describe, expect, it } from "vitest";
import { adminActionError, adminActionSuccess, databaseErrorMessage } from "@/lib/admin/action-state";

describe("admin action state", () => {
  it("tạo trạng thái thành công và thất bại có cùng data shape", () => {
    expect(adminActionSuccess("Đã lưu.")).toEqual({ status: "success", message: "Đã lưu." });
    expect(adminActionError("Không thể lưu.")).toEqual({ status: "error", message: "Không thể lưu." });
  });

  it("dịch các lỗi database phổ biến thành thông báo có thể hành động", () => {
    expect(databaseErrorMessage({ code: "23505", message: "duplicate key" }, "Slug đã tồn tại.")).toBe("Slug đã tồn tại.");
    expect(databaseErrorMessage({ code: "23503", message: "foreign key" })).toContain("đang được sử dụng");
    expect(databaseErrorMessage({ code: "42501", message: "permission denied" })).toContain("không có quyền");
  });

  it("giữ lại thông báo Supabase chưa có mapping", () => {
    expect(databaseErrorMessage({ code: "XX000", message: "Storage unavailable" })).toBe("Storage unavailable");
  });
});
