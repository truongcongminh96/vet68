export function authAdminErrorMessage(error: { message: string }) {
  const message = error.message.toLowerCase();
  if (message.includes("already") && (message.includes("registered") || message.includes("exists"))) {
    return "Email này đã có tài khoản.";
  }
  if (message.includes("rate limit")) {
    return "Hệ thống đã gửi quá nhiều email. Vui lòng chờ rồi thử lại.";
  }
  if (message.includes("invalid email")) return "Địa chỉ email không hợp lệ.";
  return error.message || "Không thể thực hiện thao tác tài khoản.";
}
