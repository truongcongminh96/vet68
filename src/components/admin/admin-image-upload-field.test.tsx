import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field";

const upload = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({
    storage: {
      from: () => ({
        upload,
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.test/${path}` } }),
      }),
    },
  }),
}));

describe("AdminImageUploadField", () => {
  it("upload ảnh và tự điền storage path vào form", async () => {
    render(
      <AdminImageUploadField
        id="cover"
        name="cover_path"
        label="Ảnh bìa"
        bucket="article-covers"
        folder="covers"
        maxBytes={8 * 1024 * 1024}
      />,
    );
    const file = new File(["image"], "cover.png", { type: "image/png" });

    fireEvent.change(screen.getByLabelText("Chọn tệp ảnh bìa"), { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Tải ảnh lên" }));

    expect(await screen.findByText("Đã tải ảnh lên. Hãy lưu form để áp dụng ảnh này.")).toBeInTheDocument();
    expect((screen.getByLabelText("Ảnh bìa", { selector: "input[readonly]" }) as HTMLInputElement).value).toMatch(/^admin\/covers\/.+\.png$/);
    expect(upload).toHaveBeenCalledWith(expect.stringMatching(/^admin\/covers\/.+\.png$/), file, expect.objectContaining({ upsert: false }));
  });
});
