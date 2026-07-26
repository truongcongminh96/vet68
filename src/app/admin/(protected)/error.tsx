"use client";
import { Button } from "@/components/ui/button";
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="rounded-xl border bg-card p-8 text-center"><h1 className="text-2xl font-extrabold">Không thể tải khu vực quản trị</h1><p className="mt-2 text-muted-foreground">Hãy thử lại. Nếu lỗi tiếp tục, kiểm tra kết nối Supabase và quyền RLS.</p><Button className="mt-5" onClick={reset}>Thử lại</Button></div>; }
