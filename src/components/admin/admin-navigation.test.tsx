import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminNavigation } from "@/components/admin/admin-navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin/cong-ty" }));

describe("AdminNavigation", () => {
  it("có lối vào trang quản lý công ty phân phối", () => {
    render(<AdminNavigation />);

    expect(screen.getByRole("link", { name: "Công ty phân phối" })).toHaveAttribute("href", "/admin/cong-ty");
  });
});
