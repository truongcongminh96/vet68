import { describe, expect, it } from "vitest";
import { authAdminErrorMessage } from "@/lib/admin/auth-error";

describe("authAdminErrorMessage", () => {
  it("dịch lỗi tài khoản đã tồn tại", () => {
    expect(authAdminErrorMessage({ message: "User already registered" })).toBe("Email này đã có tài khoản.");
  });

  it("dịch lỗi gửi email quá nhiều", () => {
    expect(authAdminErrorMessage({ message: "Email rate limit exceeded" })).toContain("quá nhiều email");
  });

  it("giữ thông báo chưa có mapping", () => {
    expect(authAdminErrorMessage({ message: "SMTP unavailable" })).toBe("SMTP unavailable");
  });
});
