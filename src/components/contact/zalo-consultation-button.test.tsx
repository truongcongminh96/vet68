import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZaloConsultationButton } from "@/components/contact/zalo-consultation-button";

describe("ZaloConsultationButton", () => {
  beforeEach(() => { vi.stubGlobal("open", vi.fn()); Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } }); });
  it("mở Zalo và báo đã sao chép", async () => { render(<ZaloConsultationButton zaloUrl="https://zalo.me/123" message="Tin nhắn demo" />); fireEvent.click(screen.getByRole("button", { name: "Tư vấn qua Zalo" })); expect(window.open).toHaveBeenCalled(); await waitFor(() => expect(screen.getByRole("button", { name: "Đã sao chép lời nhắn" })).toBeInTheDocument()); });
  it("hiển thị fallback khi clipboard thất bại", async () => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } }); render(<ZaloConsultationButton zaloUrl="https://zalo.me/123" message="Tin nhắn demo" />); fireEvent.click(screen.getByRole("button", { name: "Tư vấn qua Zalo" })); expect(await screen.findByText("Sao chép nội dung tư vấn")).toBeInTheDocument(); expect(screen.getByDisplayValue("Tin nhắn demo")).toBeInTheDocument(); });
});
