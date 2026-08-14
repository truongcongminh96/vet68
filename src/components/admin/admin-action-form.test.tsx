import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-action-form";
import { adminActionError } from "@/lib/admin/action-state";

describe("AdminActionForm", () => {
  it("hiển thị lỗi server action ngay trên form", async () => {
    const action = vi.fn(async () => adminActionError("Slug đã tồn tại."));
    render(
      <AdminActionForm action={action}>
        <input name="slug" defaultValue="trung-slug" />
        <AdminSubmitButton>Lưu</AdminSubmitButton>
      </AdminActionForm>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Slug đã tồn tại.");
    expect(action).toHaveBeenCalled();
  });
});
