import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="site-container flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center"><SearchX className="size-12 text-muted-foreground" aria-hidden="true" /><h1 className="mt-5 text-4xl font-extrabold">Không tìm thấy trang</h1><p className="mt-3 max-w-md leading-7 text-muted-foreground">Đường dẫn có thể đã thay đổi hoặc nội dung hiện không được công bố.</p><div className="mt-6 flex gap-3"><Button asChild><Link href="/">Về trang chủ</Link></Button><Button variant="outline" asChild><Link href="/san-pham">Xem sản phẩm</Link></Button></div></main>;
}
