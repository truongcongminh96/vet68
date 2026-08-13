"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="paper-page"><div className="site-container flex min-h-[55dvh] flex-col items-center justify-center py-16 text-center"><div className="paper-note max-w-lg p-9"><AlertTriangle className="mx-auto size-10 text-medical-red" aria-hidden="true" /><h1 className="paper-heading mt-4 text-3xl">Không thể tải nội dung</h1><p className="mt-3 max-w-md text-muted-foreground">Đã xảy ra lỗi tạm thời. Bạn có thể thử tải lại hoặc liên hệ Vet68 nếu cần hỗ trợ.</p><Button className="action-button mt-6 rounded-full px-6" onClick={reset}>Thử lại</Button></div></div></div>;
}
