import type { Metadata } from "next";
import Link from "next/link";
import { SetPasswordForm } from "@/app/admin/dat-mat-khau/set-password-form";

export const metadata: Metadata = { title: "Đặt mật khẩu quản trị", robots: { index: false, follow: false } };

export default function SetPasswordPage() {
  return (
    <main className="admin-login">
      <div className="admin-backdrop admin-backdrop-grid" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-vignette" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-noise" aria-hidden="true" />
      <header className="admin-login-masthead"><p className="admin-login-brand">VET68 <b>/ CONTROL</b></p><p className="admin-login-meta">Credential setup</p></header>
      <div className="admin-login-stage">
        <section className="admin-login-task" aria-labelledby="set-password-title">
          <div className="admin-login-form">
            <p className="admin-login-eyebrow">Auth gate / Password</p>
            <h1 id="set-password-title">Đặt mật khẩu</h1>
            <p className="admin-login-copy">Tạo mật khẩu mới cho lời mời nhân viên hoặc yêu cầu khôi phục tài khoản.</p>
            <SetPasswordForm />
            <Link href="/admin/dang-nhap" className="admin-login-return">← Về đăng nhập</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
