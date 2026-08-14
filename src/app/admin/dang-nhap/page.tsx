import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/app/admin/dang-nhap/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const configured = hasSupabaseEnv();
  return (
    <main className="admin-login">
      <div className="admin-backdrop admin-backdrop-grid" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-artwork" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-vignette" aria-hidden="true" />
      <div className="admin-backdrop admin-backdrop-noise" aria-hidden="true" />

      <header className="admin-login-masthead">
        <p className="admin-login-brand">VET68 <b>/ CONTROL</b></p>
        <p className="admin-login-meta">Staff access / 2026</p>
      </header>

      <div className="admin-login-stage">
        <section className="admin-login-task" aria-labelledby="admin-login-title">
          <div className="admin-login-form">
            <p className="admin-login-eyebrow">Auth gate / Staff 01</p>
            <h1 id="admin-login-title">Đăng nhập</h1>
            <p className="admin-login-copy">Dùng tài khoản nhân viên đã được cấp để quản lý catalogue và nội dung Vet Medicine 68.</p>
            <LoginForm />
            {!configured ? <p className="admin-login-notice">Supabase chưa được cấu hình. Hãy cập nhật `.env.local` trước khi đăng nhập.</p> : null}
            <Link href="/" className="admin-login-return">← Về website</Link>
          </div>
        </section>

        <aside className="admin-login-media" aria-label="Artwork nhận diện Vet68">
          <Image className="admin-login-portal" src="/images/admin-signal/vet68-lab-engraving.jpg" alt="" fill priority sizes="(max-width: 800px) 100vw, 56vw" />
          <div className="admin-login-portrait">
            <Image src="/images/admin-signal/vet68-lab-microscope-engraving.jpg" alt="Kỹ thuật viên Vet68 quan sát mẫu bằng kính hiển vi" fill priority sizes="(max-width: 800px) 11rem, 28vw" />
            <span>Identity / 01</span>
          </div>
          <p className="admin-login-media-label">Catalogue / Staff operations</p>
        </aside>
      </div>
    </main>
  );
}
