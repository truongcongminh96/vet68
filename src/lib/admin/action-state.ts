import type { ZodError } from "zod";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAdminActionState: AdminActionState = { status: "idle", message: "" };

export function adminActionSuccess(message: string): AdminActionState {
  return { status: "success", message };
}

export function adminActionError(message: string): AdminActionState {
  return { status: "error", message };
}

export function validationErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại form.";
}

export function databaseErrorMessage(
  error: { code?: string; message: string },
  duplicateMessage = "Dữ liệu này đã tồn tại.",
) {
  if (error.code === "23505") return duplicateMessage;
  if (error.code === "23503") return "Dữ liệu đang được sử dụng nên chưa thể thay đổi hoặc xóa.";
  if (error.code === "23514") return "Dữ liệu không đáp ứng điều kiện lưu trong hệ thống.";
  if (error.code === "42501") return "Tài khoản hiện tại không có quyền thực hiện thao tác này.";
  return error.message || "Không thể lưu dữ liệu. Vui lòng thử lại.";
}
