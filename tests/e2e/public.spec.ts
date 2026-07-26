import { expect, test } from "@playwright/test";

test("các trang public chính không phát sinh lỗi runtime", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("/_next/webpack-hmr")) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const route of ["/", "/san-pham", "/san-pham/amoxicillin-50-demo"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
  }

  expect(errors).toEqual([]);
});

test("homepage không có cart hoặc checkout", async ({ page }) => { await page.goto("/"); await expect(page.getByRole("heading", { level: 1 })).toContainText("Thuốc thú y chính hãng"); await expect(page.getByText(/thêm vào giỏ/i)).toHaveCount(0); await expect(page.getByText(/checkout|thanh toán online/i)).toHaveCount(0); });
test("catalogue filter được phản ánh trên URL", async ({ page }) => { await page.goto("/san-pham"); await page.getByLabel("Vật nuôi").selectOption("gia-cam"); await page.getByRole("button", { name: "Áp dụng bộ lọc" }).click(); await expect(page).toHaveURL(/animal=gia-cam/); });
test("admin chưa xác thực bị chuyển tới đăng nhập", async ({ page }) => { await page.goto("/admin"); await expect(page).toHaveURL(/admin\/dang-nhap/); });
test("product page có CTA liên hệ và không có mua hàng", async ({ page }) => { await page.goto("/san-pham/amoxicillin-50-demo"); await expect(page.getByRole("heading", { level: 1 })).toContainText("Amoxicillin"); await expect(page.getByRole("button", { name: "Tư vấn qua Zalo" }).first()).toBeVisible(); await expect(page.getByText(/thêm vào giỏ|mua ngay/i)).toHaveCount(0); });
