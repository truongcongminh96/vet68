import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SimpleResourcePage } from "@/components/admin/simple-resource-page";

vi.mock("@/app/admin/(protected)/resource-actions", () => ({
  createResourceAction: vi.fn(),
  deleteResourceAction: vi.fn(),
  updateResourceAction: vi.fn(),
}));

describe("SimpleResourcePage for companies", () => {
  it("nạp công ty vào form chỉnh sửa và khóa xóa khi đang có sản phẩm", async () => {
    const user = userEvent.setup();
    render(
      <SimpleResourcePage
        title="Công ty phân phối"
        description="Quản lý công ty"
        resource="companies"
        rows={[{
          id: "1c6b705b-9c53-48fa-b9a6-012fd5bf551b",
          name: "Vet68 Distribution",
          slug: "vet68-distribution",
          website_url: "https://vet68.example",
          usageCount: 2,
        }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sửa" }));
    expect(screen.getByText("Chỉnh sửa")).toBeInTheDocument();
    expect(screen.getByLabelText("Website", { selector: "input[value='https://vet68.example']" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Alt text")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xóa" })).toBeDisabled();
    expect(screen.getByText("Hãy chuyển sản phẩm sang công ty khác trước khi xóa.")).toBeInTheDocument();
  });
});
