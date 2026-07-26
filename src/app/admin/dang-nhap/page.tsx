import type { Metadata } from "next";
import Link from "next/link";
import { SiteLogo } from "@/components/layout/site-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/app/admin/dang-nhap/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const configured = hasSupabaseEnv();
  return <main className="flex min-h-[100dvh] items-center justify-center bg-secondary p-4"><Card className="w-full max-w-md"><CardHeader><SiteLogo /><CardTitle className="mt-4 text-2xl">Khu vực nhân viên</CardTitle><CardDescription>Chỉ staff và admin của Vet Medicine 68 được phép truy cập.</CardDescription></CardHeader><CardContent><LoginForm />{!configured ? <p className="mt-5 rounded-lg border border-highlight/50 bg-highlight/15 p-3 text-sm">Supabase chưa được cấu hình. Hãy cập nhật `.env.local` trước khi đăng nhập.</p> : null}<Link href="/" className="mt-5 block text-center text-sm font-semibold text-primary hover:underline">Về website</Link></CardContent></Card></main>;
}
