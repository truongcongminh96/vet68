import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="paper-page"><div className="site-container flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center"><div className="paper-note max-w-lg p-9"><SearchX className="mx-auto size-12 text-petshop-teal" aria-hidden="true" /><h1 className="paper-heading mt-5 text-4xl">Không tìm thấy trang</h1><p className="mt-3 max-w-md leading-7 text-muted-foreground">Đường dẫn có thể đã thay đổi hoặc nội dung hiện không được công bố.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button className="action-button rounded-full px-5" asChild><Link href="/">Về trang chủ</Link></Button><Button variant="outline" className="rounded-full bg-white px-5" asChild><Link href="/san-pham">Xem sản phẩm</Link></Button></div></div></div></main>;
}
